export interface ModuleManifest {
  id: string;
  name: string;
  description?: string;
  /** Backwards/aliases: 'defaultEnabled' and modern 'isEnabledByDefault' may be used. */
  defaultEnabled?: boolean;
  isEnabledByDefault?: boolean;
  isRemovable?: boolean;
  category?: string;
  icon?: string;
  route?: string;
  component?: any;
  reducer?: any;
  defaultState?: any;
  services?: Record<string, any>;
  dependencies?: string[];
  onLoad?: () => Promise<void> | void;
  onStart?: () => Promise<void> | void;
  onStop?: () => Promise<void> | void;
}

export default ModuleManifest;
