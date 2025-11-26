// Very small offline queue utility using localStorage as persistence.
// Designed to be simple and reliable; for production consider IndexedDB for larger payloads.

interface QueueItem {
  id: string;
  endpoint: string;
  body: unknown;
  createdAt: number;
}

const QUEUE_KEY = "wonky_offline_queue_v1";

function readQueue(): QueueItem[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("offlineQueue: readQueue failed", e);
    return [];
  }
}

function writeQueue(items: QueueItem[]) {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn("offlineQueue: writeQueue failed", e);
  }
}

export function enqueueRequest(endpoint: string, body: unknown) {
  const items = readQueue();
  const item: QueueItem = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    endpoint,
    body,
    createdAt: Date.now(),
  };
  items.push(item);
  writeQueue(items);
  return item.id;
}

export async function flushQueue(signal?: AbortSignal) {
  const items = readQueue();
  if (!items.length) {
    return { success: true, flushed: 0 };
  }
  let flushed = 0;
  const remaining: QueueItem[] = [];
  for (const it of items) {
    try {
      if (signal && signal.aborted) {
        throw new Error("aborted");
      }
      const res = await fetch(it.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(it.body),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      flushed += 1;
    } catch (err) {
      console.warn("offlineQueue: flush failed for item", it.id, err);
      remaining.push(it);
    }
  }
  writeQueue(remaining);
  return { success: remaining.length === 0, flushed };
}

export function installAutoFlush() {
  window.addEventListener("online", () => {
    const controller = new AbortController();
    void flushQueue(controller.signal).catch((e) =>
      console.warn("offlineQueue: auto flush error", e),
    );
  });
}

export default {
  enqueueRequest,
  flushQueue,
  installAutoFlush,
};
