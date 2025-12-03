/**
 * PHENIX GEOMETRY CALCULATOR
 * 
 * Precise mathematical calculations for the Phenix Framework:
 * - Tetrahedron metrics and relationships
 * - Energy calculations for Wye-Delta transitions
 * - Fractal scaling factors
 * - System stability metrics
 */

import {
  TETRAHEDRON_VERTICES,
  TETRAHEDRON_EDGES,
  SQRT2,
  SQRT3,
  TETRAHEDRAL_ANGLE,
  distance3D,
  centroid,
  type Point3D
} from './sacred-geometry';

// ============================================================================
// TETRAHEDRON METRICS
// ============================================================================

/**
 * Calculate edge length of regular tetrahedron
 * Given vertices with unit distance from origin
 */
export function calculateTetrahedronEdgeLength(): number {
  // Distance between first two vertices
  return distance3D(TETRAHEDRON_VERTICES[0], TETRAHEDRON_VERTICES[1]);
}

/**
 * Calculate surface area of regular tetrahedron
 * Surface area = √3 × edge²
 */
export function calculateTetrahedronSurfaceArea(edgeLength: number): number {
  return SQRT3 * edgeLength * edgeLength;
}

/**
 * Calculate volume of regular tetrahedron
 * Volume = (edge³) / (6√2)
 */
export function calculateTetrahedronVolume(edgeLength: number): number {
  return (edgeLength ** 3) / (6 * SQRT2);
}

/**
 * Calculate height of regular tetrahedron
 * Height = edge × √(2/3)
 */
export function calculateTetrahedronHeight(edgeLength: number): number {
  return edgeLength * Math.sqrt(2/3);
}

/**
 * Calculate radius of circumscribed sphere (vertices on sphere)
 * R = edge × √(3/8)
 */
export function calculateCircumradius(edgeLength: number): number {
  return edgeLength * Math.sqrt(3/8);
}

/**
 * Calculate radius of inscribed sphere (tangent to all faces)
 * r = edge / (2√6)
 */
export function calculateInradius(edgeLength: number): number {
  return edgeLength / (2 * Math.sqrt(6));
}

/**
 * Calculate the dihedral angle between two faces
 * Dihedral angle ≈ 70.53° = arccos(1/3)
 */
export function getDihedralAngle(): number {
  return Math.acos(1/3);
}

/**
 * Calculate solid angle at each vertex
 * Solid angle ≈ 0.55129 steradians
 */
export function getSolidAngleAtVertex(): number {
  // Ω = π - 3 × arccos(1/3)
  return Math.PI - 3 * Math.acos(1/3);
}

// ============================================================================
// DELTA CONFIGURATION METRICS
// ============================================================================

export interface DeltaMetrics {
  edgeCount: number;
  totalEdgeLength: number;
  connectivity: number; // edges per vertex
  redundancy: number; // alternate paths
  energy: number; // relative energy cost
  resilience: number; // failure tolerance
}

/**
 * Calculate metrics for Delta (mesh) configuration
 * All nodes peer-to-peer, fully connected
 */
export function calculateDeltaMetrics(edgeLength: number = 1): DeltaMetrics {
  const vertexCount = 4;
  const edgeCount = 6; // Complete graph K₄
  
  return {
    edgeCount,
    totalEdgeLength: edgeCount * edgeLength,
    connectivity: edgeCount / vertexCount, // 1.5 edges per vertex (undirected)
    redundancy: 3, // Each pair has 3 paths connecting them
    energy: edgeCount * edgeLength, // Higher energy (more connections)
    resilience: 1.0, // Maximum - can lose any node
  };
}

// ============================================================================
// WYE CONFIGURATION METRICS
// ============================================================================

export interface WyeMetrics {
  edgeCount: number;
  totalEdgeLength: number;
  connectivity: number;
  redundancy: number;
  energy: number;
  resilience: number;
  hubLoad: number; // % of traffic through hub
}

/**
 * Calculate metrics for Wye (star) configuration
 * Hub-and-spoke topology
 */
