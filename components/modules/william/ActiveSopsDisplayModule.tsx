// @ts-nocheck
import React from "react";
import { useAppState } from "@contexts/AppStateContext";
import ContentCard from "../../ContentCard.js";
// FIX: Imported SOP_DATA to resolve reference error.
import { SOP_DATA } from "../../../constants.js";

// FIX: Explicitly typed component with React.FC and a props interface to handle the `key` prop correctly.
interface ActiveSopProps {
  sop: any;
}
const ActiveSop: React.FC<ActiveSopProps> = ({ sop }) => {
  const { dispatch } = useAppState();

  const handleViewSop = () => {
    if (sop.viewId) {
      dispatch({ type: "SET_VIEW", payload: sop.viewId });
    }
  };

  return (
    <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
      <h4 className="font-bold text-accent-green mb-2">{sop.title}</h4>
      {sop.steps && sop.steps.length > 0 && (
        <ul className="list-none space-y-1 text-sm">
          {sop.steps.slice(0, 3).map((step: string, index: number) => (
            <li key={index} className="text-text-light text-opacity-80 pl-2">
              {step}
            </li>
          ))}
          {sop.steps.length > 3 && (
            <li className="text-text-light text-opacity-80 pl-2">
              ...and more
            </li>
          )}
        </ul>
      )}
      {sop.viewId && (
        <button
          onClick={handleViewSop}
          className="mt-3 text-sm font-semibold text-accent-blue hover:underline"
        >
          View Full Protocol &rarr;
        </button>
      )}
    </div>
  );
};

const ActiveSopsDisplayModule = () => {
  const { appState } = useAppState();
  const { activeSops, userSops, modifiedSops } = appState;

  const allSops = React.useMemo(
    () => SOP_DATA.map((sop) => modifiedSops[sop.id] || sop).concat(userSops),
    [modifiedSops, userSops],
  );

  const displayedSops = React.useMemo(
    () => allSops.filter((sop) => activeSops.includes(sop.id)),
    [allSops, activeSops],
  );

  return (
    <ContentCard title="Active SOPs">
      {displayedSops.length > 0 ? (
        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
          {displayedSops.map((sop) => (
            <ActiveSop key={sop.id} sop={sop} />
          ))}
        </div>
      ) : (
        <p className="text-center text-text-light text-opacity-80 p-4">
          No active SOPs selected. Use the "Active SOP Selector" module to
          choose protocols to display here.
        </p>
      )}
    </ContentCard>
  );
};

export default ActiveSopsDisplayModule;
