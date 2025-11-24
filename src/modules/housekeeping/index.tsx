import React from "react";
import type { ModuleManifest } from "../../types/module";
import HousekeepingModule from "../../../components/modules/housekeeping/HousekeepingModule";

const reducer = (state = { lastRun: null }, action: any) => {
  switch (action.type) {
    case "HOUSEKEEPING_RUN":
      return { ...state, lastRun: new Date().toISOString() };
    default:
      return state;
  }
};

const manifest: ModuleManifest = {
  id: "housekeeping",
  name: "Housekeeping",
  route: "/housekeeping",
  component: HousekeepingModule,
  defaultState: { lastRun: null },
  reducer,
  isEnabledByDefault: true,
};

export default manifest;

