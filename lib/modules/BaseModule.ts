/**
 * Base Module Class
 * 
 * Abstract base class that all modules extend
 * Provides common functionality and docking interface implementation
 */

import type {
  Module,
  ModuleMetadata,
  ModuleStatus,
  DockingInterface,
  HubAuth,
  ConnectionStatus,
  Vertex,
  Edge
} from '@/lib/types/module';

export abstract class BaseModule implements Module {
  metadata: ModuleMetadata;
  status: ModuleStatus = 'undocked';
  vertices: [Vertex, Vertex, Vertex, Vertex];
  edges: Edge[] = [];
  subModules?: Module[];
  config?: Record<string, any>;
  
  private hubAuth: HubAuth | null = null;
  private eventSubscriptions: Map<string, Map<string, (data: any) => void>> = new Map();

  constructor(metadata: ModuleMetadata, vertices: [Vertex, Vertex, Vertex, Vertex]) {
    this.metadata = metadata;
    this.vertices = vertices;
    this.generateEdges();
  }

  /**
   * Generate complete graph edges (K4)
   */
  private generateEdges(): void {
    this.edges = [];
    
    for (let i = 0; i < 4; i++) {
      for (let j = i + 1; j < 4; j++) {
        this.edges.push({
          id: `edge-${this.vertices[i].id}-${this.vertices[j].id}`,
          source: this.vertices[i].id,
          target: this.vertices[j].id,
          strength: 1.0,
          lastInteraction: new Date()
        });
      }
    }
  }

  /**
   * Docking interface implementation
   */
  docking: DockingInterface = {
    connectToHub: async (hubAuth: HubAuth): Promise<ConnectionStatus> => {
      try {
        this.hubAuth = hubAuth;
        this.status = 'docked';
        
        await this.onConnect(hubAuth);
        
        return {
          connected: true,
          moduleId: this.metadata.id,
          hubId: hubAuth.userId,
          connectedAt: new Date()
        };
      } catch (error) {
        return {
          connected: false,
          moduleId: this.metadata.id,
          hubId: hubAuth.userId,
          error: (error as Error).message
        };
      }
    },

    disconnect: async (): Promise<void> => {
      this.hubAuth = null;
      this.status = 'undocked';
      this.eventSubscriptions.clear();
      
      await this.onDisconnect();
    },

    shareData: async (dataType: string, data: any): Promise<void> => {
      if (!this.hubAuth) {
        throw new Error('Module not connected to hub');
      }
      
      await this.onShareData(dataType, data);
    },

    receiveData: async (dataType: string): Promise<any> => {
      if (!this.hubAuth) {
        throw new Error('Module not connected to hub');
      }
      
      return await this.onReceiveData(dataType);
    },

    sendToModule: async (moduleId: string, message: any): Promise<void> => {
      if (!this.hubAuth) {
        throw new Error('Module not connected to hub');
      }
      
      await this.onSendToModule(moduleId, message);
    },

    subscribeToModule: (moduleId: string, eventType: string, callback: (data: any) => void): void => {
      if (!this.eventSubscriptions.has(moduleId)) {
        this.eventSubscriptions.set(moduleId, new Map());
      }
      
      this.eventSubscriptions.get(moduleId)!.set(eventType, callback);
    },

    unsubscribeFromModule: (moduleId: string, eventType: string): void => {
      const moduleSubscriptions = this.eventSubscriptions.get(moduleId);
      if (moduleSubscriptions) {
        moduleSubscriptions.delete(eventType);
        
        if (moduleSubscriptions.size === 0) {
          this.eventSubscriptions.delete(moduleId);
        }
      }
    },

    onDock: async (): Promise<void> => {
      await this.onDocked();
    },

    onUndock: async (): Promise<void> => {
      await this.onUndocked();
    },

    onUpdate: async (): Promise<void> => {
      await this.onUpdated();
    },

    onSync: async (): Promise<void> => {
      await this.onSynced();
    }
  };

  /**
   * Lifecycle methods (to be implemented by specific modules)
   */
  abstract initialize(): Promise<void>;
  abstract destroy(): Promise<void>;

  /**
   * Hook methods (can be overridden by specific modules)
   */
  protected async onConnect(hubAuth: HubAuth): Promise<void> {
    // Override in subclass if needed
  }

  protected async onDisconnect(): Promise<void> {
    // Override in subclass if needed
  }

  protected async onDocked(): Promise<void> {
    // Override in subclass if needed
  }

  protected async onUndocked(): Promise<void> {
    // Override in subclass if needed
  }

  protected async onUpdated(): Promise<void> {
    // Override in subclass if needed
  }

  protected async onSynced(): Promise<void> {
    // Override in subclass if needed
  }

  protected async onShareData(dataType: string, data: any): Promise<void> {
    // Override in subclass if needed
  }

  protected async onReceiveData(dataType: string): Promise<any> {
    // Override in subclass if needed
    return null;
  }

  protected async onSendToModule(moduleId: string, message: any): Promise<void> {
    // Override in subclass if needed
  }

  /**
   * Trigger event for subscribed modules
   */
  protected triggerEvent(eventType: string, data: any): void {
    // In production, this would broadcast through hub
    // For now, it's a stub
  }

  /**
   * Get vertex by ID
   */
  protected getVertex(vertexId: string): Vertex | undefined {
    return this.vertices.find(v => v.id === vertexId);
  }

  /**
   * Update vertex data
   */
  protected updateVertex(vertexId: string, updates: Partial<Vertex>): void {
    const vertex = this.getVertex(vertexId);
    if (vertex) {
      Object.assign(vertex, updates);
    }
  }

  /**
   * Get edge between two vertices
   */
  protected getEdge(sourceId: string, targetId: string): Edge | undefined {
    return this.edges.find(
      e => (e.source === sourceId && e.target === targetId) ||
           (e.source === targetId && e.target === sourceId)
    );
  }

  /**
   * Update edge strength
   */
  protected updateEdgeStrength(sourceId: string, targetId: string, strength: number): void {
    const edge = this.getEdge(sourceId, targetId);
    if (edge) {
      edge.strength = Math.max(0, Math.min(1, strength));
      edge.lastInteraction = new Date();
    }
  }

  /**
   * Check if module is connected to hub
   */
  protected isConnected(): boolean {
    return this.hubAuth !== null && this.status !== 'undocked';
  }

  /**
   * Get current hub auth
   */
  protected getHubAuth(): HubAuth | null {
    return this.hubAuth;
  }
}
