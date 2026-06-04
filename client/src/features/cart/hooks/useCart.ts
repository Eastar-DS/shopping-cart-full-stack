import { useEffect, useReducer, useState, type Dispatch } from "react";
import type { CartFetchState, CartItem } from "../types";
import {
  initialSelection,
  selectionReducer,
  type SelectionAction,
} from "../selectionReducer";
import { getCart } from "../api/cart";
import { toUserMessage } from "../../../shared/api/errorMessages";

export interface UseCartReturn {
  cartFetch: CartFetchState;
  selectedIds: Set<string>;
  dispatch: Dispatch<SelectionAction>;
}

export function useCart(): UseCartReturn {
  const [cartFetch, setCartFetch] = useState<CartFetchState>({
    status: "idle",
  });
  const [selectedIds, dispatch] = useReducer(
    selectionReducer,
    initialSelection,
  );

  useEffect(() => {
    const fetchCartItems = async () => {
      setCartFetch({ status: "loading" });
      try {
        const data: CartItem[] = await getCart();
        setCartFetch({ status: "success", items: data });
        dispatch({ type: "SELECT_ALL", ids: data.map((item) => item.id) });
      } catch (e) {
        const message = toUserMessage(e);
        setCartFetch({ status: "error", message: message });
      }
    };
    fetchCartItems();
  }, []);

  return { cartFetch, selectedIds, dispatch };
}
