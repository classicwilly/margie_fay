/**
 * Missing Node Protocol
 * 
 * Handles tetrahedral vertex loss without forcing immediate replacement.
 * Maintains K₄ geometry with memorial vertices, stabilizes K₃ triads,
 * and provides infrastructure for graceful group transitions.
 * 
 * "The Phenix device could have a specific 'memorial' mode to acknowledge 
 * the missing node without forcing immediate replacement."
 */

export type VertexStatus = 'active' | 'memorial' | 'transitioning';

export type LossType = 
  | 'death'           // Permanent, irreversible
  | 'departure'       // Left by choice (moved, left group)
  | 'distance'        // Geographically separated
  | 'drift'           // Gradually disconnected
  | 'disagreement'    // Conflict-based separation
  | 'temporary';      // Sabbatical, medical leave, etc.

export interface MemorialVertex {
  id: string;
  name: string;
  category: 'emotional' | 'practical' | 'technical' | 'philosophical';
  status: 'memorial';
  
  // Loss metadata
  lossType: LossType;
  lossDate: Date;
  lastActiveDate: Date;
  
  // Historical data
  contributionHistory: string[];
  edgeHistory: Array<{
    connectedTo: string;
    strength: number;
    lastActive: Date;
    significantMoments: string[];
  }>;
  
  // Memorial settings
  preserveIndefinitely: boolean;  // Keep even if new 4th joins
  allowReplacement: boolean;       // Triad ready for new vertex?
  memorialMessage?: string;
  
  // Metadata
  metadata: Record<string, unknown>;
}

export interface TriadStabilization {
  tetId: string;
  originalVertices: [string, string, string, string];
  remainingVertices: [string, string, string];
  memorialVertex: string;
  
  // K₃ status
  isStable: boolean;
  stabilizedDate: Date;
  
  // Readiness for new 4th
  readyForReplacement: boolean;
  readinessDate?: Date;
  
  // Compatibility requirements for new 4th
  desiredVertexType?: 'emotional' | 'practical' | 'technical' | 'philosophical';
  compatibilityNotes?: string;
}

export interface ReplacementCriteria {
  // What vertex category is needed?
  vertexCategory: 'emotional' | 'practical' | 'technical' | 'philosophical';
  
  // How similar should they be to the memorial vertex?
  similarityRequirement: 'identical' | 'similar' | 'complementary' | 'different';
  
  // What traits matter most?
  priorityTraits: string[];
  
  // How do remaining triad members vote?
  triadConsent: {
    [vertexId: string]: 'ready' | 'not-ready' | 'needs-discussion';
  };
  
  // Is unanimous consent required?
  requiresUnanimous: boolean;
}

export class MissingNodeProtocol {
  private memorialVertices: Map<string, MemorialVertex> = new Map();
  private triadStabilizations: Map<string, TriadStabilization> = new Map();
  
  /**
   * Mark a vertex as memorial (lost, but not forgotten)
   */
  markAsMemorial(
    tetId: string,
    vertexId: string,
    vertexData: {
      name: string;
      category: 'emotional' | 'practical' | 'technical' | 'philosophical';
      lossType: LossType;
      lossDate: Date;
      lastActiveDate: Date;
      memorialMessage?: string;
      preserveIndefinitely?: boolean;
    }
  ): MemorialVertex {
    const memorial: MemorialVertex = {
      id: vertexId,
      name: vertexData.name,
      category: vertexData.category,
      status: 'memorial',
      lossType: vertexData.lossType,
      lossDate: vertexData.lossDate,
      lastActiveDate: vertexData.lastActiveDate,
      contributionHistory: [],
      edgeHistory: [],
      preserveIndefinitely: vertexData.preserveIndefinitely ?? true,
      allowReplacement: false, // Default: not ready yet
      memorialMessage: vertexData.memorialMessage,
      metadata: {}
    };
    
    this.memorialVertices.set(`${tetId}:${vertexId}`, memorial);
    
    // Automatically initiate K₃ stabilization
    this.stabilizeTriad(tetId, vertexId);
    
    return memorial;
  }
  
  /**
   * Stabilize remaining K₃ triad after vertex loss
   */
  private stabilizeTriad(tetId: string, lostVertexId: string): TriadStabilization {
    // In real implementation, this would fetch actual tetrahedron data
    // For now, we create the stabilization record
    
    const stabilization: TriadStabilization = {
      tetId,
      originalVertices: ['v1', 'v2', 'v3', lostVertexId] as [string, string, string, string],
      remainingVertices: ['v1', 'v2', 'v3'], // Would be actual IDs
      memorialVertex: lostVertexId,
      isStable: false, // Requires time and verification
      stabilizedDate: new Date(),
      readyForReplacement: false
    };
    
    this.triadStabilizations.set(tetId, stabilization);
    
    return stabilization;
  }
  
