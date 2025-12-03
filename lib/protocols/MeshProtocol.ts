/**
 * Mesh Protocol
 * 
 * Handles edge formation between distinct tetrahedrons.
 * The infrastructure for connecting billions of K₄ units into a resilient mesh.
 * 
 * "The hub is dead. Long live the mesh."
 */

export interface TetrahedronNode {
  id: string;
  name: string;
  vertices: string[]; // 4 vertex IDs
  category: 'family' | 'work' | 'project' | 'build-team' | 'custom';
  created: Date;
  metadata: Record<string, unknown>;
}

export interface SharedVertex {
  vertexId: string;
  name: string;
  tetrahedrons: string[]; // Which K₄s does this person belong to?
  category: 'emotional' | 'practical' | 'technical' | 'philosophical';
  bridgeStrength: number; // 0-1, how well they connect the groups
}

export interface MeshEdge {
  id: string;
  source: string; // Tetrahedron ID
  target: string; // Tetrahedron ID
  
  // Connection mechanism
  connectionType: 'shared-vertex' | 'project-link' | 'family-link' | 'proximity' | 'intentional';
  sharedVertices?: string[]; // If connectionType is shared-vertex
  
  // Strength metrics
  strength: number; // 0-1
  interactionFrequency: number; // Interactions per week
  trustLevel: number; // 0-1
  lastInteraction: Date;
  
  // Stability
  isStable: boolean;
  stabilizedDate?: Date;
  
  metadata: Record<string, unknown>;
}

export interface MeshTopology {
  nodes: Map<string, TetrahedronNode>;
  edges: Map<string, MeshEdge>;
  sharedVertices: Map<string, SharedVertex>;
}

export interface MeshMetrics {
  totalTetrahedrons: number;
  totalEdges: number;
  totalSharedVertices: number;
  averageConnectionsPerNode: number;
  meshDensity: number; // 0-1, how connected is the network?
  resilience: number; // 0-1, can network survive node loss?
  clusteringCoefficient: number; // 0-1, how clustered are connections?
}

export class MeshProtocol {
  private topology: MeshTopology = {
    nodes: new Map(),
    edges: new Map(),
    sharedVertices: new Map()
  };

  /**
   * Register a tetrahedron in the mesh
   */
  registerTetrahedron(tet: TetrahedronNode): void {
    this.topology.nodes.set(tet.id, tet);
    
    // Check for shared vertices with existing tetrahedrons
    this.detectSharedVertices(tet);
  }

  /**
   * Detect if any vertices are shared between tetrahedrons
   */
  private detectSharedVertices(newTet: TetrahedronNode): void {
    for (const [existingId, existingTet] of this.topology.nodes.entries()) {
      if (existingId === newTet.id) continue;
      
      const shared = newTet.vertices.filter(v => existingTet.vertices.includes(v));
      
      if (shared.length > 0) {
        // Found shared vertices - create mesh edge
        this.createMeshEdge(newTet.id, existingId, shared);
        
        // Register shared vertices
        shared.forEach(vertexId => {
          this.registerSharedVertex(vertexId, [newTet.id, existingId]);
        });
      }
    }
  }

  /**
   * Register a vertex that exists in multiple tetrahedrons
   */
  private registerSharedVertex(vertexId: string, tetIds: string[]): void {
    const existing = this.topology.sharedVertices.get(vertexId);
    
    if (existing) {
      // Add new tetrahedron references
      const allTets = new Set([...existing.tetrahedrons, ...tetIds]);
      existing.tetrahedrons = Array.from(allTets);
      existing.bridgeStrength = this.calculateBridgeStrength(Array.from(allTets));
    } else {
      // New shared vertex
      this.topology.sharedVertices.set(vertexId, {
        vertexId,
        name: vertexId, // Would be resolved from vertex registry
        tetrahedrons: tetIds,
        category: 'practical', // Would be resolved from vertex data
        bridgeStrength: this.calculateBridgeStrength(tetIds)
      });
    }
  }

