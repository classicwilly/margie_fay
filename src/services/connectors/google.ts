// Simple client wrapper for server-side google workspace routes
export async function listCalendarEvents() {
  const res = await fetch("/api/google/demo");
  if (!res.ok) {
    return [];
  }
  const json = await res.json();
  if (json.events) {
    return json.events;
  }
  return json.sampleEvent ? [json.sampleEvent] : [];
}

export default { listCalendarEvents };
