import React from "react";
import ProtocolView from "./ProtocolView.js";

const CoParentingCommunicationProtocol = () => {
  return (
    <ProtocolView
      sourceDocument="Co-Parenting Communication Protocol"
      title="Co-Parenting Communication Protocol"
      subtitle="A structured system for low-friction, high-clarity communication and logistics with the co-parent. Focus on facts, not feelings."
      footer={
        <footer className="text-center mt-12 pt-8 border-t border-gray-700">
          <p className="text-xl font-bold text-accent-blue">
            This protocol is not about winning. It is about creating a stable,
            predictable environment for the children by reducing parental
            conflict.
          </p>
        </footer>
      }
    />
  );
};

export default CoParentingCommunicationProtocol;
