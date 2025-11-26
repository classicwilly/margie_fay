import type { FC } from "react";
import { Sop, ViewType } from "../types";
import { useAppState } from "@contexts/AppStateContext";
// Removed unused Button import

interface SopCardProps {
  sop: Sop;
}

const SopCard: FC<SopCardProps> = ({ sop }) => {
  const { dispatch } = useAppState();

  const handleSetView = (view: ViewType) => {
    dispatch({ type: "SET_VIEW", payload: view });
  };

  const cardContent = (
    <>
      <div className="grow">
        <h2
          data-testid={`sop-card-title-${sop.id}`}
          className="text-2xl font-semibold text-accent-green mb-3 break-word"
        >
          {sop.title}
        </h2>
        <p className="text-text-light text-opacity-80 leading-relaxed">
          {sop.description}
        </p>
      </div>
    </>
  );

  if (sop.viewId) {
    return (
      <button
        onClick={() => handleSetView(sop.viewId!)}
        className="card-base rounded-lg shadow-lg border border-accent-teal bg-card-dark p-6 hover:border-accent-pink transition-colors duration-200 ease-in-out transform hover:scale-[1.01] flex flex-col text-left w-full"
        aria-label={`View details for ${sop.title}`}
      >
        {cardContent}
      </button>
    );
  }

  return (
    <div className="card-base rounded-lg shadow-lg border border-accent-teal bg-card-dark p-6 flex flex-col">
      {cardContent}
    </div>
  );
};

export default SopCard;
