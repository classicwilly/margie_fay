import type { FC } from "react";
import GemCollector from "../../GemCollector"; // Adjusted path
import { useAppState } from "@contexts/AppStateContext";

const WillowGemCollectorModule: FC = () => {
  const { appState } = useAppState();
  const { collectedGems } = appState;

  return (
    <GemCollector name="Willow" collectedGems={collectedGems.willow || []} />
  );
};

export default WillowGemCollectorModule;
