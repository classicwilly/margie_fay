import type { FC } from "react";
import ContentCard from "./ContentCard";
import ChecklistItem from "./ChecklistItem";
import { QuickJump } from "./QuickJump";
// Fix: Added '.tsx' extension to the import path to ensure the file is treated as a module.
import { ALL_CHECKLIST_DATA } from "../checklist-data.tsx";

const SoloExecutionModeProtocol: FC = () => {
  const protocolData = ALL_CHECKLIST_DATA.filter(
    (s) => s.sourceDocument === "Solo Execution Mode Protocol",
  );

  const sections = protocolData.map((section) => ({
    id: section.id,
    title: section.title,
  }));

  return (
    <div>
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-accent-teal mb-4">
          SOLO EXECUTION MODE (SEM-SOP)
        </h1>
        <p className="text-lg text-text-light text-opacity-80">
          <strong>Active Period:</strong> Monday 6:00 PM → Friday 4:00 PM
        </p>
        <p className="text-lg text-text-light text-opacity-90 mt-2 font-semibold">
          Purpose: High-focus output, systems building, and deep work. This is
          your time to be the <strong>classicwilly Diagnostician</strong>.
        </p>
      </header>

      <QuickJump sections={sections} />

      <div className="space-y-6">
        {protocolData.map((section) => (
          <section key={section.id} id={section.id}>
            <ContentCard title={section.title}>
              {section.description && (
                <p className="text-lg text-text-light text-opacity-90 mb-4">
                  {section.description}
                </p>
              )}
              {section.items && (
                <ul className="list-none space-y-2 text-lg">
                  {section.items.map((item) => (
                    <ChecklistItem
                      key={item.id}
                      id={item.id}
                      achievementAwardId={item.achievementAwardId}
                    >
                      {item.label}
                    </ChecklistItem>
                  ))}
                </ul>
              )}
              {section.subSections?.map((subSection) => (
                <ContentCard
                  key={subSection.id}
                  title={subSection.title}
                  showHeader={true}
                  titleClassName="text-accent-teal text-xl"
                >
                  <ul className="list-none text-lg">
                    {subSection.items?.map((item) => (
                      <ChecklistItem key={item.id} id={item.id}>
                        {item.label}
                      </ChecklistItem>
                    ))}
                  </ul>
                </ContentCard>
              ))}
            </ContentCard>
          </section>
        ))}

        <footer className="text-center mt-12 pt-8 border-t border-gray-700">
          <p className="text-xl font-bold text-accent-blue">
            This is your time to be the classicwilly Diagnostician. Execute with
            11/10 precision.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default SoloExecutionModeProtocol;
