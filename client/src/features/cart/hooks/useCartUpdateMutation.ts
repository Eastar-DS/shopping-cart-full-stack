import { toUserMessage } from "../../../shared/api/errorMessages";
import { queryStore, useMutation } from "../../../shared/queries";
import { updateQuantity } from "../api/cart";
import { CART_QUERY_KEY } from "./useCartQuery";
import type { CartItem } from "../types";

interface UpdateVariables {
  id: string;
  quantity: number;
}

interface UpdateContext {
  prev: CartItem[];
}

export function useCartUpdateMutation() {
  return useMutation<CartItem, UpdateVariables, UpdateContext>({
    mutateFn: ({ id, quantity }) => updateQuantity(id, quantity),

    onMutate: ({ id, quantity }) => {
      const prev = queryStore.getSnapshot<CartItem[]>(CART_QUERY_KEY) ?? [];
      const next = prev.map((item) =>
        item.id === id ? { ...item, quantity } : item,
      );
      queryStore.setQuery(CART_QUERY_KEY, next);
      return { prev };
    },

    onSuccess: (updatedItem) => {
      const current = queryStore.getSnapshot<CartItem[]>(CART_QUERY_KEY) ?? [];
      const next = current.map((item) =>
        item.id === updatedItem.id ? updatedItem : item,
      );
      queryStore.setQuery(CART_QUERY_KEY, next);
    },

    onError: (error, _variables, context) => {
      queryStore.setQuery(CART_QUERY_KEY, context.prev);
      alert(toUserMessage(error));
    },
  });
}
