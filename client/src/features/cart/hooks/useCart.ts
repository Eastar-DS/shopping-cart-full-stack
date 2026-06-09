import { useEffect, useReducer, useRef, type Dispatch } from "react";
import {
  fromSelectedIdsArray,
  toSelectedIdsArray,
} from "../../../shared/utils/selectedIds";
import { selectionReducer, type SelectionAction } from "../selectionReducer";
import type { CartItem } from "../types";

const SELECTED_IDS_STORAGE_KEY = "shopping-cart:selectedIds";

export interface UseCartReturn {
  selectedIds: Set<string>;
  dispatch: Dispatch<SelectionAction>;
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

  // items 가 바뀔 때 — stored 가 있으면 교집합, 없으면 전체 선택
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

  return { selectedIds, dispatch };
}
