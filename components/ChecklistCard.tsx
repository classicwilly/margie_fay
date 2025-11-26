import type { FC } from "react";
import ChecklistItem from "./ChecklistItem.js";
import type { ChecklistSectionData } from "../checklist-data";
import { Button } from "./Button";

const ChecklistCard: FC<{ section: ChecklistSectionData }> = ({ section }) => {
  return (
    <div className="card-base rounded-lg shadow-lg border border-accent-teal bg-card-dark flex flex-col h-full p-6">
      <h3 className="text-2xl font-mono font-bold text-accent-teal mb-2 border-b border-surface-700 pb-2">
        {section.title}
      </h3>
      <p className="text-xs text-text-muted mb-3">{section.parentTitle}</p>
      {section.items && (
        <ul className="list-none space-y-1">
          {section.items.map((item) => (
            <ChecklistItem
              key={item.id}
              id={item.id}
              gemAwardId={item.gemAwardId}
              gemRecipient={item.gemRecipient}
              achievementAwardId={item.achievementAwardId}
            >
              {item.label}
            </ChecklistItem>
          ))}
        </ul>
      )}
    </div>
  );
};

export { ChecklistCard };
export default ChecklistCard;
