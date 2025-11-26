// Minimal 'offline' connector that returns stubbed calendar and tasks when no external integration is configured
export default function offlineConnector() {
  return {
    async listCalendarEvents() {
      return [
        {
          id: "stub-1",
          summary: "Offline: Make coffee",
          start: new Date().toISOString(),
          end: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        },
      ];
    },
    async listDriveFiles() {
      return [{ id: "file-1", name: "Offline note.txt" }];
    },
  };
}
