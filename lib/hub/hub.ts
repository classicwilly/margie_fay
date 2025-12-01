/**
 * Hub Core
 * 
 * Central coordination point for the Tetrahedron Protocol
 * Manages user tetrahedron, module docking, and cross-module communication
 */

import type { 
  HubData, 
  HubSettings, 
  HubAuth, 
  Tetrahedron,
  Vertex
} from '@/lib/types/module';
import { moduleRegistry } from './moduleRegistry';
import { moduleManager } from './moduleManager';

class HubService {
  private hubData: HubData | null = null;
  private initialized: boolean = false;

  /**
   * Initialize the hub
   */
  async initialize(userId: string): Promise<void> {
    if (this.initialized) {
      return;
    }

    // Load or create hub data
    this.hubData = this.loadHubData(userId) || this.createDefaultHubData(userId);

    // Initialize module registry
    await moduleRegistry.initialize();

    // Initialize module manager
    await moduleManager.initialize();

    this.initialized = true;
  }

  /**
   * Get current hub data
   */
  getHubData(): HubData | null {
    return this.hubData;
  }

  /**
   * Get user's core tetrahedron
   */
  getTetrahedron(): Tetrahedron | null {
    return this.hubData?.tetrahedron || null;
  }

  /**
   * Update user's tetrahedron
   */
  updateTetrahedron(tetrahedron: Tetrahedron): void {
    if (!this.hubData) {
      throw new Error('Hub not initialized');
    }

    this.hubData.tetrahedron = tetrahedron;
    this.saveHubData();
  }

  /**
   * Update specific vertex
   */
  updateVertex(vertexId: string, updates: Partial<Vertex>): void {
    if (!this.hubData) {
      throw new Error('Hub not initialized');
    }

    const vertex = this.hubData.tetrahedron.vertices.find(v => v.id === vertexId);
    if (!vertex) {
      throw new Error(`Vertex ${vertexId} not found`);
    }

    Object.assign(vertex, updates);
    this.saveHubData();
  }

  /**
   * Get hub settings
   */
  getSettings(): HubSettings | null {
    return this.hubData?.settings || null;
  }

  /**
   * Update hub settings
   */
  updateSettings(settings: Partial<HubSettings>): void {
    if (!this.hubData) {
      throw new Error('Hub not initialized');
    }

    this.hubData.settings = {
      ...this.hubData.settings,
      ...settings
    };
    this.saveHubData();
  }

  /**
   * Get authentication credentials for modules
   */
  getAuth(): HubAuth {
    if (!this.hubData) {
      throw new Error('Hub not initialized');
    }

    return {
      userId: this.hubData.userId,
      token: this.generateToken(),
      permissions: ['read', 'write', 'share']
    };
  }

  /**
   * Store module data
   */
  setModuleData(moduleId: string, data: any): void {
    if (!this.hubData) {
      throw new Error('Hub not initialized');
    }

    this.hubData.moduleData[moduleId] = data;
    this.saveHubData();
  }

  /**
   * Retrieve module data
   */
  getModuleData(moduleId: string): any {
    return this.hubData?.moduleData[moduleId];
  }

  /**
   * Clear module data
   */
  clearModuleData(moduleId: string): void {
    if (!this.hubData) {
      return;
    }

    delete this.hubData.moduleData[moduleId];
    this.saveHubData();
  }

  /**
   * Export all hub data (for backup)
   */
  exportData(): string {
    if (!this.hubData) {
      throw new Error('Hub not initialized');
    }

    return JSON.stringify(this.hubData, null, 2);
  }

  /**
   * Import hub data (from backup)
   */
  importData(jsonData: string): void {
    try {
      const data = JSON.parse(jsonData) as HubData;
      
      // Validate data structure
      if (!data.userId || !data.tetrahedron || !data.settings) {
        throw new Error('Invalid hub data format');
      }

      this.hubData = data;
      this.saveHubData();
    } catch (error) {
      throw new Error('Failed to import hub data: ' + (error as Error).message);
    }
  }

  /**
   * Reset hub (clear all data)
   */
  reset(): void {
    if (!this.hubData) {
      return;
    }

    const userId = this.hubData.userId;
    this.hubData = this.createDefaultHubData(userId);
    this.saveHubData();
  }

  /**
   * Create default hub data for new user
   */
  private createDefaultHubData(userId: string): HubData {
    return {
      userId,
      tetrahedron: {
        vertices: [
          {
            id: 'vertex-1',
            name: '',
            category: 'technical',
            description: 'Primary support person (technical coordination)'
          },
          {
            id: 'vertex-2',
            name: '',
            category: 'emotional',
            description: 'Emotional support person'
          },
          {
            id: 'vertex-3',
            name: '',
            category: 'practical',
            description: 'Practical help and daily support'
          },
          {
            id: 'vertex-4',
            name: '',
            category: 'philosophical',
            description: 'Guidance and perspective'
          }
        ],
        edges: [],
        baseMetadata: {
          created: new Date(),
          updated: new Date(),
          version: '1.0.0'
        }
      },
      installedModules: [],
      moduleData: {},
      settings: {
        theme: 'system',
        notifications: true,
        dataSharing: 'minimal',
        backupEnabled: true
      }
    };
  }

  /**
   * Load hub data from storage
   */
  private loadHubData(userId: string): HubData | null {
    if (typeof window === 'undefined') return null;

    const key = `hub_data_${userId}`;
    const saved = localStorage.getItem(key);
    
    if (!saved) return null;

    try {
      return JSON.parse(saved) as HubData;
    } catch {
      return null;
    }
  }

  /**
   * Save hub data to storage
   */
  private saveHubData(): void {
    if (!this.hubData || typeof window === 'undefined') return;

    const key = `hub_data_${this.hubData.userId}`;
    localStorage.setItem(key, JSON.stringify(this.hubData));
  }

  /**
   * Generate authentication token
   */
  private generateToken(): string {
    // In production, this would be a real auth token
    return `hub_token_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }
}

// Singleton instance
export const hub = new HubService();
