import { toSelectedIdsArray, fromSelectedIdsArray } from "./selectedIds";

describe("toSelectedIdsArray", () => {
  test("빈 Set 은 빈 배열", () => {
    expect(toSelectedIdsArray(new Set())).toEqual([]);
  });

  test("항목 있는 Set 을 *정렬된* 배열로 반환", () => {
    expect(toSelectedIdsArray(new Set(["3", "1", "2"]))).toEqual([
      "1",
      "2",
      "3",
    ]);
  });
});

describe("fromSelectedIdsArray", () => {
  test("빈 배열 → 빈 Set", () => {
    expect(fromSelectedIdsArray([])).toEqual(new Set());
  });

  test("문자열 배열 → Set", () => {
    expect(fromSelectedIdsArray(["a", "b"])).toEqual(new Set(["a", "b"]));
  });

  test("비-배열 → 빈 Set (방어적)", () => {
    expect(fromSelectedIdsArray(null)).toEqual(new Set());
    expect(fromSelectedIdsArray("not-an-array")).toEqual(new Set());
    expect(fromSelectedIdsArray(undefined)).toEqual(new Set());
  });

  test("섞인 타입 → 문자열만", () => {
    expect(fromSelectedIdsArray(["a", 1, "b", null])).toEqual(
      new Set(["a", "b"]),
    );
  });
});
