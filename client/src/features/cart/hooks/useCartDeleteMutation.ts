import { toUserMessage } from "../../../shared/api/errorMessages";
import { queryStore, useMutation } from "../../../shared/queries";
import { removeCartItem } from "../api/cart";
import { CART_QUERY_KEY } from "./useCartQuery";
import type { CartItem } from "../types";

export function useCartDeleteMutation() {
  return useMutation<void, string>({
    mutateFn: (id) => removeCartItem(id),
    onSuccess: (_data, deletedId) => {
      const current = queryStore.getSnapshot<CartItem[]>(CART_QUERY_KEY) ?? [];
      const next = current.filter((item) => item.id !== deletedId);
      queryStore.setQuery(CART_QUERY_KEY, next);
    },
    onError: (error) => alert(toUserMessage(error)),
  });
}