  /**
   * Check if triad has stabilized (K₃ is functioning well)
   */
  checkTriadStability(tetId: string): {
    isStable: boolean;
    daysSinceLoss: number;
    recommendation: string;
  } {
    const stabilization = this.triadStabilizations.get(tetId);
    if (!stabilization) {
      return { isStable: false, daysSinceLoss: 0, recommendation: 'No triad found' };
    }
    
    const memorial = this.memorialVertices.get(`${tetId}:${stabilization.memorialVertex}`);
    if (!memorial) {
      return { isStable: false, daysSinceLoss: 0, recommendation: 'No memorial vertex found' };
    }
    
    const daysSinceLoss = Math.floor(
      (Date.now() - memorial.lossDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    // Stabilization recommendations based on loss type
    let minDaysForStability = 30; // Default
    let recommendation = '';
    
    switch (memorial.lossType) {
      case 'death':
        minDaysForStability = 90; // Grief takes time
        recommendation = daysSinceLoss < minDaysForStability
          ? `Grief period. K₃ needs ${minDaysForStability - daysSinceLoss} more days minimum before considering replacement.`
          : 'Triad has had time to grieve. Check if members feel ready for new 4th.';
        break;
      
      case 'departure':
        minDaysForStability = 30;
        recommendation = daysSinceLoss < minDaysForStability
          ? `Adjustment period. K₃ needs ${minDaysForStability - daysSinceLoss} more days to stabilize.`
          : 'Triad has adjusted. Check if new dynamic feels stable.';
        break;
      
      case 'distance':
        minDaysForStability = 14;
        recommendation = 'Geographic separation. Consider: Can they still participate remotely? Or is memorial status appropriate?';
        break;
      
      case 'drift':
        minDaysForStability = 21;
        recommendation = 'Gradual disconnection. Triad should assess if reconnection is possible or if memorial status honors the reality.';
        break;
      
      case 'disagreement':
        minDaysForStability = 60;
        recommendation = daysSinceLoss < minDaysForStability
          ? `Conflict recovery. K₃ needs ${minDaysForStability - daysSinceLoss} more days to process and stabilize.`
          : 'Enough time has passed. Assess if conflict resolution is possible or if moving forward is healthier.';
        break;
      
      case 'temporary':
        minDaysForStability = 7;
        recommendation = 'Temporary absence. K₃ can function with ghost vertex. Monitor for return date.';
        break;
    }
    
    const isStable = daysSinceLoss >= minDaysForStability;
    
    return { isStable, daysSinceLoss, recommendation };
  }
  
  /**
   * Signal that triad is ready to consider a new 4th vertex
   */
  signalReadinessForReplacement(
    tetId: string,
    criteria: ReplacementCriteria
  ): { success: boolean; message: string } {
    const stabilization = this.triadStabilizations.get(tetId);
    if (!stabilization) {
      return { success: false, message: 'No triad stabilization found' };
    }
    
    const memorial = this.memorialVertices.get(`${tetId}:${stabilization.memorialVertex}`);
    if (!memorial) {
      return { success: false, message: 'No memorial vertex found' };
    }
    
    // Check if all triad members consent
    const consentValues = Object.values(criteria.triadConsent);
    const allReady = consentValues.every(v => v === 'ready');
    const anyNotReady = consentValues.some(v => v === 'not-ready');
    
    if (criteria.requiresUnanimous && !allReady) {
      return {
        success: false,
        message: 'Unanimous consent required but not achieved. Continue discussions.'
      };
    }
    
    if (anyNotReady) {
      return {
        success: false,
        message: 'At least one member not ready. Honor the pace of the slowest healer.'
      };
    }
    
    // Mark as ready
    stabilization.readyForReplacement = true;
    stabilization.readinessDate = new Date();
    memorial.allowReplacement = true;
    
    return {
      success: true,
      message: `Triad is ready. Seeking ${criteria.vertexCategory} vertex with ${criteria.similarityRequirement} profile.`
    };
  }
  
  /**
   * Get memorial vertex details
   */
  getMemorial(tetId: string, vertexId: string): MemorialVertex | undefined {
    return this.memorialVertices.get(`${tetId}:${vertexId}`);
  }
  
  /**
   * Get all memorial vertices across all tetrahedrons
   */
  getAllMemorials(): MemorialVertex[] {
    return Array.from(this.memorialVertices.values());
  }
  
  /**
   * Get triad stabilization status
   */
  getTriadStatus(tetId: string): TriadStabilization | undefined {
    return this.triadStabilizations.get(tetId);
  }
  
  /**
   * Update memorial message or settings
   */
  updateMemorial(
    tetId: string,
    vertexId: string,
    updates: {
      memorialMessage?: string;
      preserveIndefinitely?: boolean;
      contributionHistory?: string[];
    }
  ): boolean {
    const memorial = this.memorialVertices.get(`${tetId}:${vertexId}`);
    if (!memorial) return false;
    
    if (updates.memorialMessage !== undefined) {
      memorial.memorialMessage = updates.memorialMessage;
    }
    if (updates.preserveIndefinitely !== undefined) {
      memorial.preserveIndefinitely = updates.preserveIndefinitely;
    }
    if (updates.contributionHistory !== undefined) {
      memorial.contributionHistory = updates.contributionHistory;
    }
    
    return true;
  }
  
  /**
   * Restore a memorial vertex to active status (if loss was temporary)
   */
  restoreVertex(tetId: string, vertexId: string): { success: boolean; message: string } {
    const memorial = this.memorialVertices.get(`${tetId}:${vertexId}`);
    if (!memorial) {
      return { success: false, message: 'Memorial vertex not found' };
    }
    
    if (memorial.lossType === 'death') {
      return { success: false, message: 'Cannot restore vertex lost to death' };
    }
    
    // Remove from memorial status
    this.memorialVertices.delete(`${tetId}:${vertexId}`);
    
    // Remove triad stabilization (back to K₄)
    this.triadStabilizations.delete(tetId);
    
    return {
      success: true,
      message: `Vertex ${memorial.name} restored to active status. K₄ reformed.`
    };
  }
  
  /**
   * Check if memorial should become ghost vertex (honored ancestor) after replacement
   */
  shouldBecomeGhost(tetId: string, vertexId: string): boolean {
    const memorial = this.memorialVertices.get(`${tetId}:${vertexId}`);
    return memorial?.preserveIndefinitely ?? false;
  }
}

// Singleton instance
export const missingNodeProtocol = new MissingNodeProtocol();
