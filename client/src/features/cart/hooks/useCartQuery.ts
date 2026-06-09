import { getCart } from "../api/cart";
import { useSuspenseQuery } from "../../../shared/queries";
import type { CartItem } from "../types";

export const CART_QUERY_KEY = "cart";

export function useCartQuery(): CartItem[] {
  return useSuspenseQuery<CartItem[]>({
    key: CART_QUERY_KEY,
    queryFn: getCart,
  });
}
