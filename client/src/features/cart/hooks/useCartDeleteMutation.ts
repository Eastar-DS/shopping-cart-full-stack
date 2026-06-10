import { toUserMessage } from "../../../shared/api/errorMessages";
import { queryStore, useMutation } from "../../../shared/queries";
import { removeCartItem } from "../api/cart";
import { CART_QUERY_KEY } from "./useCartQuery";
import type { CartItem } from "../types";

interface DeleteContext {
  prev: CartItem[];
}

export function useCartDeleteMutation() {
  return useMutation<void, string, DeleteContext>({
    mutateFn: (id) => removeCartItem(id),

    onMutate: (id) => {
      const prev = queryStore.getSnapshot<CartItem[]>(CART_QUERY_KEY) ?? [];
      queryStore.setQuery(
        CART_QUERY_KEY,
        prev.filter((item) => item.id !== id),
      );
      return { prev };
    },

    onError: (error, _id, context) => {
      queryStore.setQuery(CART_QUERY_KEY, context.prev);
      alert(toUserMessage(error));
    },
  });
}
