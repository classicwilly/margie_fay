import React from "react";
import ProtocolView from "./ProtocolView.js";

const DeveloperComplianceProtocol = () => {
  return (
    <ProtocolView
      sourceDocument="Developer Compliance Protocol"
      title="SOP-DEV-002: Developer Compliance Protocol"
      subtitle="A meta-protocol to prevent ad-hoc changes by enforcing a structured, diagnostic-first approach to all system modifications."
      footer={
        <footer className="text-center mt-12 pt-8 border-t border-gray-700">
          <p className="text-xl font-bold text-accent-warning">
            Complacency Kills System Integrity. Follow the Procedure.
          </p>
        </footer>
      }
    />
  );
};

export default DeveloperComplianceProtocol;
