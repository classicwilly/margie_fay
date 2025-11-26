import React, { useState, useEffect } from "react";
import ContentCard from "./ContentCard";
import ChecklistItem from "./ChecklistItem";
import { QuickJump } from "./QuickJump";
import { useAppState } from "@contexts/AppStateContext";
import { SOP_DATA } from "../constants";
// Fix: Added '.tsx' extension to the import path to ensure the file is treated as a module.
import { ALL_CHECKLIST_DATA } from "../checklist-data.tsx";
import { Sop } from "../types";

const FoundationalProtocols: React.FC = () => {
  const SOP_ID = "1";
  const { appState, dispatch } = useAppState();
  const { isModMode, modifiedSops } = appState;

  const originalSop = SOP_DATA.find((s) => s.id === SOP_ID)!;
  const currentSop = modifiedSops[SOP_ID] || originalSop;
  const executionChecklistData = ALL_CHECKLIST_DATA.find(
    (s) => s.id === "fp-checklist",
  );
  const failureProtocolData = ALL_CHECKLIST_DATA.find(
    (s) => s.id === "fp-failure",
  );

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Sop>(currentSop);

  useEffect(() => {
    setFormData(currentSop);
    if (!isModMode) {
      setIsEditing(false);
    }
  }, [currentSop, isModMode]);

  const handleInputChange = (field: "title" | "description", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...(formData.steps || [])];
    newSteps[index] = value;
    setFormData((prev) => ({ ...prev, steps: newSteps }));
  };

  const handleSave = () => {
    dispatch({ type: "UPDATE_SOP", payload: formData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(currentSop);
    setIsEditing(false);
  };

  const handleReset = () => {
    dispatch({ type: "RESET_SOP", payload: SOP_ID });
    setIsEditing(false);
  };

  const sections = [
    { id: "overview", title: "📋 Overview" },
    { id: "checklist", title: "✅ Execution Checklist" },
    { id: "failure", title: "🚨 Failure Protocol" },
  ];

  return (
    <div>
      <header className="text-center mb-10 relative">
        {isEditing ? (
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            aria-label="Edit protocol title"
            className="w-full text-center bg-gray-800 border border-gray-700 rounded-md text-4xl md:text-5xl font-extrabold text-accent-teal mb-4 p-2 focus:outline-none focus:ring-2 focus:ring-accent-blue"
          />
        ) : (
          <h1 className="text-4xl md:text-5xl font-extrabold text-accent-teal mb-4">
            {currentSop.title}
          </h1>
        )}

        {isEditing ? (
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            aria-label="Edit protocol description"
            rows={3}
            className="w-full text-center bg-gray-800 border border-gray-700 rounded-md text-lg text-text-light text-opacity-80 p-2 focus:outline-none focus:ring-2 focus:ring-accent-blue"
          />
        ) : (
          <p className="text-lg text-text-light text-opacity-80">
            {currentSop.description}
          </p>
        )}

        {isModMode && (
          <div className="absolute top-0 right-0 flex flex-col items-end gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-accent-blue text-background-dark font-semibold rounded-md hover:bg-blue-400 transition-colors"
              >
                Edit Protocol
              </button>
            ) : (
              <div className="flex flex-col gap-2 items-stretch w-full">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-accent-green text-background-dark font-semibold rounded-md hover:bg-green-500 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-600 text-text-light font-semibold rounded-md hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="mt-2 px-4 py-2 bg-red-800 bg-opacity-50 text-red-300 font-semibold rounded-md hover:bg-opacity-80 transition-colors text-sm"
                >
                  Reset to Default
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      <QuickJump sections={sections} />

      <div className="space-y-6">
        <section id="overview">
          <ContentCard title="Core Protocol Steps">
            {isEditing ? (
              <div className="space-y-3">
                {(formData.steps || []).map((step, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-text-light font-bold shrink-0 w-8">
                      {index + 1}.
                    </span>
                    <input
                      type="text"
                      value={step.substring(step.indexOf(".") + 2)}
                      onChange={(e) =>
                        handleStepChange(
                          index,
                          `${index + 1}. ${e.target.value}`,
                        )
                      }
                      aria-label={`Edit step ${index + 1}`}
                      className="grow p-3 bg-gray-800 border border-gray-700 rounded-md text-text-light placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <ul className="list-none space-y-2 text-lg">
                {(currentSop.steps || []).map((step, index) => (
                  <ChecklistItem
                    key={`step-${index}`}
                    id={`fdp-core-step-${index}`}
                  >
                    {step.substring(step.indexOf(".") + 2)}
                  </ChecklistItem>
                ))}
              </ul>
            )}
          </ContentCard>
        </section>

        {executionChecklistData && (
          <section id="checklist">
            <ContentCard title={executionChecklistData.title}>
              <div className="grid md:grid-cols-3 gap-6">
                {executionChecklistData.subSections?.map((subSection) => (
                  <ContentCard
                    key={subSection.id}
                    title={subSection.title}
                    showHeader={true}
                    titleClassName="text-accent-teal text-xl"
                  >
                    <ul className="list-none space-y-2 text-lg">
                      {subSection.items?.map((item) => (
                        <ChecklistItem
                          key={item.id}
                          id={item.id}
                          achievementAwardId={item.achievementAwardId}
                        >
                          {item.label}
                        </ChecklistItem>
                      ))}
                    </ul>
                  </ContentCard>
                ))}
              </div>
            </ContentCard>
          </section>
        )}

        {failureProtocolData && (
          <section id="failure">
            <ContentCard title={failureProtocolData.title}>
              {failureProtocolData.description && (
                <p className="text-lg text-text-light text-opacity-90 mb-4">
                  {failureProtocolData.description}
                </p>
              )}
              {failureProtocolData.items && (
                <ul className="list-none space-y-2 text-lg">
                  {failureProtocolData.items.map((item) => (
                    <ChecklistItem key={item.id} id={item.id}>
                      {item.label}
                    </ChecklistItem>
                  ))}
                </ul>
              )}
              <p className="text-lg text-text-light text-opacity-90 mt-4 font-semibold">
                The system is forgiving, but you must re-engage immediately.
              </p>
            </ContentCard>
          </section>
        )}
      </div>
    </div>
  );
};

export default FoundationalProtocols;
