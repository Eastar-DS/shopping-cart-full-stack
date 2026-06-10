import { QueryStore } from "./queryStore";

describe("QueryStore", () => {
  let store: QueryStore;

  beforeEach(() => {
    store = new QueryStore();
  });

  describe("fetch + getSnapshot", () => {
    test("fetch 성공 시 queryCache 에 데이터 저장", async () => {
      const data = await store.fetch("k", async () => 42);

      expect(data).toBe(42);
      expect(store.getSnapshot<number>("k")).toBe(42);
    });

    test("fetch 실패 시 errorCache 에 에러 저장 + reject", async () => {
      const err = new Error("boom");

      await expect(store.fetch("k", async () => Promise.reject(err))).rejects.toBe(err);

      expect(store.getError("k")).toBe(err);
      expect(store.getSnapshot("k")).toBeUndefined();
    });

    test("in-flight 중복 호출은 같은 promise 반환 (dedup)", async () => {
      let callCount = 0;
      const queryFn = async () => {
        callCount += 1;
        return "data";
      };

      const p1 = store.fetch("k", queryFn);
      const p2 = store.fetch("k", queryFn);

      expect(p1).toBe(p2);

      await Promise.all([p1, p2]);
      expect(callCount).toBe(1);
    });
  });

  describe("subscribe + notify", () => {
    test("setQuery 시 구독자 callback 호출", () => {
      const cb = jest.fn();
      store.subscribe("k", cb);

      store.setQuery("k", "data");

      expect(cb).toHaveBeenCalledTimes(1);
    });

    test("다른 key 의 setQuery 는 영향 X", () => {
      const cb = jest.fn();
      store.subscribe("k", cb);

      store.setQuery("other", "data");

      expect(cb).not.toHaveBeenCalled();
    });

    test("unsubscribe 후 callback 호출되지 않음", () => {
      const cb = jest.fn();
      const unsubscribe = store.subscribe("k", cb);

      unsubscribe();
      store.setQuery("k", "data");

      expect(cb).not.toHaveBeenCalled();
    });

    test("setError 시 구독자 callback 호출", () => {
      const cb = jest.fn();
      store.subscribe("k", cb);

      store.setError("k", new Error("x"));

      expect(cb).toHaveBeenCalledTimes(1);
    });
  });

  describe("invalidate", () => {
    test("invalidate 시 3 개 cache 모두 비우고 listeners 통지", async () => {
      await store.fetch("k", async () => "data");
      expect(store.getSnapshot("k")).toBe("data");

      const cb = jest.fn();
      store.subscribe("k", cb);

      store.invalidate("k");

      expect(store.getSnapshot("k")).toBeUndefined();
      expect(store.getError("k")).toBeUndefined();
      expect(cb).toHaveBeenCalledTimes(1);
    });

    test("invalidate 는 listeners 자체는 유지", async () => {
      const cb = jest.fn();
      store.subscribe("k", cb);

      store.invalidate("k");
      cb.mockClear();

      store.setQuery("k", "fresh");
      expect(cb).toHaveBeenCalledTimes(1);
    });

    test("invalidate 후 다시 fetch 호출 가능 (promiseCache 비워졌으므로)", async () => {
      let count = 0;
      const queryFn = async () => ++count;

      await store.fetch("k", queryFn);
      store.invalidate("k");
      await store.fetch("k", queryFn);

      expect(count).toBe(2);
    });
  });

  describe("setQuery", () => {
    test("setQuery 시 errorCache 도 함께 비움 (mutation 성공 후 stale error 제거)", async () => {
      store.setError("k", new Error("x"));
      expect(store.getError("k")).toBeDefined();

      store.setQuery("k", "ok");

      expect(store.getError("k")).toBeUndefined();
    });
  });

  describe("reset", () => {
    test("reset 은 모든 cache + listeners 비움 + 구독자 통지", async () => {
      await store.fetch("k", async () => "data");
      const cb = jest.fn();
      store.subscribe("k", cb);

      store.reset();

      expect(store.getSnapshot("k")).toBeUndefined();
      expect(cb).toHaveBeenCalledTimes(1);

      cb.mockClear();
      store.setQuery("k", "new");
      expect(cb).not.toHaveBeenCalled();
    });
  });
});
