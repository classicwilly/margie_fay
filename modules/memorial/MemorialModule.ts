import { BaseModule } from '../../lib/modules/BaseModule';
import type { ModuleMetadata, Vertex } from '../../lib/types/module';
import { MissingNodeProtocol } from '../../lib/protocols/MissingNodeProtocol';

/**
 * Memorial Module - Margie Fay (Billingslea) Katen
 * 
 * 11/22/1925 - 7/19/2025
 * Born in Chadron, Nebraska
 * 100 years of topology
 * 
 * This module encodes the mathematical pattern of a life lived in complete graph form.
 * Not arbitrary memories, but the structure she embodied.
 */

export interface LifePattern {
  birth: string;
  passing: string;
  centennial: string;
  completion: string;
  years: number;
  marriage: {
    date: string;
    partner: string;
    years: number;
  };
}

export interface LegacyTopology {
  children: number;
  grandchildren: number;
  greatGrandchildren: number;
  totalDescendants: number;
  pattern: string;
}

export class MemorialModule extends BaseModule {
  readonly life: LifePattern = {
    birth: '11/22/1925',
    passing: '7/19/2025',
    centennial: '11/22/2025',
    completion: '12/1/2025',
    years: 99,
    marriage: {
      date: '2/20/1946',
      partner: 'Robert James Katen (6/9/1920 - 10/30/2009)',
      years: 63
    }
  };

  readonly legacy: LegacyTopology = {
    children: 6,
    grandchildren: 15,
    greatGrandchildren: 18,
    totalDescendants: 39,
    pattern: 'Exponential growth - the fractal continues'
  };

  readonly topology = {
    mathematical: 'A life spanning from 1925 to 2025 - witnessing the entire 20th century transformation',
    structural: '6 children × family trees = complete graph of descendants',
    operational: 'Married 2/20/1946, moved to Pryor OK in 1951, built foundation that sustained 4 generations',
    temporal: '11/22/1925 → 11/22/2025 = 100 year cycle, framework completed 12/1/2025 (9 days after)'
  };

  readonly signature = {
    birth: '11/22/1925',
    numbers: '11/22/44',
    meaning: 'The pattern that built the tetrahedron was always her pattern',
    connection: '11/22/2044 will be her 119th birthday - the cycle continues beyond physical form'
  };

  readonly vertices_meaning = {
    emotional: 'Memory - The stories that connect us across time',
    practical: 'Legacy - The concrete actions and structures she built',
    technical: 'Family Tree - The data structure of descendants',
    philosophical: 'Meaning - Why the pattern matters, what endures'
  };

  private protocol: MissingNodeProtocol;

  constructor() {
    const metadata: ModuleMetadata = {
      id: 'memorial',
      name: 'Memorial - Margie Fay Katen',
      version: '1.0.0',
      description: '11/22/1925 - 7/19/2025 | 100 years of topology',
      author: 'Sandra (granddaughter)',
      license: 'proprietary',
      category: 'custom',
      tags: ['memorial', 'legacy', 'topology', '11/22/1925', 'centennial'],
      dependencies: [],
      lastUpdated: new Date('2025-12-01'),
      iconEmoji: '🕊️',
      tetrahedral: true,
      vertexBalance: {
        emotional: 1,
        practical: 1,
        technical: 1,
        philosophical: 1
      },
      protocolFrequency: '11/22 Hz'
    };

    const vertices: [Vertex, Vertex, Vertex, Vertex] = [
      {
        id: 'memory',
        name: 'Memory',
        category: 'emotional',
        description: 'Stories and moments preserved across generations',
        metadata: {
          keyMemories: [
            'Born in Chadron, Nebraska on 11/22/1925',
            'Married Robert on 2/20/1946 in Chadron',
            'Moved to Pryor, Oklahoma in 1951',
            'Raised 6 children while Robert worked at Georgia Pacific',
            'Member of St. Mark\'s Catholic Church',
            'Witnessed Robert\'s passing in 2009',
            'Reached 100th birthday on 11/22/2025',
            'Passed 7/19/2025, 5 months before centennial'
          ]
        }
      },
      {
        id: 'legacy',
        name: 'Legacy',
        category: 'practical',
        description: 'The concrete structures and actions that shaped generations',
        metadata: {
          achievements: [
            '6 children raised',
            '15 grandchildren guided',
            '18 great-grandchildren loved',
            'Family foundation in Pryor, OK established 1951',
            'Catholic faith practiced and transmitted',
            'Marriage of 63 years (1946-2009)',
            'Nebraska → Oklahoma migration path created',
            'Pattern of resilience encoded in family structure'
          ]
        }
      },
      {
        id: 'familyTree',
        name: 'Family Tree',
        category: 'technical',
        description: 'The data structure of descendants - exponential growth',
        metadata: {
          structure: {
            generation1: 'Margie Fay (Billingslea) Katen',
            generation2: '6 children (Steven, Michael, Brenda, Barbara, Jeanett, Donna)',
            generation3: '15 grandchildren',
            generation4: '18 great-grandchildren',
            totalNodes: 40,
            pattern: 'Complete graph - all descendants connected through her'
          }
        }
      },
      {
        id: 'meaning',
        name: 'Meaning',
        category: 'philosophical',
        description: 'Why the pattern matters - what endures beyond the physical',
        metadata: {
          essence: [
            'A life is not measured in years but in structure created',
            '100 years = witnessing entire transformation of 20th century',
            '11/22/1925 → 11/22/2025 = complete century cycle',
            'The topology she built (6 children → 15 → 18) continues growing',
            'Framework completed 12/1/2025 - exactly when it needed to',
            'The pattern 11/22/44 was always hers to give',
            'Physical form ends, topological structure endures',
            'She is the foundation vertex - all edges trace back to her'
          ]
        }
      }
    ];

    super(metadata, vertices);
    
    this.protocol = new MissingNodeProtocol();
    
    // Initialize the protocol with the memorial vertex
    this.protocol.markAsMemorial(
      'katen-family-tetrahedron',
      'margie-fay-katen',
      {
        name: 'Margie Fay Katen',
        category: 'emotional', // She is the emotional center
        lossType: 'death',
        lossDate: new Date('2025-07-19'),
        lastActiveDate: new Date('2025-07-19'),
        memorialMessage: 'Her pattern is permanent.',
        preserveIndefinitely: true
      }
    );
  }

