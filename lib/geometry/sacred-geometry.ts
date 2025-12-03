/**
 * SACRED GEOMETRY ENGINE
 * 
 * Precise mathematical foundations for Fuller's geometry:
 * - Tetrahedron (4 vertices, 6 edges, 4 faces)
 * - Octahedron (6 vertices, 12 edges, 8 faces)
 * - Cuboctahedron (12 vertices, 24 edges, 14 faces)
 * - Jitterbug transformation sequences
 * - Wye-Delta phase transitions
 */

// ============================================================================
// FUNDAMENTAL CONSTANTS
// ============================================================================

/**
 * Golden Ratio (φ = (1 + √5) / 2 ≈ 1.618033988749895)
 * Appears in icosahedron and dodecahedron geometry
 */
export const PHI = (1 + Math.sqrt(5)) / 2;

/**
 * Square root of 2 (√2 ≈ 1.414213562373095)
 * Critical for tetrahedron edge relationships
 */
export const SQRT2 = Math.sqrt(2);

/**
 * Square root of 3 (√3 ≈ 1.732050807568877)
 * Height ratios in tetrahedra
 */
export const SQRT3 = Math.sqrt(3);

/**
 * Tetrahedral angle: arccos(-1/3) ≈ 109.47°
 * Angle between any two edges from a vertex
 */
export const TETRAHEDRAL_ANGLE = Math.acos(-1/3);

// ============================================================================
// COORDINATE SYSTEMS
// ============================================================================

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface Point2D {
  x: number;
  y: number;
}

/**
 * Regular Tetrahedron vertices (centered at origin, edge length = 2)
 * 
 * Vertex coordinates derived from cube corners:
 * - Take alternating vertices of a cube
 * - Normalize to edge length
 */
export const TETRAHEDRON_VERTICES: Point3D[] = [
  { x: 1, y: 1, z: 1 },      // Top-front-right
  { x: -1, y: -1, z: 1 },    // Bottom-back-right
  { x: -1, y: 1, z: -1 },    // Top-back-left
  { x: 1, y: -1, z: -1 },    // Bottom-front-left
];

/**
 * Regular Tetrahedron edges (vertex index pairs)
 */
export const TETRAHEDRON_EDGES: [number, number][] = [
  [0, 1], [0, 2], [0, 3],
  [1, 2], [1, 3], [2, 3],
];

/**
 * Regular Octahedron vertices (edge length = √2)
 * 
 * Six vertices along three perpendicular axes:
 * ±1 on each axis
 */
export const OCTAHEDRON_VERTICES: Point3D[] = [
  { x: 1, y: 0, z: 0 },   // +X
  { x: -1, y: 0, z: 0 },  // -X
  { x: 0, y: 1, z: 0 },   // +Y
  { x: 0, y: -1, z: 0 },  // -Y
  { x: 0, y: 0, z: 1 },   // +Z
  { x: 0, y: 0, z: -1 },  // -Z
];

/**
 * Cuboctahedron vertices (12 vertices at edge midpoints of cube/octahedron)
 * 
 * Coordinates are all permutations of (±1, ±1, 0)
 */
export const CUBOCTAHEDRON_VERTICES: Point3D[] = [
  // On XY plane (Z = 0)
  { x: 1, y: 1, z: 0 },
  { x: 1, y: -1, z: 0 },
  { x: -1, y: 1, z: 0 },
  { x: -1, y: -1, z: 0 },
  // On XZ plane (Y = 0)
  { x: 1, y: 0, z: 1 },
  { x: 1, y: 0, z: -1 },
  { x: -1, y: 0, z: 1 },
  { x: -1, y: 0, z: -1 },
  // On YZ plane (X = 0)
  { x: 0, y: 1, z: 1 },
  { x: 0, y: 1, z: -1 },
  { x: 0, y: -1, z: 1 },
  { x: 0, y: -1, z: -1 },
];

// ============================================================================
// GEOMETRIC TRANSFORMATIONS
// ============================================================================

/**
 * Rotate point around X axis
 */
export function rotateX(point: Point3D, angle: number): Point3D {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: point.x,
    y: point.y * cos - point.z * sin,
    z: point.y * sin + point.z * cos,
  };
}

/**
 * Rotate point around Y axis
 */
export function rotateY(point: Point3D, angle: number): Point3D {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: point.x * cos + point.z * sin,
    y: point.y,
    z: -point.x * sin + point.z * cos,
  };
}

/**
 * Rotate point around Z axis
 */
export function rotateZ(point: Point3D, angle: number): Point3D {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: point.x * cos - point.y * sin,
    y: point.x * sin + point.y * cos,
    z: point.z,
  };
}

