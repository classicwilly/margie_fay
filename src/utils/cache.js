// MemoryCache - JS version for Node runtime (ESM)
class MemoryCache {
  constructor(ttlSeconds = 60) {
    this.store = new Map();
    this.ttlMs = ttlSeconds * 1000;
  }
  get(key) {
    const e = this.store.get(key);
    if (!e) return null;
    if (Date.now() > e.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return e.value;
  }
  set(key, value) {
    this.store.set(key, { value, expiresAt: Date.now() + this.ttlMs });
  }
  del(key) {
    this.store.delete(key);
  }
  clear() {
    this.store.clear();
  }
}

export default MemoryCache;
