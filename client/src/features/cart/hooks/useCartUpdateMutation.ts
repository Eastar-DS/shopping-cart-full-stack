import { toUserMessage } from "../../../shared/api/errorMessages";
import { queryStore, useMutation } from "../../../shared/queries";
import { updateQuantity } from "../api/cart";
import { CART_QUERY_KEY } from "./useCartQuery";
import type { CartItem } from "../types";

interface UpdateVariables {
  id: string;
  quantity: number;
}

export function useCartUpdateMutation() {
  return useMutation<CartItem, UpdateVariables>({
    mutateFn: ({ id, quantity }) => updateQuantity(id, quantity),
    onSuccess: (updatedItem) => {
      const current = queryStore.getSnapshot<CartItem[]>(CART_QUERY_KEY) ?? [];
      const next = current.map((item) =>
        item.id === updatedItem.id ? updatedItem : item,
      );
      queryStore.setQuery(CART_QUERY_KEY, next);
    },
    onError: (error) => alert(toUserMessage(error)),
  });
}