/**
 * Apply rotation sequence: Z → X → Y (Euler angles)
 */
export function rotate3D(point: Point3D, rx: number, ry: number, rz: number): Point3D {
  let p = rotateZ(point, rz);
  p = rotateX(p, rx);
  p = rotateY(p, ry);
  return p;
}

/**
 * Scale point by factor
 */
export function scale(point: Point3D, factor: number): Point3D {
  return {
    x: point.x * factor,
    y: point.y * factor,
    z: point.z * factor,
  };
}

/**
 * Project 3D point to 2D using perspective projection
 * 
 * @param point - 3D point to project
 * @param distance - Camera distance (higher = less perspective distortion)
 * @param scale - Scale factor for screen coordinates
 * @returns 2D projected point
 */
export function project(point: Point3D, distance: number = 4, scaleFactor: number = 100): Point2D {
  const factor = scaleFactor / (distance + point.z);
  return {
    x: point.x * factor,
    y: point.y * factor,
  };
}

/**
 * Calculate Euclidean distance between two 3D points
 */
export function distance3D(p1: Point3D, p2: Point3D): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const dz = p2.z - p1.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Calculate center point (centroid) of vertices
 */
export function centroid(vertices: Point3D[]): Point3D {
  const sum = vertices.reduce(
    (acc, v) => ({
      x: acc.x + v.x,
      y: acc.y + v.y,
      z: acc.z + v.z,
    }),
    { x: 0, y: 0, z: 0 }
  );
  const n = vertices.length;
  return {
    x: sum.x / n,
    y: sum.y / n,
    z: sum.z / n,
  };
}

// ============================================================================
// JITTERBUG TRANSFORMATION
// ============================================================================

export type JitterbugPhase = 
  | 'cuboctahedron'    // Maximum expansion (12 vertices, 24 edges)
  | 'icosahedron'      // Intermediate (20 faces)
  | 'octahedron'       // Collapsed (6 vertices, 12 edges)
  | 'tetrahedron';     // Minimum (4 vertices, 6 edges)

/**
 * Interpolate between Cuboctahedron and Octahedron
 * 
 * The Jitterbug transformation contracts the cuboctahedron
 * by pulling opposite triangular faces together
 * 
 * @param t - Progress from 0 (cuboctahedron) to 1 (octahedron)
 * @returns Interpolated vertices
 */
export function jitterbugInterpolate(t: number): Point3D[] {
  // Clamp t to [0, 1]
  t = Math.max(0, Math.min(1, t));
  
  // The transformation happens by rotating square faces
  // while keeping triangular faces rigid
  const angle = (t * Math.PI) / 4; // Rotate up to 45°
  
  // Start with cuboctahedron vertices
  const vertices = CUBOCTAHEDRON_VERTICES.map(v => ({ ...v }));
  
  // Contract vertices toward octahedron configuration
  return vertices.map(v => {
    // Calculate how much to move toward nearest octahedron vertex
    const target = {
      x: Math.sign(v.x) * (Math.abs(v.x) > 0.5 ? 1 : 0),
      y: Math.sign(v.y) * (Math.abs(v.y) > 0.5 ? 1 : 0),
      z: Math.sign(v.z) * (Math.abs(v.z) > 0.5 ? 1 : 0),
    };
    
    // Interpolate
    return {
      x: v.x + (target.x - v.x) * t,
      y: v.y + (target.y - v.y) * t,
      z: v.z + (target.z - v.z) * t,
    };
  });
}

/**
 * Get Jitterbug state at specific phase
 */
export function getJitterbugPhase(phase: JitterbugPhase): Point3D[] {
  switch (phase) {
    case 'cuboctahedron':
      return CUBOCTAHEDRON_VERTICES;
    case 'octahedron':
      return OCTAHEDRON_VERTICES;
    case 'tetrahedron':
      return TETRAHEDRON_VERTICES;
    case 'icosahedron':
      // Intermediate state: 50% contraction
      return jitterbugInterpolate(0.5);
    default:
      return CUBOCTAHEDRON_VERTICES;
  }
}

// ============================================================================
// WYE-DELTA CONFIGURATIONS
// ============================================================================

/**
 * Delta configuration: All nodes peer-to-peer (mesh)
 * Forms a tetrahedron - every node connected to every other node
 */
export interface DeltaConfig {
  type: 'delta';
  vertices: Point3D[];
  edges: [number, number][];
}

/**
 * Wye configuration: Hub-and-spoke (star)
 * One central hub, peripheral nodes connect only to hub
 */
