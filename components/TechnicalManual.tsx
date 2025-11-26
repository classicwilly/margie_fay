import type { FC } from "react";
import ProtocolView from "./ProtocolView.js";

const TechnicalManual: FC = () => {
  return (
    <ProtocolView
      sourceDocument="Technical Manual"
      title="WONKY SPROUT OS: TECHNICAL MANUAL"
      subtitle="The comprehensive guide to the system's architecture, build process, state management, and troubleshooting procedures. This is the 'How' for developers."
    />
  );
};

export default TechnicalManual;