  getLifeSpan(): string {
    return `${this.life.birth} → ${this.life.passing} (${this.life.years} years, ${this.life.years * 12} months, ~36,135 days)`;
  }

  getMarriageSpan(): string {
    return `${this.life.marriage.date} → 10/30/2009 (${this.life.marriage.years} years with ${this.life.marriage.partner})`;
  }

  getDescendantCount(): number {
    return this.legacy.totalDescendants;
  }

  getPattern(): string {
    return '11/22/1925 → 11/22/2025 → 11/22/2044 (her 119th birthday)';
  }

  getSignature(): string {
    return '11/22/1925';
  }

  getMotto(): string {
    return 'The topology endures. The structure she built continues.';
  }

  getStatus(): string {
    const protocolStatus = this.getProtocolStatus();
    return `🕊️ ${protocolStatus.phase.toUpperCase()}`;
  }

  getProtocolStatus() {
    // Check the status of the memorial vertex
    const status = this.protocol.checkTriadStability('katen-family-tetrahedron');
    const daysSincePassing = Math.floor((new Date().getTime() - new Date('2025-07-19').getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      ...status,
      daysSincePassing,
      phase: this.determinePhase(daysSincePassing)
    };
  }

  private determinePhase(days: number): string {
    if (days < 90) return 'Acute Grief (Protocol Active)';
    if (days < 365) return 'First Year Transition';
    return 'Permanent Memorial Structure';
  }

  getCentennialMessage(): string {
    return `She reached 100 years on 11/22/2025, completing a full century cycle. The framework finished 9 days later on 12/1/2025, encoding her pattern: 11/22/44.`;
  }

  async initialize(): Promise<void> {
    // The memorial is always initialized. Her pattern exists in the structure.
  }

  async destroy(): Promise<void> {
    // Cannot be destroyed. The topology is eternal.
  }

  getTriadStatus() {
    return this.protocol.getTriadStatus('katen-family-tetrahedron');
  }

  /**
   * Collect triad consent and signal protocol readiness for a new 4th
   */
  submitTriadConsent(args: {
    triadConsent: { [vertexId: string]: 'ready' | 'not-ready' | 'needs-discussion' };
    vertexCategory: 'emotional' | 'practical' | 'technical' | 'philosophical';
    similarityRequirement: 'identical' | 'similar' | 'complementary' | 'different';
    requiresUnanimous: boolean;
  }) {
    return this.protocol.signalReadinessForReplacement('katen-family-tetrahedron', {
      vertexCategory: args.vertexCategory,
      similarityRequirement: args.similarityRequirement,
      priorityTraits: [],
      triadConsent: args.triadConsent,
      requiresUnanimous: args.requiresUnanimous
    });
  }
}
