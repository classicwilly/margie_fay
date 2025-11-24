import React, { useState, useEffect } from "react";
import ContentCard from "../../ContentCard.js";

const BubbleWrap = () => {
  const [bubbles, setBubbles] = useState(() => Array(100).fill(false));

  const popBubble = (index) => {
    setBubbles((currentBubbles) => {
      const newBubbles = [...currentBubbles];
      newBubbles[index] = true;
      return newBubbles;
    });
  };

  const resetBubbles = () => setBubbles(Array(100).fill(false));

  return (
    <div>
      <div className="grid grid-cols-10 gap-2">
        {bubbles.map((isPopped, index) => (
          <button
            key={index}
            onClick={() => popBubble(index)}
            className={`aspect-square rounded-full transition-all duration-150 transform ${
              isPopped
                ? "bg-accent-blue/20 scale-90"
                : "bg-accent-blue/50 hover:bg-accent-blue/80 active:scale-95"
            }`}
            aria-label={`Pop bubble ${index + 1}`}
          />
        ))}
      </div>
      <button
        onClick={resetBubbles}
        className="w-full mt-4 p-2 bg-gray-700 rounded hover:bg-gray-600 font-semibold"
      >
        Reset
      </button>
    </div>
  );
};

const ButtonPusher = () => {
  const colors = [
    "bg-red-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-purple-500",
  ];
  const [buttons, setButtons] = useState(() => Array(25).fill(0));

  const pushButton = (index) => {
    setButtons((currentButtons) => {
      const newButtons = [...currentButtons];
      newButtons[index] = (newButtons[index] + 1) % colors.length;
      return newButtons;
    });
  };

  return (
    <div className="grid grid-cols-5 gap-2">
      {buttons.map((colorIndex, index) => (
        <button
          key={index}
          onClick={() => pushButton(index)}
          className={`aspect-square rounded-lg transition-colors duration-100 ${colors[colorIndex]}`}
          aria-label={`Push button ${index + 1}`}
        />
      ))}
    </div>
  );
};

const PopIt = () => {
  const [pops, setPops] = useState(() => Array(36).fill(false));
  const togglePop = (index) => {
    setPops((p) => {
      const newPops = [...p];
      newPops[index] = !newPops[index];
      return newPops;
    });
  };

  return (
    <div className="p-2 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg">
      <div className="grid grid-cols-6 gap-2">
        {pops.map((isPopped, index) => (
          <button
            key={index}
            onClick={() => togglePop(index)}
            className={`aspect-square rounded-full transition-all duration-150 transform ${
              isPopped
                ? "bg-black/20 scale-90"
                : "bg-white/30 hover:bg-white/50 active:scale-95"
            }`}
            aria-label={`Pop it bubble ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const SensoryRegulationModule = () => {
  const [activeTool, setActiveTool] = useState("bubbleWrap");

  const tools = {
    bubbleWrap: { label: "Bubble Wrap", component: <BubbleWrap /> },
    buttonPusher: { label: "Button Pusher", component: <ButtonPusher /> },
    popIt: { label: "Pop It", component: <PopIt /> },
  };

  // FIX: Explicitly typed component with React.FC and a props interface to handle the `key` prop correctly.
  interface TabButtonProps {
    toolKey: string;
    label: string;
  }
  const TabButton: React.FC<TabButtonProps> = ({ toolKey, label }) => (
    <button
      onClick={() => setActiveTool(toolKey)}
      className={`px-3 py-2 text-sm font-semibold rounded-t-md transition-colors w-full ${
        activeTool === toolKey
          ? "bg-card-dark border-b-2 border-accent-blue text-accent-blue"
          : "bg-gray-800 text-gray-400 hover:bg-gray-700"
      }`}
    >
      {label}
    </button>
  );

  return (
    <ContentCard title="Sensory Regulation Toolkit">
      <div className="flex border-b border-gray-700">
        {Object.entries(tools).map(([key, { label }]) => (
          <TabButton key={key} toolKey={key} label={label} />
        ))}
      </div>
      <div className="pt-4">{tools[activeTool].component}</div>
    </ContentCard>
  );
};

export default SensoryRegulationModule;
