import React from "react";
import ContentCard from "./ContentCard";
import ChecklistItem from "./ChecklistItem";
import { QuickJump } from "./QuickJump";
// Fix: Added '.tsx' extension to the import path to ensure the file is treated as a module.
import { ALL_CHECKLIST_DATA } from "../checklist-data.tsx";

const ClassicWillyProtocol: React.FC = () => {
  const protocolData = ALL_CHECKLIST_DATA.filter(
    (s) => s.sourceDocument === "Classicwilly Protocol",
  );

  const sections = protocolData.map((s) => ({ id: s.id, title: s.title }));

  return (
    <div>
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-accent-teal mb-4">
          "classicwilly" Execution Protocol (CW-SOP)
        </h1>
        <p className="text-lg text-text-light text-opacity-80">
          <strong>Purpose:</strong> To define the operational mode for
          "classicwilly" when a non-conforming condition has been identified and
          11/10-perfection "structure" is required.
        </p>
      </header>

      <QuickJump sections={sections} />

      <div className="space-y-6">
        {protocolData.map((section) => (
          <ContentCard key={section.id} title={section.title}>
            {section.description && (
              <p className="text-lg text-text-light text-opacity-90 mb-4">
                {section.description}
              </p>
            )}
            {section.items && (
              <ul className="list-none space-y-2 text-lg">
                {section.items.map((item) => (
                  <ChecklistItem key={item.id} id={item.id}>
                    {item.label}
                  </ChecklistItem>
                ))}
              </ul>
            )}
          </ContentCard>
        ))}
      </div>
    </div>
  );
};

export { ClassicWillyProtocol };
export default ClassicWillyProtocol;
