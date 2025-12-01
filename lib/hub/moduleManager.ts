/**
 * Module Manager
 * 
 * Handles module lifecycle: installation, loading, docking, undocking, removal
 * Manages inter-module communication and data flow
 */

import type { 
  Module, 
  ModuleStatus, 
  ModuleEvent, 
  ModuleEventType,
  HubAuth,
  ConnectionStatus 
} from '@/lib/types/module';
import { moduleRegistry } from './moduleRegistry';

type EventCallback = (event: ModuleEvent) => void;

class ModuleManagerService {
  private installedModules: Map<string, Module>;
  private eventListeners: Map<ModuleEventType, EventCallback[]>;

  constructor() {
    this.installedModules = new Map();
    this.eventListeners = new Map();
  }

  /**
   * Initialize module manager
   */
  async initialize(): Promise<void> {
    // Load installed modules from storage
    const savedModules = this.loadFromStorage();
    
    for (const moduleId of savedModules) {
      await this.loadModule(moduleId);
    }
  }

  /**
   * Install a module
   */
  async installModule(moduleId: string): Promise<void> {
    // Check if already installed
    if (this.installedModules.has(moduleId)) {
      throw new Error(`Module ${moduleId} is already installed`);
    }

    // Get module from registry
    const registryEntry = moduleRegistry.getById(moduleId);
    if (!registryEntry) {
      throw new Error(`Module ${moduleId} not found in registry`);
    }

    // Check dependencies
    for (const depId of registryEntry.metadata.dependencies) {
      if (!this.installedModules.has(depId)) {
        throw new Error(`Missing dependency: ${depId}`);
      }
    }

    // Load module
    await this.loadModule(moduleId);

    // Save to storage
    this.saveToStorage();

    // Emit event
    this.emitEvent({
      type: 'module:installed',
      moduleId,
      timestamp: new Date()
    });

    // Update registry stats
    moduleRegistry.updateStats(moduleId, {
      installations: (registryEntry.stats.installations || 0) + 1
    });
  }

  /**
   * Uninstall a module
   */
  async uninstallModule(moduleId: string): Promise<void> {
    const module = this.installedModules.get(moduleId);
    if (!module) {
      throw new Error(`Module ${moduleId} is not installed`);
    }

    // Check if other modules depend on this one
    for (const [id, mod] of this.installedModules.entries()) {
      if (id !== moduleId && mod.metadata.dependencies.includes(moduleId)) {
        throw new Error(`Cannot uninstall ${moduleId}: ${id} depends on it`);
      }
    }

    // Undock if docked
    if (module.status === 'docked' || module.status === 'active') {
      await this.undockModule(moduleId);
    }

    // Destroy module
    await module.destroy();

    // Remove from installed modules
    this.installedModules.delete(moduleId);

    // Save to storage
    this.saveToStorage();

    // Emit event
    this.emitEvent({
      type: 'module:uninstalled',
      moduleId,
      timestamp: new Date()
    });
  }

  /**
   * Dock a module (connect to hub)
   */
  async dockModule(moduleId: string, hubAuth: HubAuth): Promise<ConnectionStatus> {
    const module = this.installedModules.get(moduleId);
    if (!module) {
      throw new Error(`Module ${moduleId} is not installed`);
    }

    if (module.status === 'docked' || module.status === 'active') {
      throw new Error(`Module ${moduleId} is already docked`);
    }

    // Connect to hub
    const status = await module.docking.connectToHub(hubAuth);

    if (status.connected) {
      module.status = 'docked';
      await module.docking.onDock();

      // Emit event
      this.emitEvent({
        type: 'module:docked',
        moduleId,
        timestamp: new Date(),
        data: status
      });
    }

    return status;
  }

