// Offline connector returns local stubbed events and files
export async function listCalendarEvents() {
  return [
    {
      id: "stub-1",
      summary: "Offline: Morning routine",
      start: new Date().toISOString(),
      end: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    },
  ];
}

export default { listCalendarEvents };
