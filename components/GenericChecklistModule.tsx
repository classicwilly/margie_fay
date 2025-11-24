import React from "react";
import ChecklistItem from "./ChecklistItem.js";
import ContentCard from "./ContentCard.js";
import { ALL_CHECKLIST_DATA } from "../checklist-data.js";
import { SecureMarkdown } from "../utils/secureMarkdownRenderer.js";

const GenericChecklistModule = ({ sourceDocument }) => {
  const checklistData = ALL_CHECKLIST_DATA.filter(
    (section) => section.sourceDocument === sourceDocument,
  );

  if (!checklistData || checklistData.length === 0) {
    return (
      <ContentCard title={`Checklist: ${sourceDocument}`}>
        <p>No checklist data found for this protocol.</p>
      </ContentCard>
    );
  }

  const renderSection = (section, level = 0) => {
    const titleClass =
      level === 0 ? "text-accent-teal text-xl" : "text-accent-blue text-lg";
    const containerClass =
      level > 0 ? "border-l-4 border-gray-700 pl-4 mt-4" : "";

    return (
      <div key={section.id} className={containerClass}>
        <h3 className={`font-bold mb-2 ${titleClass}`}>{section.title}</h3>
        {section.description && (
          <div className="text-sm text-gray-400 mb-2">
            <SecureMarkdown content={section.description} />
          </div>
        )}
        {section.items && (
          <ul className="list-none">
            {section.items.map((item) => (
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
        )}
        {section.subSections && (
          <div className="space-y-4 mt-4">
            {section.subSections.map((subSection) =>
              renderSection(subSection, level + 1),
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <ContentCard title={`Checklist: ${sourceDocument}`}>
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {checklistData.map((section) => renderSection(section))}
      </div>
    </ContentCard>
  );
};

export default GenericChecklistModule;
