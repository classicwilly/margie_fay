import React from "react";
import type { ModuleManifest } from "../../types/module";

const TemplateSampleView: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Template Sample Module</h2>
      <p>This is a sample module scaffold for testing module registration.</p>
    </div>
  );
};

const reducer = (state = { counter: 0 }, action: any) => {
  switch (action.type) {
    case "INCREMENT":
      return { ...state, counter: state.counter + 1 };
    default:
      return state;
  }
};

const manifest: ModuleManifest = {
  id: "template-sample",
  name: "Template Sample Module",
  route: "/template-sample",
  component: TemplateSampleView,
  defaultState: { counter: 0 },
  reducer,
  isEnabledByDefault: true,
};

export default manifest;
