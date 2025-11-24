import React, { useMemo } from "react";
import ContentCard from "../ContentCard.js";
import { useCurrentMode } from "../../hooks/useCurrentMode.js";
import { useTime } from "../../hooks/useTime.js";
// FIX: Changed import for ChecklistItemData from checklist-data.js to types.ts
import { ALL_CHECKLIST_DATA } from "../../checklist-data.js";
import type { ChecklistItemData } from "../../types.js";

const FamilyModeStatusModule: React.FC = () => {
  const currentMode = useCurrentMode();
  const { date: now, day } = useTime();

  const isFamilyMode = currentMode === "Family Structure";

  const scheduleInfo = useMemo(() => {
    if (!isFamilyMode) {
      return {
        currentActivity: "Quiet Independent Play",
        fullSchedule: [],
      };
    }

    const scheduleIdMap: { [key: number]: string } = {
      0: "fsm-sunday", // Sunday
      1: "fsm-monday", // Monday
      5: "fsm-friday", // Friday
      6: "fsm-saturday", // Saturday
    };
    const scheduleId = scheduleIdMap[day];

    const familySchedule = ALL_CHECKLIST_DATA.find(
      (s) => s.id === scheduleId,
    )?.items;

    if (!familySchedule) {
      return {
        currentActivity: "Scheduled Activity",
        fullSchedule: [],
      };
    }

    const currentHourDecimal = now.getHours() + now.getMinutes() / 60;

    let currentActivity = "Free Play"; // Default
    const fullSchedule = familySchedule.map((item: ChecklistItemData) => {
      const isActive =
        item.startHour !== undefined &&
        item.endHour !== undefined &&
        currentHourDecimal >= item.startHour &&
        currentHourDecimal < item.endHour;
      if (isActive) {
        currentActivity = item.label;
      }
      return {
        ...item,
        isActive,
      };
    });

    return { currentActivity, fullSchedule };
  }, [isFamilyMode, day, now]);

  const modeInfo = {
    title: isFamilyMode ? "👨‍👧‍👦 Family Time" : "🛠️ Dad's Work Time",
    color: isFamilyMode ? "border-accent-teal" : "border-accent-blue",
    textColor: isFamilyMode ? "text-accent-teal" : "text-accent-blue",
  };

  return (
    <ContentCard title="Family Status" showHeader={false}>
      <div className={`p-4 rounded-lg border-2 ${modeInfo.color}`}>
        <h3 className={`text-2xl font-bold text-center ${modeInfo.textColor}`}>
          {modeInfo.title}
        </h3>

        {isFamilyMode ? (
          <div className="mt-4">
            <h4 className="font-bold text-center mb-2">Today's Schedule</h4>
            <ul className="space-y-1 text-sm max-h-60 overflow-y-auto pr-2">
              {scheduleInfo.fullSchedule.map((item) => (
                <li
                  key={item.id}
                  className={`p-2 rounded-md transition-colors ${item.isActive ? "bg-accent-teal/20" : "bg-gray-800"}`}
                >
                  <span
                    className={`font-bold w-24 inline-block ${item.isActive ? "text-accent-teal" : "text-gray-400"}`}
                  >
                    {item.time}
                  </span>
                  <span className="ml-2">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center mt-2">
            <p className="text-sm text-gray-400">Current Activity:</p>
            <p className="text-xl font-semibold">
              {scheduleInfo.currentActivity}
            </p>
          </div>
        )}
      </div>
    </ContentCard>
  );
};

export default FamilyModeStatusModule;
