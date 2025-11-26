import { useEffect, useRef } from "react";
import { useAppState } from "@contexts/AppStateContext";
import { ALL_ACHIEVEMENTS } from "../constants.js";

export function useAchievementEngine() {
  const { appState, dispatch } = useAppState();
  const awardedThisSession = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!appState) {
      return;
    }

    const {
      tasks,
      userSops,
      isFocusModeActive,
      projects,
      collectedAchievements,
      habitTracker,
    } = appState;

    // Add index signature to collectedAchievements
    const achievementsObj = collectedAchievements as { [key: string]: boolean };
    const checkAndAward = (id: string) => {
      // Check if it's already awarded in the main state or this session
      if (achievementsObj[id] || awardedThisSession.current.has(id)) {
        return;
      }

      const achievement = ALL_ACHIEVEMENTS.find((a) => a.id === id);
      if (achievement) {
        dispatch({ type: "ADD_ACHIEVEMENT", payload: id });
        dispatch({
          type: "ADD_TOAST",
          payload: {
            id: `toast-${id}-${Math.random().toString(36).slice(2)}`,
            emoji: achievement.emoji,
            message: `Achievement Unlocked: ${achievement.label}!`,
          },
        });
        awardedThisSession.current.add(id);
      }
    };

    // --- Achievement Logic ---

    // 1. Inbox Zero
    const inboxTasks = tasks.filter((t) => t.status === "todo" && !t.dueDate);
    if (inboxTasks.length === 0) {
      checkAndAward("inbox-zero");
    }

    // 2. First SOP Created
    if (userSops.length > 0) {
      checkAndAward("first-sop-created");
    }

    // 3. First Focus Session
    // We can't know when a session *ends*, but we can check if one *was* active and now isn't.
    // This is a simplification; a more robust system might track session completion state.
    // For now, let's award it after using it. The `isFocusModeActive` is a good proxy.
    // Let's award it when they start it for the first time.
    if (isFocusModeActive) {
      checkAndAward("first-focus-session");
    }

    // 4. Project Complete
    const completedProjectExists = projects.some((p) => p.isArchived);
    if (completedProjectExists) {
      checkAndAward("project-complete");
    }

    // 5. 7-day Habit Streak
    const has7DayStreak = habitTracker.habits.some((h) => h.currentStreak >= 7);
    if (has7DayStreak) {
      checkAndAward("first-habit-streak");
    }

    // Note: 'foundational-day-complete', 'weekly-review-complete', and 'all-systems-green' are awarded
    // via ChecklistItems or other specific component logic, as they require more context than this hook has.
  }, [appState, dispatch]);
}
