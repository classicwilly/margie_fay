import React from "react";
import ContentCard from "./ContentCard";
import ChecklistItem from "./ChecklistItem";
import { QuickJump } from "./QuickJump";
import { addTaskToGoogle } from "../src/integrations/googleWorkspace";
// Fix: Added '.tsx' extension to the import path to ensure the file is treated as a module.
import { ALL_CHECKLIST_DATA } from "../checklist-data.tsx";

const SystemIntegrationGuide: React.FC = () => {
  const protocolData = ALL_CHECKLIST_DATA.filter(
    (s) => s.sourceDocument === "System Integration Guide",
  );

  const sections = protocolData.map((s) => ({ id: s.id, title: s.title }));

  return (
    <div>
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-accent-teal mb-4">
          System Integration: Google Workspace
        </h1>
        <p className="text-lg text-text-light text-opacity-80">
          Operationalize your OS by integrating protocols with Google Workspace
          for enhanced system compliance and reduced executive dysfunction.
        </p>
      </header>

      <QuickJump sections={sections} />

      <div className="space-y-6 max-w-4xl mx-auto">
        {protocolData.map((section) => (
          <ContentCard key={section.id} title={section.title}>
            <ul className="list-none text-lg space-y-2">
              {section.items?.map((item) => (
                <ChecklistItem key={item.id} id={item.id}>
                  {item.label}
                </ChecklistItem>
              ))}
            </ul>
          </ContentCard>
        ))}
      </div>
      <div className="text-center mt-8">
        <button
          onClick={async () => {
            try {
              await addTaskToGoogle("Try Wonky Sprout Integration Flow");
              alert(
                "Submitted to Google Tasks (via server proxy) — see audit log.",
              );
            } catch (err) {
              alert("Failed to submit task (check server proxy configuration)");
            }
          }}
          className="px-4 py-2 bg-accent-green text-background-dark rounded-md font-semibold"
        >
          Test: Add a Task to Google
        </button>
      </div>

      <footer className="mt-8 pt-6 border-t border-gray-700 max-w-4xl mx-auto">
        <p className="text-sm text-text-light text-opacity-80 italic text-center">
          Note: This implementation provides workflow guidance. Direct,
          automated integration with Google Workspace APIs (e.g., creating
          events from SOPs) requires a separate backend system for
          authentication and API calls, which is not part of this frontend-only
          application. Manual application is required.
        </p>
      </footer>
    </div>
  );
};

export default SystemIntegrationGuide;