  /**
   * Calculate how well a vertex bridges multiple groups
   */
  private calculateBridgeStrength(tetIds: string[]): number {
    // More groups = stronger bridge (up to a limit)
    // 2 groups = 0.5, 3 groups = 0.75, 4+ groups = 1.0
    if (tetIds.length < 2) return 0;
    if (tetIds.length === 2) return 0.5;
    if (tetIds.length === 3) return 0.75;
    return 1.0;
  }

  /**
   * Create edge between two tetrahedrons
   */
  private createMeshEdge(
    sourceId: string,
    targetId: string,
    sharedVertices: string[]
  ): void {
    const edgeId = `${sourceId}--${targetId}`;
    const reverseId = `${targetId}--${sourceId}`;
    
    // Don't duplicate edges
    if (this.topology.edges.has(edgeId) || this.topology.edges.has(reverseId)) {
      return;
    }
    
    const edge: MeshEdge = {
      id: edgeId,
      source: sourceId,
      target: targetId,
      connectionType: 'shared-vertex',
      sharedVertices,
      strength: sharedVertices.length / 4, // More shared vertices = stronger connection
      interactionFrequency: 0, // Would be tracked over time
      trustLevel: 0.5, // Initial neutral trust
      lastInteraction: new Date(),
      isStable: false, // Needs time to stabilize
      metadata: {}
    };
    
    this.topology.edges.set(edgeId, edge);
  }

  /**
   * Create intentional edge between tetrahedrons (explicit collaboration)
   */
  createIntentionalEdge(
    sourceId: string,
    targetId: string,
    purpose: string
  ): MeshEdge | null {
    const source = this.topology.nodes.get(sourceId);
    const target = this.topology.nodes.get(targetId);
    
    if (!source || !target) return null;
    
    const edgeId = `${sourceId}--${targetId}`;
    
    const edge: MeshEdge = {
      id: edgeId,
      source: sourceId,
      target: targetId,
      connectionType: 'intentional',
      strength: 0.3, // Starts weak, builds over time
      interactionFrequency: 0,
      trustLevel: 0.5,
      lastInteraction: new Date(),
      isStable: false,
      metadata: { purpose }
    };
    
    this.topology.edges.set(edgeId, edge);
    return edge;
  }

  /**
   * Record interaction between two tetrahedrons
   */
  recordInteraction(sourceId: string, targetId: string): void {
    const edgeId = `${sourceId}--${targetId}`;
    const reverseId = `${targetId}--${sourceId}`;
    
    const edge = this.topology.edges.get(edgeId) || this.topology.edges.get(reverseId);
    if (!edge) return;
    
    edge.lastInteraction = new Date();
    edge.interactionFrequency += 1;
    
    // Interaction strengthens the edge (up to limit)
    edge.strength = Math.min(1.0, edge.strength + 0.01);
    
    // Check if edge has stabilized (10+ interactions over time)
    if (edge.interactionFrequency >= 10 && !edge.isStable) {
      edge.isStable = true;
      edge.stabilizedDate = new Date();
    }
  }

  /**
   * Get all tetrahedrons a person belongs to
   */
  getPersonsTetrahedrons(vertexId: string): TetrahedronNode[] {
    const shared = this.topology.sharedVertices.get(vertexId);
    if (!shared) return [];
    
    return shared.tetrahedrons
      .map(tetId => this.topology.nodes.get(tetId))
      .filter((tet): tet is TetrahedronNode => tet !== undefined);
  }

  /**
   * Get neighbors of a tetrahedron (directly connected K₄s)
   */
  getNeighbors(tetId: string): TetrahedronNode[] {
    const neighbors: TetrahedronNode[] = [];
    
    for (const edge of this.topology.edges.values()) {
      if (edge.source === tetId) {
        const neighbor = this.topology.nodes.get(edge.target);
        if (neighbor) neighbors.push(neighbor);
      } else if (edge.target === tetId) {
        const neighbor = this.topology.nodes.get(edge.source);
        if (neighbor) neighbors.push(neighbor);
      }
    }
    
    return neighbors;
  }

