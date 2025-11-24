// Small memory TTL cache used for dev and single-instance server deployments.
// Note: In serverless environments this is short-lived. For production consider Redis or Memcached.
interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

class MemoryCache<T> {
  private store = new Map<string, CacheEntry<T>>();
  private ttlMs: number;
  constructor(ttlSeconds = 60) {
    this.ttlMs = ttlSeconds * 1000;
  }
  get(key: string): T | null {
    const e = this.store.get(key);
    if (!e) {
      return null;
    }
    if (Date.now() > e.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return e.value;
  }
  set(key: string, value: T) {
    this.store.set(key, { value, expiresAt: Date.now() + this.ttlMs });
  }
  del(key: string) {
    this.store.delete(key);
  }
  clear() {
    this.store.clear();
  }
}

export default MemoryCache;
