import type { FC } from "react";
import { ViewType } from "../types";
import { useAppState } from "@contexts/AppStateContext";

const ProtocolCard: FC<{
  title: string;
  description: string;
  viewId: ViewType;
  emoji: string;
}> = ({ title, description, viewId, emoji }) => {
  const { dispatch } = useAppState();
  const setView = (view: ViewType) =>
    dispatch({ type: "SET_VIEW", payload: view });

  return (
    <button
      onClick={() => setView(viewId)}
      data-testid={`kid-protocol-${viewId}`}
      className="bg-card-dark rounded-lg shadow-md p-6 border border-gray-700 flex flex-col h-full text-left hover:border-accent-teal transition-colors duration-200 transform hover:scale-105"
    >
      <h3 className="text-3xl font-bold text-accent-green mb-3">
        <span className="mr-3">{emoji}</span>
        {title}
      </h3>
      <p className="mb-4 text-text-light text-opacity-80 grow">{description}</p>
      <span className="w-full mt-auto p-3 bg-accent-blue bg-opacity-80 text-background-dark rounded-md text-center font-bold">
        Open Dashboard
      </span>
    </button>
  );
};

const KidsCorner: FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <header className="text-center mb-10" data-testid="kids-corner-header">
        <h1
          className="text-4xl md:text-5xl font-extrabold text-accent-teal mb-4"
          data-testid="kids-corner-heading"
        >
          🌱 Little Sprouts HQ
        </h1>
        <p className="text-lg text-text-light text-opacity-80">
          Your space for checklists, dopamine mining, and sensory rewards. Let's
          have a great week!
        </p>
      </header>

      <section className="mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProtocolCard
            title="Willow's Corner"
            description="All of your special checklists for weekends with Dad and weekdays at Mom's, plus your dopamine mining and sensory rewards!"
            viewId="willows-corner"
            emoji="🌸"
          />
          <ProtocolCard
            title="Bash's Corner"
            description="All of your special checklists for weekends with Dad and weekdays at Mom's, plus your dopamine mining and rewards!"
            viewId="bashs-corner"
            emoji="🦖"
          />
        </div>
      </section>
    </div>
  );
};

export default KidsCorner;
export { KidsCorner };
