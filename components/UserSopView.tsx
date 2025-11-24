import React from "react";
import { useAppState } from "@contexts/AppStateContext";
import ContentCard from "./ContentCard.js";
import { Button } from "./Button";
import ChecklistItem from "./ChecklistItem.js";
import ActionableCue from "./ActionableCue.js";

const UserSopView = () => {
  const { appState, dispatch } = useAppState();

  if (!appState) {
    return null;
  }

  const { activeUserSopId, userSops, isModMode } = appState;

  const sop = userSops.find((s) => s.id === activeUserSopId);

  if (!sop) {
    // Fallback if the SOP isn't found
    return (
      <ContentCard title="Error: Protocol Not Found">
        <p>
          The requested user-created protocol could not be found. It may have
          been deleted.
        </p>
        <Button
          onClick={() => dispatch({ type: "SET_VIEW", payload: "sop-vault" })}
          className="mt-4 px-4 py-2 bg-accent-blue text-background-dark font-semibold rounded-md"
        >
          Return to Flight Protocol Vault
        </Button>
      </ContentCard>
    );
  }

  const handleEdit = () => {
    dispatch({ type: "SET_EDITING_SOP_ID", payload: sop.id });
    dispatch({ type: "SET_VIEW", payload: "create-sop" });
  };

  return (
    <div>
      <header className="text-center mb-10 relative">
        <h1 className="text-4xl md:text-5xl font-extrabold text-accent-teal mb-4">
          {sop.title}
        </h1>
        <p className="text-lg text-text-light text-opacity-80 max-w-3xl mx-auto">
          {sop.description}
        </p>
        <div className="no-print absolute top-0 right-0 mt-2 flex items-center gap-2">
          {isModMode && (
            <Button
              onClick={handleEdit}
              variant="primary"
              size="sm"
              aria-label="Edit this protocol"
            >
              Edit Protocol
            </Button>
          )}
          <Button
            onClick={() => window.print()}
            className="px-4 py-2 bg-accent-blue text-background-dark rounded-md hover:bg-blue-400 transition-colors duration-200 font-semibold flex items-center text-sm"
            aria-label="Print this protocol"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5 4v3H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z"
                clipRule="evenodd"
              />
            </svg>
            Print
          </Button>
        </div>
      </header>

      <ContentCard title="Protocol Steps">
        <ul className="list-none space-y-2 text-lg">
          {(sop.steps || []).map((step, index) => (
            <ChecklistItem
              key={`user-sop-${sop.id}-step-${index}`}
              id={`user-sop-${sop.id}-step-${index}`}
            >
              {step.substring(step.indexOf(".") + 2)}
            </ChecklistItem>
          ))}
        </ul>
      </ContentCard>

      {sop.cues && sop.cues.length > 0 && (
        <ContentCard title="Actionable Cues" className="mt-6">
          <div className="flex flex-wrap">
            {sop.cues.map((cue, index) => (
              <ActionableCue
                key={`user-sop-${sop.id}-cue-${index}`}
                text={cue}
              />
            ))}
          </div>
        </ContentCard>
      )}
    </div>
  );
};

export default UserSopView;
