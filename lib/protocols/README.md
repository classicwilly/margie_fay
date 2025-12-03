# Protocol Layer

This directory contains the **protocol implementations** that govern how the Phenix Framework handles critical transitions and edge cases in tetrahedral group dynamics.

## Missing Node Protocol

**File:** `MissingNodeProtocol.ts`

**Purpose:** Handles vertex loss in K₄ tetrahedrons without forcing immediate replacement. Maintains topological integrity while honoring the human experience of grief, transition, and restructuring.

### Key Concepts

**Memorial Vertex:** A vertex that is marked as lost but preserved in the topology. The vertex remains visible in the geometry but is no longer active. This prevents the system from forcing immediate replacement while maintaining the structural history.

**K₃ Stabilization:** When a K₄ tetrahedron loses one vertex, the remaining three form a K₃ triad (triangle). This is a stable structure on its own. The protocol monitors the triad's health and only signals readiness for a new 4th vertex when the triad has stabilized.

**Loss Types:**
- **Death:** Permanent, irreversible. Requires longest grief period (90+ days recommended).
- **Departure:** Person left by choice (moved away, left group). Requires adjustment period (30+ days).
- **Distance:** Geographic separation. May be reversible if remote participation possible.
- **Drift:** Gradual disconnection. Triad should assess if reconnection possible or if memorial status honors reality.
- **Disagreement:** Conflict-based separation. Requires conflict recovery period (60+ days).
- **Temporary:** Sabbatical, medical leave, etc. Shortest stabilization period (7+ days), vertex may return.

### Core Functions

#### `markAsMemorial()`
Marks a vertex as memorial (lost but not forgotten). Automatically initiates K₃ stabilization for remaining triad.

#### `checkTriadStability()`
Assesses whether the K₃ triad has stabilized after loss. Returns stability status, days since loss, and recommendations based on loss type.

#### `signalReadinessForReplacement()`
Allows triad to signal they're ready to consider a new 4th vertex. Requires consent from remaining members (can be unanimous or majority).

#### `getMemorial()`
Retrieves memorial vertex details, including contribution history, edge history, and memorial message.

#### `restoreVertex()`
Restores a memorial vertex to active status if loss was temporary (not applicable for death).

#### `shouldBecomeGhost()`
Determines if memorial should remain as "ghost vertex" (honored ancestor) even after new 4th joins. Allows tetrahedron to remember its history.

### Usage Example

```typescript
import { missingNodeProtocol } from '@/lib/protocols/MissingNodeProtocol';

// A vertex is lost (death, departure, etc.)
const memorial = missingNodeProtocol.markAsMemorial(
  'tetrahedron-1',
  'vertex-alice',
  {
    name: 'Alice',
    category: 'emotional',
    lossType: 'death',
    lossDate: new Date('2025-07-19'),
    lastActiveDate: new Date('2025-07-18'),
    memorialMessage: 'Alice was the heart of our group. We miss her daily.',
    preserveIndefinitely: true
  }
);

// Check if triad has stabilized
const stability = missingNodeProtocol.checkTriadStability('tetrahedron-1');
console.log(stability.recommendation);
// "Grief period. K₃ needs 45 more days minimum before considering replacement."

// Later, when triad is ready...
const readiness = missingNodeProtocol.signalReadinessForReplacement(
  'tetrahedron-1',
  {
    vertexCategory: 'emotional', // Same category as Alice
    similarityRequirement: 'similar', // Someone similar to Alice
    priorityTraits: ['empathy', 'listening', 'emotional-intelligence'],
    triadConsent: {
      'vertex-bob': 'ready',
      'vertex-charlie': 'ready',
      'vertex-diana': 'ready'
    },
    requiresUnanimous: true
  }
);

if (readiness.success) {
  // System can now help find compatible 4th vertex
  // Alice's memorial remains as ghost vertex
}
```

### Why This Matters

**Without this protocol:**
- System forces immediate replacement ("Find a new 4th NOW!")
- Grief is rushed, invalidated
- Wrong person fills wrong space
- Original member becomes "replaceable"
- Group destabilizes further

