import { sanitizePrompt } from "../utils/promptSanitizer";

export async function addTaskToGoogle(
  taskTitle: string,
  opts: { listId?: string } = {},
) {
  const sanitized = sanitizePrompt(taskTitle);
  // POST to server-side endpoint which uses Server OAuth. Browser never calls Google directly.
  const res = await fetch("/api/google/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: sanitized, listId: opts.listId || null }),
  });
  if (!res.ok) {
    throw new Error("Failed to create Google Task");
  }
  return await res.json();
}

export default { addTaskToGoogle };
