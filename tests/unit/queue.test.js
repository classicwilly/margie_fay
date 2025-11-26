import { describe, it, expect, vi } from "vitest";
import { createQueue } from "../../server/queue.js";

describe("createQueue in-memory fallback", () => {
  it("push/pop works for in-memory", async () => {
    const q = createQueue(null);
    await q.push("test", { id: 1 });
    await q.push("test", { id: 2 });
    let v = await q.pop("test");
    expect(v.id).toBe(1);
    v = await q.pop("test");
    expect(v.id).toBe(2);
    const l = await q.len("test");
    expect(l).toBe(0);
  });
});
