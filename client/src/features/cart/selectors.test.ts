import {
  selectSubtotal,
  selectShippingFee,
  selectTotal,
  selectIsAllSelected,
  selectIsIndeterminate,
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_FEE,
} from "./selectors";
import type { CartItem } from "./types";

const mkItem = (id: string, price: number, quantity: number): CartItem => ({
  id,
  product: { id: `p-${id}`, name: `상품${id}`, price, imageUrl: "/x" },
  quantity,
});

describe("selectSubtotal", () => {
  test("선택 0 개 → 0", () => {
    expect(selectSubtotal([mkItem("1", 1000, 1)], new Set())).toBe(0);
  });

  test("전체 선택 → 모든 가격 × 수량 합", () => {
    expect(
      selectSubtotal(
        [mkItem("1", 1000, 2), mkItem("2", 500, 3)],
        new Set(["1", "2"]),
      ),
    ).toBe(2000 + 1500);
  });

  test("일부 선택 → 선택된 것만", () => {
    expect(
      selectSubtotal(
        [mkItem("1", 1000, 2), mkItem("2", 500, 3)],
        new Set(["1"]),
      ),
    ).toBe(2000);
  });
});

describe("selectShippingFee — 임계값", () => {
  test.each([
    [0, SHIPPING_FEE],
    [99_999, SHIPPING_FEE],
    [FREE_SHIPPING_THRESHOLD, 0],
    [200_000, 0],
  ])("subtotal=%i → %i", (price, expected) => {
    expect(selectShippingFee([mkItem("1", price, 1)], new Set(["1"]))).toBe(
      expected,
    );
  });
});

describe("selectIsAllSelected", () => {
  test("items 빈 → false", () => {
    expect(selectIsAllSelected([], new Set())).toBe(false);
  });

  test("일부 선택 → false", () => {
    expect(
      selectIsAllSelected(
        [mkItem("1", 1, 1), mkItem("2", 1, 1)],
        new Set(["1"]),
      ),
    ).toBe(false);
  });

  test("전체 선택 → true", () => {
    expect(
      selectIsAllSelected(
        [mkItem("1", 1, 1), mkItem("2", 1, 1)],
        new Set(["1", "2"]),
      ),
    ).toBe(true);
  });
});

describe("selectIsIndeterminate", () => {
  test("빈 → false", () => {
    expect(selectIsIndeterminate([], new Set())).toBe(false);
  });

  test("일부 선택 → true", () => {
    expect(
      selectIsIndeterminate(
        [mkItem("1", 1, 1), mkItem("2", 1, 1)],
        new Set(["1"]),
      ),
    ).toBe(true);
  });

  test("전체 선택 → false", () => {
    expect(
      selectIsIndeterminate(
        [mkItem("1", 1, 1), mkItem("2", 1, 1)],
        new Set(["1", "2"]),
      ),
    ).toBe(false);
  });
});
