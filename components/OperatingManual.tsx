import type { FC } from "react";
import ProtocolView from "./ProtocolView.js";

const OperatingManual: FC = () => {
  return (
    <ProtocolView
      sourceDocument="Operating Manual"
      title="The Wonky Sprout OS: Operating Manual"
      subtitle="A comprehensive guide to using the system to engineer structure from chaos."
    />
  );
};

export default OperatingManual;