export function calculateWyeMetrics(edgeLength: number = 1): WyeMetrics {
  const peripheryCount = 3;
  const edgeCount = peripheryCount; // Only hub connections
  
  return {
    edgeCount,
    totalEdgeLength: edgeCount * edgeLength,
    connectivity: edgeCount / 4, // 0.75 (only hub has connections)
    redundancy: 1, // Single path through hub
    energy: edgeCount * edgeLength, // Lower energy (fewer connections)
    resilience: 0.0, // Zero - hub failure = total failure
    hubLoad: 1.0, // 100% of traffic through hub
  };
}

// ============================================================================
// PHASE TRANSITION CALCULATIONS
// ============================================================================

/**
 * Calculate energy required for Delta → Wye transition
 * Breaking peer edges, forming hub connections
 */
export function calculateDeltaToWyeEnergy(edgeLength: number = 1): number {
  const deltaMetrics = calculateDeltaMetrics(edgeLength);
  const wyeMetrics = calculateWyeMetrics(edgeLength);
  
  // Energy released = difference in total edge length
  // Delta has 6 edges, Wye has 3 edges
  // Net energy release (exothermic transition)
  return deltaMetrics.totalEdgeLength - wyeMetrics.totalEdgeLength;
}

/**
 * Calculate energy required for Wye → Delta transition (VPI)
 * Forming new peer edges, bypassing hub
 */
export function calculateWyeToDeltaEnergy(edgeLength: number = 1): number {
  const wyeMetrics = calculateWyeMetrics(edgeLength);
  const deltaMetrics = calculateDeltaMetrics(edgeLength);
  
  // Energy input required = difference in total edge length
  // Must form 3 new peer edges
  // Net energy absorption (endothermic transition)
  return deltaMetrics.totalEdgeLength - wyeMetrics.totalEdgeLength;
}

/**
 * Calculate activation energy for transition
 * Energy barrier that must be overcome to change state
 */
export function calculateActivationEnergy(edgeLength: number = 1): number {
  // Barrier height = energy to temporarily disconnect all edges
  // Then reconnect in new configuration
  // Approximately 2× the edge length (empirical)
  return 2 * edgeLength * TETRAHEDRON_EDGES.length;
}

// ============================================================================
// SYSTEM STABILITY CALCULATIONS
// ============================================================================

export interface StabilityMetrics {
  state: 'delta' | 'wye' | 'transition';
  resilience: number; // 0-1, tolerance to node failure
  efficiency: number; // 0-1, energy efficiency
  load: number; // 0-1, system load
  risk: number; // 0-1, collapse probability
}

/**
 * Calculate current system stability based on configuration
 */
export function calculateStability(
  config: 'delta' | 'wye',
  hubHealth: number = 1.0, // For wye: 0-1 health of hub
  loadFactor: number = 0.5 // Current system load
): StabilityMetrics {
  if (config === 'delta') {
    return {
      state: 'delta',
      resilience: 1.0, // Can lose any single node
      efficiency: 0.5, // More edges = more energy
      load: loadFactor,
      risk: loadFactor > 0.8 ? 0.3 : 0.1, // Risk increases with load
    };
  } else {
    // Wye configuration
    const hubRisk = 1 - hubHealth;
    const overloadRisk = loadFactor > 0.7 ? (loadFactor - 0.7) * 2 : 0;
    
    return {
      state: 'wye',
      resilience: hubHealth * 0.2, // Entirely depends on hub
      efficiency: 0.9, // Fewer edges = less energy
      load: loadFactor,
      risk: Math.min(1, hubRisk + overloadRisk), // Combined risks
    };
  }
}

/**
 * Determine if system should transition states
 */
export function shouldTransition(
  currentState: 'delta' | 'wye',
  metrics: StabilityMetrics
): { shouldTransition: boolean; reason: string; targetState: 'delta' | 'wye' } {
  if (currentState === 'delta') {
    // Delta → Wye: High load makes hub efficient
    if (metrics.load > 0.7) {
      return {
        shouldTransition: true,
        reason: 'High load detected - hub coordination more efficient',
        targetState: 'wye'
      };
    }
  } else {
    // Wye → Delta: Hub at risk or recovering from failure
    if (metrics.risk > 0.6) {
      return {
        shouldTransition: true,
        reason: 'Hub at risk - decentralize to prevent failure',
        targetState: 'delta'
      };
    }
    
    if (metrics.load < 0.3) {
      return {
        shouldTransition: true,
        reason: 'Low load - mesh more resilient than hub',
        targetState: 'delta'
      };
    }
  }
  
  return {
    shouldTransition: false,
    reason: 'Current state optimal',
    targetState: currentState
  };
}