  /**
   * Calculate mesh metrics
   */
  calculateMetrics(): MeshMetrics {
    const totalNodes = this.topology.nodes.size;
    const totalEdges = this.topology.edges.size;
    const totalShared = this.topology.sharedVertices.size;
    
    // Average connections per node
    const avgConnections = totalNodes > 0 ? (totalEdges * 2) / totalNodes : 0;
    
    // Mesh density (actual edges / possible edges)
    const possibleEdges = totalNodes > 1 ? (totalNodes * (totalNodes - 1)) / 2 : 0;
    const density = possibleEdges > 0 ? totalEdges / possibleEdges : 0;
    
    // Resilience (based on redundant connections)
    // Higher density + more shared vertices = more resilient
    const resilience = Math.min(1.0, (density + (totalShared / (totalNodes * 4))) / 2);
    
    // Clustering coefficient (simplified: ratio of stable edges)
    const stableEdges = Array.from(this.topology.edges.values()).filter(e => e.isStable).length;
    const clustering = totalEdges > 0 ? stableEdges / totalEdges : 0;
    
    return {
      totalTetrahedrons: totalNodes,
      totalEdges,
      totalSharedVertices: totalShared,
      averageConnectionsPerNode: avgConnections,
      meshDensity: density,
      resilience,
      clusteringCoefficient: clustering
    };
  }

  /**
   * Get distance between two tetrahedrons (BFS shortest path)
   */
  getDistance(sourceId: string, targetId: string): number {
    if (sourceId === targetId) return 0;
    if (!this.topology.nodes.has(sourceId) || !this.topology.nodes.has(targetId)) return -1;
    
    const visited = new Set<string>();
    const queue: [string, number][] = [[sourceId, 0]];
    
    while (queue.length > 0) {
      const [currentId, distance] = queue.shift()!;
      
      if (currentId === targetId) return distance;
      if (visited.has(currentId)) continue;
      
      visited.add(currentId);
      
      const neighbors = this.getNeighbors(currentId);
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor.id)) {
          queue.push([neighbor.id, distance + 1]);
        }
      }
    }
    
    return -1; // No path found
  }

  /**
   * Get the entire topology (for visualization)
   */
  getTopology(): MeshTopology {
    return this.topology;
  }

  /**
   * Get bridge vertices (people in multiple groups)
   */
  getBridgeVertices(): SharedVertex[] {
    return Array.from(this.topology.sharedVertices.values())
      .filter(v => v.tetrahedrons.length >= 2)
      .sort((a, b) => b.bridgeStrength - a.bridgeStrength);
  }

  /**
   * Check if mesh can survive loss of a tetrahedron
   */
  canSurviveLoss(tetId: string): {
    canSurvive: boolean;
    affectedNodes: string[];
    orphanedVertices: string[];
  } {
    const neighbors = this.getNeighbors(tetId);
    const tet = this.topology.nodes.get(tetId);
    
    if (!tet) return { canSurvive: true, affectedNodes: [], orphanedVertices: [] };
    
    // Find vertices that are only in this tetrahedron
    const orphaned: string[] = [];
    for (const vertexId of tet.vertices) {
      const shared = this.topology.sharedVertices.get(vertexId);
      if (!shared || shared.tetrahedrons.length === 1) {
        orphaned.push(vertexId);
      }
    }
    
    // Mesh survives if there are other connected nodes
    const canSurvive = this.topology.nodes.size > 1;
    
    return {
      canSurvive,
      affectedNodes: neighbors.map(n => n.id),
      orphanedVertices: orphaned
    };
  }
}

// Singleton instance
export const meshProtocol = new MeshProtocol();
