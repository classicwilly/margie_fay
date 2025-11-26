import { useMemo } from "react";
// useAppState is not used in this hook; we accept appState and dispatch as params
import { useTime } from "./useTime.js";

export function useProactiveAI(appState: any, dispatch: any) {
  const { statusEnergy, calendarEvents, checkedItems, dismissedNudges } =
    appState;

  const { hour, date: now } = useTime();

  const allNudges = useMemo(() => {
    const nudges = [];

    // NUDGE: Missed Morning Meds
    if (hour >= 12 && !checkedItems["essentials-meds-am"]) {
      nudges.push({
        id: "missed-morning-meds",
        theme: "warning",
        icon: "💊",
        title: "System Stability Warning",
        message:
          "System detects morning medication has not been logged. Compliance is critical.",
        actionLabel: "View Essentials Tracker",
        onAction: () =>
          dispatch({ type: "SET_VIEW", payload: "view-daily-briefing-module" }),
      });
    }

    // NUDGE: High Density / Low Capacity
    const todaysEvents = calendarEvents.filter(
      (event: any) =>
        new Date(event.date).toDateString() === now.toDateString(),
    );
    if (statusEnergy === "Low" && todaysEvents.length > 2) {
      nudges.push({
        id: "high-density-low-energy",
        theme: "warning",
        icon: "🔋",
        title: "High Density / Low Capacity Alert",
        message: `System detects Low Energy combined with ${todaysEvents.length} events today. Risk of burnout is high.`,
        actionLabel: "Review Agenda",
        onAction: () =>
          dispatch({ type: "SET_VIEW", payload: "view-task-matrix-module" }),
      });
    }

    return nudges;
  }, [hour, now, dispatch, checkedItems, calendarEvents, statusEnergy]);

  // Filter out dismissed nudges
  return useMemo(() => {
    return allNudges.filter((nudge) => !dismissedNudges.includes(nudge.id));
  }, [allNudges, dismissedNudges]);
}
