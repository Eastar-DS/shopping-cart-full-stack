import { useEffect, useReducer, useRef, type Dispatch } from "react";
import { queryStore } from "../../../shared/queries";
import { toUserMessage } from "../../../shared/api/errorMessages";
import {
  fromSelectedIdsArray,
  toSelectedIdsArray,
} from "../../../shared/utils/selectedIds";
import { removeCartItem, updateQuantity } from "../api/cart";
import { CART_QUERY_KEY } from "./useCartQuery";
import { selectionReducer, type SelectionAction } from "../selectionReducer";
import type { CartItem } from "../types";

const SELECTED_IDS_STORAGE_KEY = "shopping-cart:selectedIds";

export interface UseCartReturn {
  selectedIds: Set<string>;
  dispatch: Dispatch<SelectionAction>;
  updateItem: (id: string, quantity: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
}

export function useCart(items: CartItem[]): UseCartReturn {
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

  // items 가 바뀔 때만 동기화 — selectedIds 는 의도적으로 deps 제외 (재귀 sync 방지)
  const lastSyncedItemsRef = useRef<CartItem[] | null>(null);
  useEffect(() => {
    if (lastSyncedItemsRef.current === items) return;
    lastSyncedItemsRef.current = items;

    const itemIds = items.map((item) => item.id);
    const nextIds = hasStoredSelectionRef.current
      ? itemIds.filter((id) => selectedIds.has(id))
      : itemIds;
    dispatch({ type: "SELECT_ALL", ids: nextIds });
  }, [items, selectedIds]);

  const updateItem = async (id: string, quantity: number): Promise<void> => {
    try {
      const updated = await updateQuantity(id, quantity);
      const current = queryStore.getSnapshot<CartItem[]>(CART_QUERY_KEY) ?? [];
      const next = current.map((item) =>
        item.id === id ? updated : item,
      );
      queryStore.setQuery(CART_QUERY_KEY, next);
    } catch (e) {
      alert(toUserMessage(e));
      throw e;
    }
  };

  const removeItem = async (id: string): Promise<void> => {
    try {
      await removeCartItem(id);
      const current = queryStore.getSnapshot<CartItem[]>(CART_QUERY_KEY) ?? [];
      const next = current.filter((item) => item.id !== id);
      queryStore.setQuery(CART_QUERY_KEY, next);
      if (selectedIds.has(id)) {
        dispatch({ type: "TOGGLE_ITEM", id });
      }
    } catch (e) {
      alert(toUserMessage(e));
      throw e;
    }
  };

  return {
    selectedIds,
    dispatch,
    updateItem,
    removeItem,
  };
}
