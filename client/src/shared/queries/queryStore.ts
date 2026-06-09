export class QueryStore {
  private queryCache: Map<string, unknown>;
  private promiseCache: Map<string, Promise<unknown>>;
  private errorCache: Map<string, Error>;
  private listeners: Map<string, Set<() => void>>;

  constructor() {
    this.queryCache = new Map();
    this.promiseCache = new Map();
    this.errorCache = new Map();
    this.listeners = new Map();
  }

  getSnapshot<T>(key: string): T | undefined {
    return this.queryCache.get(key) as T | undefined;
  }

  getError(key: string): Error | undefined {
    return this.errorCache.get(key);
  }

  fetch<T>(key: string, queryFn: () => Promise<T>): Promise<T> {
    const inFlight = this.promiseCache.get(key);
    if (inFlight) return inFlight as Promise<T>;

    const promise = queryFn()
      .then((data) => {
        this.setQuery(key, data);
        return data;
      })
      .catch((error) => {
        this.setError(key, error);
        throw error;
      });

    this.promiseCache.set(key, promise);
    return promise;
  }

  setQuery<T>(key: string, data: T): void {
    this.queryCache.set(key, data);
    this.errorCache.delete(key);
    this.notify(key);
  }

  setError(key: string, error: unknown): void {
    this.errorCache.set(key, error as Error);
    this.notify(key);
  }

  invalidate(key: string): void {
    this.queryCache.delete(key);
    this.promiseCache.delete(key);
    this.errorCache.delete(key);
    this.notify(key);
  }

  subscribe(key: string, callback: () => void): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(callback);

    return () => {
      this.listeners.get(key)?.delete(callback);
    };
  }

  reset(): void {
    this.queryCache.clear();
    this.promiseCache.clear();
    this.errorCache.clear();
    this.listeners.forEach((set) => set.forEach((cb) => cb()));
    this.listeners.clear();
  }

  private notify(key: string): void {
    this.listeners.get(key)?.forEach((cb) => cb());
  }
}
