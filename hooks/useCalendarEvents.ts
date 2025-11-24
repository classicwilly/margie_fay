// useCalendarEvents.ts
// Google Calendar API wrapper hook for event parsing and pre-task anxiety mitigation
// Milestone 1: Vision-Driven Roadmap

import { useEffect, useState } from "react";

export interface CalendarEvent {
  id: string;
  summary: string;
  start: string;
  end: string;
  description?: string;
  location?: string;
}

export function useCalendarEvents(authToken: string) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authToken) {
      return;
    }
    setLoading(true);
    setError(null);

    // Fetch events from Google Calendar API
    fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.items) {
          setEvents(
            data.items.map((item: any) => ({
              id: item.id,
              summary: item.summary,
              start: item.start?.dateTime || item.start?.date,
              end: item.end?.dateTime || item.end?.date,
              description: item.description,
              location: item.location,
            })),
          );
        } else {
          setEvents([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch events");
        setLoading(false);
      });
  }, [authToken]);

  return { events, loading, error };
}
