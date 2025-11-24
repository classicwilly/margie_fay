import React from "react";
import ContentCard from "./ContentCard";
import ChecklistItem from "./ChecklistItem";
import { QuickJump } from "./QuickJump";
// Fix: Added '.tsx' extension to the import path to ensure the file is treated as a module.
import { ALL_CHECKLIST_DATA } from "../checklist-data.tsx";

const MorningTransitionProtocol: React.FC = () => {
  const protocolData = ALL_CHECKLIST_DATA.filter(
    (s) => s.sourceDocument === "Morning Transition Protocol",
  );

  const sections = protocolData.map((s) => ({ id: s.id, title: s.title }));

  return (
    <div>
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-accent-teal mb-4">
          MORNING TRANSITION PROTOCOL (MTP-SOP)
        </h1>
        <p className="text-lg text-text-light text-opacity-80">
          Purpose: Bridge the gap between sleep and active execution through
          structured physical, mental, and environmental transitions.
        </p>
      </header>

      <QuickJump sections={sections} />

      <div className="space-y-6">
        {protocolData.map((section) => (
          <section key={section.id} id={section.id}>
            <ContentCard title={section.title}>
              {section.description && (
                <p className="text-lg text-text-light text-opacity-90">
                  {section.description}
                </p>
              )}
              {section.items && (
                <ul className="list-none space-y-2 text-lg mt-4">
                  {section.items.map((item) => (
                    <ChecklistItem key={item.id} id={item.id}>
                      {item.label}
                    </ChecklistItem>
                  ))}
                </ul>
              )}
            </ContentCard>
          </section>
        ))}

        <footer className="text-center mt-12 pt-8 border-t border-gray-700">
          <p className="text-xl font-bold text-accent-blue">
            The morning transition is where your day is won or lost. Run it
            every morning. No exceptions.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default MorningTransitionProtocol;
