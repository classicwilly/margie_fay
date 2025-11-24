import React from "react";
import ChecklistItem from "../../ChecklistItem";
import ContentCard from "../../ContentCard";
import { ALL_CHECKLIST_DATA } from "../../../checklist-data";

const SebastianChecklistModule = () => {
  const protocolData = ALL_CHECKLIST_DATA.filter(
    (s) => s.sourceDocument === "Bash's Corner",
  );

  return (
    <ContentCard title="Daily Checklists">
      <div className="space-y-6">
        {protocolData.map((section) => (
          <div key={section.id}>
            <h3 className="text-xl font-semibold text-accent-blue mb-2">
              {section.title}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {section.subSections?.map((subSection) => (
                <div key={subSection.id}>
                  <h4 className="text-lg font-semibold text-accent-teal mb-1">
                    {subSection.title}
                  </h4>
                  <ul className="list-none space-y-2">
                    {/* FIX: Explicitly pass props to ChecklistItem instead of spreading to avoid type errors. */}
                    {subSection.items?.map((item) => (
                      <ChecklistItem
                        key={item.id}
                        id={item.id}
                        gemAwardId={item.gemAwardId}
                        gemRecipient={item.gemRecipient}
                        achievementAwardId={item.achievementAwardId}
                        large={item.large}
                      >
                        {item.label}
                      </ChecklistItem>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ContentCard>
  );
};

export default SebastianChecklistModule;
