import type { CartItem } from "./types";

export const FREE_SHIPPING_THRESHOLD = 100_000;
export const SHIPPING_FEE = 3_000;

export const selectSubtotal = (
  items: CartItem[],
  selectedIds: Set<string>,
): number =>
  items
    .filter((item) => selectedIds.has(item.id))
    .reduce((sum, item) => sum + item.product.price * item.quantity, 0);

export const selectShippingFee = (
  items: CartItem[],
  selectedIds: Set<string>,
): number =>
  selectSubtotal(items, selectedIds) >= FREE_SHIPPING_THRESHOLD
    ? 0
    : SHIPPING_FEE;

export const selectTotal = (
  items: CartItem[],
  selectedIds: Set<string>,
): number =>
  selectSubtotal(items, selectedIds) + selectShippingFee(items, selectedIds);

export const selectIsAllSelected = (
  items: CartItem[],
  selectedIds: Set<string>,
): boolean => items.length > 0 && selectedIds.size === items.length;

export const selectIsIndeterminate = (
  items: CartItem[],
  selectedIds: Set<string>,
): boolean => selectedIds.size > 0 && !selectIsAllSelected(items, selectedIds);
