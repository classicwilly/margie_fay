/**
 * Safely checks if a habit was completed on a specific date.
 * @param log The habit log.
 * @param habitId The ID of the habit to check.
 * @param date The date string (YYYY-MM-DD) to check.
 * @returns True if the habit was completed on the given date, false otherwise.
 */
export const isHabitDoneOn = (
  log: Record<string, string[]>,
  habitId: string,
  date: string,
): boolean => {
  const dayLog = log[date];
  return Array.isArray(dayLog) && dayLog.includes(habitId);
};