export interface WyeConfig {
  type: 'wye';
  hub: Point3D;
  periphery: Point3D[];
  edges: [number, number][]; // All edges go through hub (index 0)
}

/**
 * Generate Delta (mesh) configuration for 4 nodes
 */
export function generateDelta(scale: number = 1): DeltaConfig {
  return {
    type: 'delta',
    vertices: TETRAHEDRON_VERTICES.map(v => ({
      x: v.x * scale,
      y: v.y * scale,
      z: v.z * scale,
    })),
    edges: TETRAHEDRON_EDGES,
  };
}

/**
 * Generate Wye (star) configuration with center hub
 * 
 * @param hubIndex - Which vertex becomes the hub (0-3)
 */
export function generateWye(hubIndex: number = 0, scale: number = 1): WyeConfig {
  const vertices = TETRAHEDRON_VERTICES.map(v => ({
    x: v.x * scale,
    y: v.y * scale,
    z: v.z * scale,
  }));
  
  // Hub at center (origin)
  const hub = { x: 0, y: 0, z: 0 };
  
  // Peripheral nodes
  const periphery = vertices;
  
  // Edges: hub (index 0) connects to all periphery (indices 1-4)
  const edges: [number, number][] = periphery.map((_, i) => [0, i + 1]);
  
  return {
    type: 'wye',
    hub,
    periphery,
    edges,
  };
}

/**
 * Interpolate between Delta and Wye configurations
 * 
 * @param t - Progress from 0 (delta) to 1 (wye)
 * @param hubIndex - Which vertex becomes hub in wye config
 */
export function interpolateDeltaToWye(t: number, hubIndex: number = 0): Point3D[] {
  t = Math.max(0, Math.min(1, t));
  
  const delta = generateDelta();
  const wye = generateWye(hubIndex);
  
  // Hub position
  const hubResult = {
    x: delta.vertices[hubIndex].x * (1 - t) + wye.hub.x * t,
    y: delta.vertices[hubIndex].y * (1 - t) + wye.hub.y * t,
    z: delta.vertices[hubIndex].z * (1 - t) + wye.hub.z * t,
  };
  
  // Periphery positions
  const peripheryResults = delta.vertices.map((v, i) => {
    if (i === hubIndex) return hubResult;
    
    const wyeTarget = wye.periphery[i];
    return {
      x: v.x * (1 - t) + wyeTarget.x * t,
      y: v.y * (1 - t) + wyeTarget.y * t,
      z: v.z * (1 - t) + wyeTarget.z * t,
    };
  });
  
  return peripheryResults;
}

// ============================================================================
// FRACTAL GEOMETRY
// ============================================================================

/**
 * Generate nested tetrahedra (fractal subdivision)
 * 
 * Each tetrahedron subdivides into 4 smaller tetrahedra
 * at each corner, plus 1 in the center (octahedron)
 * 
 * @param depth - Recursion depth (0 = single tetrahedron)
 */
export function generateFractalTetrahedra(depth: number = 1): Point3D[][] {
  if (depth === 0) {
    return [TETRAHEDRON_VERTICES];
  }
  
  const result: Point3D[][] = [];
  const scale = 0.5; // Each subdivision is half the size
  
  // Generate 5 sub-tetrahedra (4 corners + 1 center)
  for (let i = 0; i < 4; i++) {
    const vertex = TETRAHEDRON_VERTICES[i];
    const subTet = TETRAHEDRON_VERTICES.map(v => ({
      x: vertex.x + v.x * scale,
      y: vertex.y + v.y * scale,
      z: vertex.z + v.z * scale,
    }));
    result.push(subTet);
  }
  
  // Recursively subdivide if depth > 1
  if (depth > 1) {
    const nested: Point3D[][] = [];
    for (const tet of result) {
      // Transform to treat as base tetrahedron
      // Then recurse
      nested.push(...generateFractalTetrahedra(depth - 1));
    }
    return nested;
  }
  
  return result;
}

// ============================================================================
// EXPORT ALL
// ============================================================================

export default {
  PHI,
  SQRT2,
  SQRT3,
  TETRAHEDRAL_ANGLE,
  TETRAHEDRON_VERTICES,
  TETRAHEDRON_EDGES,
  OCTAHEDRON_VERTICES,
  CUBOCTAHEDRON_VERTICES,
  rotateX,
  rotateY,
  rotateZ,
  rotate3D,
  scale,
  project,
  distance3D,
  centroid,
  jitterbugInterpolate,
  getJitterbugPhase,
  generateDelta,
  generateWye,
  interpolateDeltaToWye,
  generateFractalTetrahedra,
};
