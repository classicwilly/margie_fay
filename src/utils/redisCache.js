/*
  RedisCache - a small wrapper around ioredis for TTL-based caching
  NOTE: This implementation handles JSON serialization and TTL handling.
*/
import Redis from "ioredis";

class RedisCache {
  constructor(ttlSeconds = 60, redisUrl = process.env.REDIS_URL) {
    this.ttl = ttlSeconds;
    this.ready = false;
    if (!redisUrl) {
      // Don't throw in runtime; caller should fallback to MemoryCache
      this.redis = null;
      return;
    }
    this.redis = new Redis(redisUrl);
    this.redis.on("ready", () => {
      this.ready = true;
    });
    this.redis.on("error", (err) => {
      console.warn("Redis cache error", err.message || err);
    });
  }
  async get(key) {
    if (!this.redis) return null;
    try {
      const raw = await this.redis.get(key);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      console.warn("Redis get error", e?.message || e);
      return null;
    }
  }
  async set(key, value) {
    if (!this.redis) return;
    try {
      await this.redis.set(key, JSON.stringify(value), "EX", this.ttl);
    } catch (e) {
      console.warn("Redis set error", e?.message || e);
    }
  }
  async del(key) {
    if (!this.redis) return;
    try {
      await this.redis.del(key);
    } catch (e) {
      /* ignore */
    }
  }
  async clear() {
    if (!this.redis) return;
    if (process.env.REDIS_CONFIRM_CLEAR === "true") await this.redis.flushdb();
  }
  async disconnect() {
    if (this.redis) await this.redis.quit();
  }
}

export default RedisCache;
