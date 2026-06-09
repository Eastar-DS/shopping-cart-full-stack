import { use, useCallback, useSyncExternalStore } from "react";
import { queryStore } from "./queryStore.instance";

interface UseSuspenseQueryOptions<T> {
  key: string;
  queryFn: () => Promise<T>;
}

export function useSuspenseQuery<T>({
  key,
  queryFn,
}: UseSuspenseQueryOptions<T>): T {
  const subscribe = useCallback(
    (callback: () => void) => queryStore.subscribe(key, callback),
    [key],
  );
  const getSnapshot = useCallback(
    () => queryStore.getSnapshot<T>(key),
    [key],
  );

  const data = useSyncExternalStore(subscribe, getSnapshot);
  const error = queryStore.getError(key);

  if (error) throw error;
  if (data !== undefined) return data;

  return use(queryStore.fetch(key, queryFn));
}
