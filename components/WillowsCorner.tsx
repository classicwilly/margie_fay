import React from "react";
import ChecklistItem from "./ChecklistItem";
import GemCollector from "./GemCollector";
import ContentCard from "./ContentCard";
import { useAppState } from "@contexts/AppStateContext";
import { ALL_CHECKLIST_DATA } from "../checklist-data.tsx";

const WillowsCorner: React.FC = () => {
  const { appState } = useAppState();
  const { collectedGems } = appState;
  const protocolData = ALL_CHECKLIST_DATA.filter(
    (s) => s.sourceDocument === "Willow's Corner",
  );

  return (
    <div>
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-accent-teal mb-4">
          🌸 Willow's Corner
        </h1>
        <p className="text-lg text-text-light text-opacity-90 mt-2 font-semibold">
          Purpose: Make your weeks predictable, fun, and safe. You know what
          happens next.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          {protocolData.map((section) => (
            <ContentCard key={section.id} title={section.title}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {section.subSections?.map((subSection) => (
                  <div key={subSection.id}>
                    <h3 className="text-xl font-semibold text-accent-blue mb-2">
                      {subSection.title}
                    </h3>
                    <ul className="list-none space-y-2">
                      {subSection.items?.map((item) => (
                        <ChecklistItem key={item.id} {...item}>
                          {item.label}
                        </ChecklistItem>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </ContentCard>
          ))}
        </div>

        <div className="space-y-8">
          <GemCollector
            name="Willow"
            collectedGems={collectedGems.willow || []}
          />
        </div>
      </div>
    </div>
  );
};

export default WillowsCorner;