  /**
   * Undock a module (disconnect from hub)
   */
  async undockModule(moduleId: string): Promise<void> {
    const module = this.installedModules.get(moduleId);
    if (!module) {
      throw new Error(`Module ${moduleId} is not installed`);
    }

    if (module.status === 'undocked') {
      return;
    }

    // Disconnect
    await module.docking.disconnect();
    await module.docking.onUndock();

    module.status = 'undocked';

    // Emit event
    this.emitEvent({
      type: 'module:undocked',
      moduleId,
      timestamp: new Date()
    });
  }

  /**
   * Activate a module (bring to foreground)
   */
  activateModule(moduleId: string): void {
    const module = this.installedModules.get(moduleId);
    if (!module) {
      throw new Error(`Module ${moduleId} is not installed`);
    }

    if (module.status !== 'docked' && module.status !== 'background') {
      throw new Error(`Module ${moduleId} must be docked before activation`);
    }

    // Deactivate all other modules
    for (const [id, mod] of this.installedModules.entries()) {
      if (id !== moduleId && mod.status === 'active') {
        mod.status = 'background';
        this.emitEvent({
          type: 'module:deactivated',
          moduleId: id,
          timestamp: new Date()
        });
      }
    }

    module.status = 'active';

    // Emit event
    this.emitEvent({
      type: 'module:activated',
      moduleId,
      timestamp: new Date()
    });
  }

  /**
   * Deactivate a module (send to background)
   */
  deactivateModule(moduleId: string): void {
    const module = this.installedModules.get(moduleId);
    if (!module) {
      throw new Error(`Module ${moduleId} is not installed`);
    }

    if (module.status !== 'active') {
      return;
    }

    module.status = 'background';

    // Emit event
    this.emitEvent({
      type: 'module:deactivated',
      moduleId,
      timestamp: new Date()
    });
  }

  /**
   * Get a module by ID
   */
  getModule(moduleId: string): Module | undefined {
    return this.installedModules.get(moduleId);
  }

  /**
   * Get all installed modules
   */
  getInstalledModules(): Module[] {
    return Array.from(this.installedModules.values());
  }

  /**
   * Get active module
   */
  getActiveModule(): Module | undefined {
    for (const module of this.installedModules.values()) {
      if (module.status === 'active') {
        return module;
      }
    }
    return undefined;
  }

  /**
   * Check if module is installed
   */
  isInstalled(moduleId: string): boolean {
    return this.installedModules.has(moduleId);
  }

  /**
   * Subscribe to module events
   */
  on(eventType: ModuleEventType, callback: EventCallback): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType)!.push(callback);
  }

  /**
   * Unsubscribe from module events
   */
  off(eventType: ModuleEventType, callback: EventCallback): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * Emit module event
   */
  private emitEvent(event: ModuleEvent): void {
    const listeners = this.eventListeners.get(event.type);
    if (listeners) {
      listeners.forEach(callback => callback(event));
    }
  }

  /**
   * Load module from manifest
   */
  private async loadModule(moduleId: string): Promise<void> {
    const registryEntry = moduleRegistry.getById(moduleId);
    if (!registryEntry) {
      throw new Error(`Module ${moduleId} not found in registry`);
    }

    // In a real implementation, this would:
    // 1. Fetch the module manifest from manifestUrl
    // 2. Load the module code (if it's a dynamic module)
    // 3. Initialize the module
    // 4. Add to installedModules map

    // For now, we'll create a stub
    // Actual module loading will be implemented when we build specific modules
  }

  /**
   * Save installed modules to storage
   */
  private saveToStorage(): void {
    if (typeof window === 'undefined') return;
    
    const moduleIds = Array.from(this.installedModules.keys());
    localStorage.setItem('installed_modules', JSON.stringify(moduleIds));
  }

  /**
   * Load installed modules from storage
   */
  private loadFromStorage(): string[] {
    if (typeof window === 'undefined') return [];
    
    const saved = localStorage.getItem('installed_modules');
    return saved ? JSON.parse(saved) : [];
  }
}

// Singleton instance
export const moduleManager = new ModuleManagerService();
