import React from "react";
import ContentCard from "./ContentCard";
import ChecklistItem from "./ChecklistItem";
import { QuickJump } from "./QuickJump";
// Fix: Added '.tsx' extension to the import path to ensure the file is treated as a module.
import { ALL_CHECKLIST_DATA } from "../checklist-data.tsx";

const BubbleShieldProtocol: React.FC = () => {
  const protocolData = ALL_CHECKLIST_DATA.filter(
    (s) => s.sourceDocument === "Bubble Shield Protocol",
  );

  const sections = protocolData.map((s) => ({ id: s.id, title: s.title }));

  return (
    <div>
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-accent-teal mb-4">
          MLP-007: Bubble Shield Hardware Protocol
        </h1>
        <p className="text-lg text-text-light text-opacity-80 font-semibold">
          (Mandatory Sensory Fix)
        </p>
      </header>

      <QuickJump sections={sections} />

      <div className="space-y-6">
        {protocolData.map((section) => (
          <ContentCard key={section.id} title={section.title}>
            <p className="text-lg text-text-light text-opacity-90 mb-4">
              {section.description}
            </p>
            <ul className="list-none space-y-2">
              {section.items?.map((item) => (
                <ChecklistItem key={item.id} id={item.id}>
                  {item.label}
                </ChecklistItem>
              ))}
            </ul>
          </ContentCard>
        ))}
      </div>
      <footer className="text-center mt-12 pt-8 border-t border-gray-700">
        <p className="text-xl font-bold text-accent-blue">
          This hardware is required to maintain stable executive function.
          Treating these items as "wants" is a non-conforming condition.
        </p>
      </footer>
    </div>
  );
};

export { BubbleShieldProtocol };
export default BubbleShieldProtocol;
