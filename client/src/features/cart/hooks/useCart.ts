import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
  type Dispatch,
} from "react";
import type { CartFetchState, CartItem } from "../types";
import { selectionReducer, type SelectionAction } from "../selectionReducer";
import { getCart, removeCartItem, updateQuantity } from "../api/cart";
import { toUserMessage } from "../../../shared/api/errorMessages";
import {
  fromSelectedIdsArray,
  toSelectedIdsArray,
} from "../../../shared/utils/selectedIds";

const SELECTED_IDS_STORAGE_KEY = "shopping-cart:selectedIds";

export interface UseCartReturn {
  cartFetch: CartFetchState;
  selectedIds: Set<string>;
  dispatch: Dispatch<SelectionAction>;
  updateItem: (id: string, quantity: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useCart(): UseCartReturn {
  const hasStoredSelectionRef = useRef(
    localStorage.getItem(SELECTED_IDS_STORAGE_KEY) !== null,
  );

  const initializer = (): Set<string> => {
    try {
      const raw = localStorage.getItem(SELECTED_IDS_STORAGE_KEY);
      if (!raw) return new Set();
      const parsed = JSON.parse(raw);
      return fromSelectedIdsArray(parsed);
    } catch {
      return new Set();
    }
  };

  const [cartFetch, setCartFetch] = useState<CartFetchState>({
    status: "idle",
  });
  const [selectedIds, dispatch] = useReducer(
    selectionReducer,
    undefined,
    initializer,
  );

  useEffect(() => {
    try {
      const arr = toSelectedIdsArray(selectedIds);
      localStorage.setItem(SELECTED_IDS_STORAGE_KEY, JSON.stringify(arr));
    } catch {}
  }, [selectedIds]);

  const fetchCartItems = useCallback(async () => {
    setCartFetch({ status: "loading" });
    try {
      const data: CartItem[] = await getCart();
      setCartFetch({ status: "success", items: data });

      const itemIds = data.map((item) => item.id);
      const nextIds = hasStoredSelectionRef.current
        ? itemIds.filter((id) => selectedIdsRef.current.has(id))
        : itemIds;
      dispatch({ type: "SELECT_ALL", ids: nextIds });
    } catch (e) {
      const message = toUserMessage(e);
      setCartFetch({ status: "error", message });
    }
  }, []);

  const selectedIdsRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    selectedIdsRef.current = selectedIds;
  }, [selectedIds]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const updateItem = async (id: string, quantity: number): Promise<void> => {
    try {
      await updateQuantity(id, quantity);
      setCartFetch((prev) => {
        if (prev.status !== "success") return prev;
        return {
          ...prev,
          items: prev.items.map((item) =>
            item.id === id ? { ...item, quantity } : item,
          ),
        };
      });
    } catch (e) {
      alert(toUserMessage(e));
      throw e;
    }
  };

  const removeItem = async (id: string): Promise<void> => {
    try {
      await removeCartItem(id);
      setCartFetch((prev) => {
        if (prev.status !== "success") return prev;
        return {
          ...prev,
          items: prev.items.filter((item) => item.id !== id),
        };
      });
      if (selectedIds.has(id)) {
        dispatch({ type: "TOGGLE_ITEM", id });
      }
    } catch (e) {
      alert(toUserMessage(e));
      throw e;
    }
  };

  return {
    cartFetch,
    selectedIds,
    dispatch,
    updateItem,
    removeItem,
    refetch: fetchCartItems,
  };
}
