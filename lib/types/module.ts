/**
 * Core type definitions for the Tetrahedron Protocol module system
 * 
 * Everything is a tetrahedron: 4 vertices, 6 edges, complete graph (K4)
 */

// ============================================================================
// VERTEX TYPES
// ============================================================================

export type VertexCategory = 'technical' | 'emotional' | 'practical' | 'philosophical';

export interface Vertex {
  id: string;
  name: string;
  category: VertexCategory;
  description: string;
  data?: Record<string, any>;
}

// ============================================================================
// EDGE TYPES
// ============================================================================

export interface Edge {
  id: string;
  source: string;  // Vertex ID
  target: string;  // Vertex ID
  strength: number;  // 0-1, how connected these vertices are
  lastInteraction?: Date;
  data?: Record<string, any>;
}

// ============================================================================
// TETRAHEDRON (Base Structure)
// ============================================================================

export interface Tetrahedron {
  vertices: [Vertex, Vertex, Vertex, Vertex];  // Always exactly 4
  edges: Edge[];  // Should be 6 for complete graph
  baseMetadata?: {
    created: Date;
    updated: Date;
    version: string;
  };
}

// ============================================================================
// MODULE TYPES
// ============================================================================

export type ModuleStatus = 'undocked' | 'docked' | 'active' | 'background' | 'syncing';

export type ModuleCategory = 
  | 'parenting'
  | 'productivity' 
  | 'health'
  | 'education'
  | 'communication'
  | 'coordination'
  | 'custom';

export type ModuleLicense = 'CC-BY-4.0' | 'MIT' | 'GPL-3.0' | 'proprietary';

export interface ModuleMetadata {
  id: string;
  name: string;
  description: string;
  author: string;
  version: string;
  license: ModuleLicense;
  category: ModuleCategory;
  tags: string[];
  dependencies: string[];  // Other module IDs required
  installations?: number;
  rating?: number;
  lastUpdated: Date;
  repository?: string;  // GitHub repo URL
  homepage?: string;
  icon?: string;  // Icon URL or emoji
}

// ============================================================================
// DOCKING INTERFACE
// ============================================================================

export interface HubAuth {
  userId: string;
  token: string;
  permissions: string[];
}

export interface ConnectionStatus {
  connected: boolean;
  moduleId: string;
  hubId: string;
  connectedAt?: Date;
  error?: string;
}

export interface DockingInterface {
  // Identity & Authentication
  connectToHub(hubAuth: HubAuth): Promise<ConnectionStatus>;
  disconnect(): Promise<void>;
  
  // Data Exchange
  shareData(dataType: string, data: any): Promise<void>;
  receiveData(dataType: string): Promise<any>;
  
  // Inter-Module Communication
  sendToModule(moduleId: string, message: any): Promise<void>;
  subscribeToModule(moduleId: string, eventType: string, callback: (data: any) => void): void;
  unsubscribeFromModule(moduleId: string, eventType: string): void;
  
  // Lifecycle Hooks
  onDock(): void | Promise<void>;
  onUndock(): void | Promise<void>;
  onUpdate(): void | Promise<void>;
  onSync(): void | Promise<void>;
}

// ============================================================================
// MODULE DEFINITION
// ============================================================================

export interface Module extends Tetrahedron {
  metadata: ModuleMetadata;
  status: ModuleStatus;
  docking: DockingInterface;
  subModules?: Module[];  // Fractal: each module can contain 4 sub-modules
  config?: Record<string, any>;  // Module-specific configuration
  
  // Module Lifecycle Methods
  initialize(): Promise<void>;
  destroy(): Promise<void>;
  
  // UI Components (React components exported by module)
  components?: {
    main?: React.ComponentType<any>;
    settings?: React.ComponentType<any>;
    widget?: React.ComponentType<any>;
  };
}

// ============================================================================
// HUB TYPES
// ============================================================================

export interface HubData {
  userId: string;
  tetrahedron: Tetrahedron;  // User's core support tetrahedron
  installedModules: string[];  // Module IDs
  moduleData: Record<string, any>;  // Module-specific data storage
  settings: HubSettings;
}

export interface HubSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  dataSharing: 'none' | 'minimal' | 'full';
  backupEnabled: boolean;
}

// ============================================================================
// MODULE REGISTRY
// ============================================================================

export interface ModuleRegistryEntry {
  metadata: ModuleMetadata;
  manifestUrl: string;  // URL to module manifest JSON
  verified: boolean;  // Official/verified module
  stats: {
    installations: number;
    rating: number;
    reviews: number;
  };
}

export interface ModuleRegistry {
  core: ModuleRegistryEntry[];  // Official modules
  community: ModuleRegistryEntry[];  // Community modules
  private: ModuleRegistryEntry[];  // User's private modules
}

// ============================================================================
// MODULE EVENTS
// ============================================================================

export type ModuleEventType = 
  | 'module:installed'
  | 'module:uninstalled'
  | 'module:docked'
  | 'module:undocked'
  | 'module:activated'
  | 'module:deactivated'
  | 'module:updated'
  | 'data:shared'
  | 'data:received';

export interface ModuleEvent {
  type: ModuleEventType;
  moduleId: string;
  timestamp: Date;
  data?: any;
}

// ============================================================================
// MODULE CREATOR TYPES
// ============================================================================

export interface ModuleTemplate {
  id: string;
  name: string;
  description: string;
  vertices: Partial<Vertex>[];  // Pre-configured vertex templates
  edges: Partial<Edge>[];
  scaffolding: {
    files: string[];  // File templates to generate
    dependencies: string[];  // npm packages needed
  };
}

export interface ModuleCreatorConfig {
  metadata: Partial<ModuleMetadata>;
  vertices: Vertex[];
  edges: Edge[];
  dockingPreferences: {
    autoConnect: boolean;
    dataSharing: string[];
    eventSubscriptions: string[];
  };
  uiComponents: {
    hasMainView: boolean;
    hasSettingsView: boolean;
    hasWidgetView: boolean;
  };
}
