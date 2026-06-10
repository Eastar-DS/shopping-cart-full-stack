import { useCallback, useEffect, useRef, useState } from "react";
import {
  fromSelectedIdsArray,
  toSelectedIdsArray,
} from "../../../shared/utils/selectedIds";
import type { CartItem } from "../types";

const STORAGE_KEY = "shopping-cart:selectedIds";

function loadFromStorage(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    return fromSelectedIdsArray(JSON.parse(raw));
  } catch {
    return new Set();
  }
}

function saveToStorage(ids: Set<string>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSelectedIdsArray(ids)));
  } catch {}
}

export interface UseCheckedItemsReturn {
  ids: Set<string>;
  toggle: (id: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
}

export function useCheckedItems(items: CartItem[]): UseCheckedItemsReturn {
  const hasStoredRef = useRef(localStorage.getItem(STORAGE_KEY) !== null);
  const [ids, setIds] = useState<Set<string>>(loadFromStorage);

  useEffect(() => {
    saveToStorage(ids);
  }, [ids]);

  // items 가 바뀌면 — stored 가 있으면 교집합, 없으면 전체 선택
  const lastSyncedItemsRef = useRef<CartItem[] | null>(null);
  useEffect(() => {
    if (lastSyncedItemsRef.current === items) return;
    lastSyncedItemsRef.current = items;

    setIds((prev) => {
      const itemIds = items.map((it) => it.id);
      return hasStoredRef.current
        ? new Set(itemIds.filter((id) => prev.has(id)))
        : new Set(itemIds);
    });
  }, [items]);

  const toggle = useCallback((id: string) => {
    setIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setIds(new Set(items.map((it) => it.id)));
  }, [items]);

  const deselectAll = useCallback(() => {
    setIds(new Set());
  }, []);

  return { ids, toggle, selectAll, deselectAll };
}
