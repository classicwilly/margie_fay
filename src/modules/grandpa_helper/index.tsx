import GrandpaHelper from "../../components/GrandpaHelper";
import type { ModuleManifest } from "../../types/module";

const manifest: ModuleManifest = {
  id: "grandpa-helper",
  name: "Grandpa Helper",
  route: "/grandpa-helper",
  component: GrandpaHelper,
  defaultState: {},
  isEnabledByDefault: true,
};

export default manifest;
