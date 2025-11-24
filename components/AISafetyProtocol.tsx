import React from "react";
import ProtocolView from "./ProtocolView.js";

const AISafetyProtocol = () => {
  return (
    <ProtocolView
      sourceDocument="AI Safety Protocol"
      title="AI Safety & Usage Protocol"
      subtitle="Guidelines for interacting with AI systems, ensuring data privacy, ethical use, and mental well-being."
      footer={
        <footer className="text-center mt-12 pt-8 border-t border-gray-700">
          <p className="text-xl font-bold text-accent-blue">
            The AI is a powerful tool. This protocol ensures it serves you, not
            the other way around.
          </p>
        </footer>
      }
    />
  );
};

export { AISafetyProtocol };
export default AISafetyProtocol;