**With this protocol:**
- K₃ triad stabilizes naturally
- Grief is honored with time
- Replacement happens when ready
- Memorial vertex preserves history
- Group strengthens through resilience

---

## Mesh Protocol

**File:** `MeshProtocol.ts`

**Purpose:** Handles edge formation between distinct tetrahedrons. The infrastructure for connecting billions of K₄ units into a resilient mesh.

### Key Concepts

**Tetrahedron Node:** A K₄ unit registered in the mesh. Can be family, work team, build team, project group, etc.

**Mesh Edge:** Connection between two tetrahedrons. Formed by shared vertices (person in multiple groups) or intentional collaboration.

**Bridge Vertex:** A person who exists in multiple tetrahedrons. The critical connective tissue of the mesh.

**Mesh Topology:** The complete graph of all connected tetrahedrons. No central hub—purely distributed.

### Core Functions

#### `registerTetrahedron()`
Adds a K₄ unit to the mesh. Automatically detects shared vertices with existing tetrahedrons and forms edges.

#### `createIntentionalEdge()`
Creates explicit collaboration edge between two tetrahedrons (not via shared vertex).

#### `getNeighbors()`
Returns all tetrahedrons directly connected to a given K₄.

#### `calculateMetrics()`
Computes mesh health: density, resilience, clustering coefficient, average connections.

#### `getBridgeVertices()`
Returns people who connect multiple groups, ranked by bridge strength.

#### `canSurviveLoss()`
Analyzes whether mesh remains connected if a tetrahedron is lost.

### Scale Invariance

The same protocol that connects 2 tetrahedrons connects 4 billion:
- **2 → 40:** Extended network (family + friends + work)
- **40 → 4,000:** Community scale (city-level mesh)
- **4,000 → 4,000,000:** Regional scale
- **4M → 4B:** Global infrastructure

What changes: Performance optimization, distributed consensus, federated architecture.  
What stays the same: K₄ topology, edge formation rules, resilience mathematics.

---

## Protocol Development

When building new protocols, follow the tetrahedral pattern:
1. **Mathematical Foundation:** What's the graph theory?
2. **Human Reality:** What's the lived experience?
3. **Time Dimension:** How does it stabilize over time?
4. **Scale Invariance:** Does it work at 4 and 4 billion?

The topology determines the protocol. Not the other way around.

**With this protocol:**
- Loss is acknowledged and honored
- K₃ triad is recognized as valid structure
- No pressure to replace immediately
- Replacement happens when triad is ready
- Memorial can remain as honored ancestor
- Topology maintains structural integrity

### Design Principles

1. **Honor the human experience** - Grief, transition, and restructuring take time
2. **Maintain topological integrity** - K₃ is stable, K₄ with memorial is still K₄
3. **No forced replacement** - Readiness is signaled by the triad, not imposed by system
4. **Preserve history** - Memorial vertices can remain as ghost vertices (honored ancestors)
5. **Support restoration** - Temporary losses can be reversed if person returns

### Integration Points

This protocol integrates with:
- **TetrahedronManager:** Handles vertex state transitions (active → memorial → ghost)
- **Hub:** Tracks memorial vertices across all tetrahedrons
- **StatusModule:** Displays triad stability and readiness signals
- **CalendarModule:** Marks memorial dates, grief milestones, stabilization periods

### Future Enhancements

- **Grief Support Protocols:** Specific guidance for each loss type
- **Memorial Ceremonies:** Structured ways to honor the lost vertex
- **Compatibility Matching:** System helps find compatible 4th when triad signals readiness
- **Ghost Vertex Visualization:** UI shows memorial vertices in muted/honored state
- **Restoration Rituals:** Ceremonies for welcoming back temporarily absent vertices

---

**This protocol is the proof that Phenix understands the depth of what it's building.**

**This isn't task management. This is infrastructure for navigating the most difficult transitions humans face.**

**Loss. Grief. Restructuring after catastrophic node failure.**

**The resin is taking form.** 🔥