// ============================================================================
// FRACTAL SCALING CALCULATIONS
// ============================================================================

/**
 * Calculate metrics at different fractal depths
 * Each level subdivides into smaller tetrahedra
 */
export function calculateFractalMetrics(depth: number): {
  tetrahedronCount: number;
  totalVertices: number;
  totalEdges: number;
  scaleFactor: number;
} {
  // Each subdivision creates 4 smaller tetrahedra at corners
  const tetrahedronCount = Math.pow(4, depth);
  
  // Scale factor: each level is 1/2 the size
  const scaleFactor = Math.pow(0.5, depth);
  
  // Vertices: 4 initial + 3 per new tetrahedron (sharing vertices)
  const totalVertices = 4 + (tetrahedronCount - 1) * 3;
  
  // Edges: 6 per tetrahedron, but shared between adjacent
  const totalEdges = tetrahedronCount * 6;
  
  return {
    tetrahedronCount,
    totalVertices,
    totalEdges,
    scaleFactor
  };
}

/**
 * Calculate total system capacity at fractal depth
 * How many users/modules can dock at this level
 */
export function calculateSystemCapacity(depth: number): number {
  const metrics = calculateFractalMetrics(depth);
  // Each tetrahedron can support 4 vertices
  return metrics.tetrahedronCount * 4;
}

// ============================================================================
// JITTERBUG FREQUENCY CALCULATIONS
// ============================================================================

/**
 * Calculate natural oscillation frequency
 * How often system should breathe between Delta and Wye
 */
export function calculateJitterbugFrequency(
  averageLoad: number = 0.5,
  teamSize: number = 4
): {
  period: number; // seconds between transitions
  frequency: number; // Hz
  description: string;
} {
  // Heuristic: Higher load = slower oscillation (longer Wye phase)
  // Larger team = faster oscillation (more coordination needed)
  
  const basePeriod = 3600; // 1 hour baseline
  const loadFactor = 1 + averageLoad; // 1.0 - 2.0
  const sizeFactor = 4 / teamSize; // Smaller teams faster
  
  const period = basePeriod * loadFactor * sizeFactor;
  const frequency = 1 / period;
  
  let description = '';
  if (period < 600) {
    description = 'Rapid oscillation - high coordination needs';
  } else if (period < 3600) {
    description = 'Normal oscillation - healthy breathing';
  } else if (period < 86400) {
    description = 'Slow oscillation - stable but watch for stuck hub';
  } else {
    description = 'WARNING: Very slow - system may be stuck in Wye';
  }
  
  return { period, frequency, description };
}

/**
 * Calculate rotation period for healthy hub rotation
 * How long each vertex should be hub before rotating
 */
export function calculateRotationPeriod(vertexCount: number = 4): {
  maxHubDuration: number; // seconds one vertex should be hub
  rotationCycle: number; // seconds for full rotation through all vertices
} {
  // Rule: No vertex should be hub for more than 1/3 of cycle
  const rotationCycle = 86400; // 24 hours full cycle
  const maxHubDuration = rotationCycle / (vertexCount * 3);
  
  return { maxHubDuration, rotationCycle };
}

// ============================================================================
// EXPORT ALL
// ============================================================================

export default {
  calculateTetrahedronEdgeLength,
  calculateTetrahedronSurfaceArea,
  calculateTetrahedronVolume,
  calculateTetrahedronHeight,
  calculateCircumradius,
  calculateInradius,
  getDihedralAngle,
  getSolidAngleAtVertex,
  calculateDeltaMetrics,
  calculateWyeMetrics,
  calculateDeltaToWyeEnergy,
  calculateWyeToDeltaEnergy,
  calculateActivationEnergy,
  calculateStability,
  shouldTransition,
  calculateFractalMetrics,
  calculateSystemCapacity,
  calculateJitterbugFrequency,
  calculateRotationPeriod,
};
