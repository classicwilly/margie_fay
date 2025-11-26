import * as google from "./google";
import * as offline from "./offline";

export async function listCalendarEvents(preferOffline = false) {
  if (preferOffline || !navigator.onLine) {
    return offline.listCalendarEvents();
  }
  const evts = await google.listCalendarEvents();
  if (!evts || !evts.length) {
    return offline.listCalendarEvents();
  }
  return evts;
}

export default { listCalendarEvents };
