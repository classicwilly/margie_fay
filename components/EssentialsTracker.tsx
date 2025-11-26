import type { FC } from "react";
import ContentCard from "./ContentCard";
import ChecklistItem from "./ChecklistItem";
import { ALL_CHECKLIST_DATA } from "../checklist-data.tsx";

const EssentialsTracker: FC = () => {
  const essentialsData = ALL_CHECKLIST_DATA.find(
    (section) => section.id === "essentials-tracker",
  );

  const gridClasses: Record<string, string> = {
    "essentials-hydration-section": "grid grid-cols-4 gap-x-2",
    "essentials-meds-section": "grid grid-cols-3 gap-x-2",
    "essentials-nutrition-section": "grid grid-cols-3 gap-x-2",
  };

  return (
    <ContentCard title="⚙️ Daily Essentials">
      <div className="space-y-3">
        {essentialsData?.subSections?.map((subSection) => (
          <div key={subSection.id}>
            <h3 className="text-md font-semibold text-accent-teal mb-1">
              {subSection.title}
            </h3>
            <ul className={`list-none ${gridClasses[subSection.id] || ""}`}>
              {subSection.items?.map((item) => (
                <ChecklistItem key={item.id} id={item.id}>
                  {item.label}
                </ChecklistItem>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </ContentCard>
  );
};

export default EssentialsTracker;
