import Redis from "ioredis";

// Simple distributed queue with Redis (RPUSH/BRPOP) and in-memory fallback.
export function createQueue(redisUrl) {
  if (redisUrl) {
    const client = new Redis(redisUrl);
    const keyPrefix = "queue:";
    return {
      async push(listKey, item) {
        await client.rpush(keyPrefix + listKey, JSON.stringify(item));
      },
      // Pop with BRPOP and timeout seconds (0 blocks indefinitely) - We use 1 sec as default.
      async pop(listKey, timeoutSeconds = 1) {
        try {
          const res = await client.brpop(keyPrefix + listKey, timeoutSeconds);
          if (!res) return null;
          // res is [listKey, value]
          return JSON.parse(res[1]);
        } catch (e) {
          console.warn("redis queue pop error", e?.message || e);
          return null;
        }
      },
      async len(listKey) {
        try {
          return await client.llen(keyPrefix + listKey);
        } catch (e) {
          return 0;
        }
      },
      async peek(listKey, count = 20) {
        try {
          const r = await client.lrange(keyPrefix + listKey, 0, count - 1);
          return r.map((j) => JSON.parse(j));
        } catch (e) {
          return [];
        }
      },
      async disconnect() {
        if (client) await client.quit();
      },
    };
  }
  // In-memory fallback
  const queues = {};
  return {
    async push(listKey, item) {
      queues[listKey] = queues[listKey] || [];
      queues[listKey].push(item);
    },
    async pop(listKey) {
      queues[listKey] = queues[listKey] || [];
      return queues[listKey].shift() || null;
    },
    async len(listKey) {
      queues[listKey] = queues[listKey] || [];
      return queues[listKey].length;
    },
    async peek(listKey, count = 20) {
      queues[listKey] = queues[listKey] || [];
      return queues[listKey].slice(0, count);
    },
    async disconnect() {
      /* noop */
    },
  };
}
