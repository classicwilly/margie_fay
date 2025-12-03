/**
 * 🏘️ Community Module - Neighborhood Mesh Network
 * 
 * VPI PROTOCOL: Local Coordination & Resource Sharing
 * Frequency: 528 Hz (Transformation, Miracles, DNA Repair)
 * 
 * Four Vertices (Community Tetrahedron):
 * ┌───────────────────────────────────────────────────────────┐
 * │ 1. EVENTS (Emotional) - Shared experiences & connection  │
 * │    - Community calendar integration                       │
 * │    - Event creation and RSVP                             │
 * │    - Recurring gatherings (block parties, meals)         │
 * │    - Connection-building activities                      │
 * │                                                           │
 * │ 2. RESOURCES (Practical) - Mutual aid & sharing         │
 * │    - Tool library (who has what)                        │
 * │    - Skill exchange (I can help with X)                 │
 * │    - Emergency contacts & support offers                │
 * │    - Resource requests & offers                         │
 * │                                                           │
 * │ 3. COORDINATION (Technical) - Communication systems     │
 * │    - Contact directory (opt-in)                         │
 * │    - Group messaging channels                           │
 * │    - Announcement broadcast                             │
 * │    - Privacy controls & boundaries                      │
 * │                                                           │
 * │ 4. RESILIENCE (Philosophical) - Long-term stability     │
 * │    - Identify the 4 anchor families                     │
 * │    - Build redundancy (no single points of failure)     │
 * │    - Document what works                                │
 * │    - Scale pattern to other neighborhoods               │
 * └───────────────────────────────────────────────────────────┘
 * 
 * PROTOCOL PHILOSOPHY:
 * Communities fail when they're hub-and-spoke (one coordinator burns out).
 * They thrive when they're mesh networks (4+ families supporting each other).
 * This module helps neighborhoods transition from "nice to know you" to
 * "we've got each other's backs."
 * 
 * VPI ENRICHMENT:
 * - Mesh Topology: No single coordinator required
 * - Privacy First: Opt-in visibility, configurable boundaries
 * - Low Friction: Easy RSVP, one-click offers, simple requests
 * - Fractal Design: Pattern works for 4 families or 40 neighborhoods
 * - Event Momentum: Regular gatherings build social capital
 */

import { BaseModule } from '@/lib/modules/BaseModule';
import type { Module, ModuleMetadata, Vertex, VertexCategory } from '@/lib/types/module';

// ═══════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  hostFamily: string;
  attendees: string[];
  type: 'meal' | 'playdate' | 'work-party' | 'celebration' | 'meeting' | 'other';
  recurring?: 'weekly' | 'biweekly' | 'monthly';
  status: 'planned' | 'confirmed' | 'completed' | 'cancelled';
}

export interface Resource {
  id: string;
  type: 'tool' | 'skill' | 'space' | 'transportation' | 'childcare' | 'other';
  name: string;
  description: string;
  owner: string;
  available: boolean;
  borrowable: boolean;
  conditions?: string; // "Return within 24h", "Ask first", etc.
}

export interface SupportOffer {
  id: string;
  offeredBy: string;
  category: 'emergency-contact' | 'meal-train' | 'rides' | 'childcare' | 'yard-work' | 'other';
  description: string;
  availability: string; // "Weekday mornings", "Anytime", etc.
  active: boolean;
}

export interface CommunityMember {
  id: string;
  familyName: string;
  address?: string;
  contact?: {
    phone?: string;
    email?: string;
    preferredMethod: 'phone' | 'email' | 'text' | 'in-person';
  };
  visibility: 'public' | 'friends' | 'private';
  isAnchor: boolean; // One of the 4 anchor families
}

export interface MeshMetrics {
  totalFamilies: number;
  anchorFamilies: number;
  activeConnections: number;
  eventsThisMonth: number;
  resourcesShared: number;
  meshDensity: number; // 0-1, how connected are families
  resilience: number; // 0-1, can network survive losing any one family
}

// ═══════════════════════════════════════════════════════════════
// COMMUNITY MODULE CLASS
// ═══════════════════════════════════════════════════════════════

export class CommunityModule extends BaseModule {
  private events: CommunityEvent[] = [];
  private resources: Resource[] = [];
  private offers: SupportOffer[] = [];
  private members: CommunityMember[] = [];

  constructor() {
    const metadata: ModuleMetadata = {
      id: 'community',
      name: '🏘️ Community - Neighborhood Mesh',
      description: 'Coordinate events, share resources, build local resilience',
      author: 'Tetrahedron Protocol',
      version: '2.0.0',  // VPI Enhanced
      license: 'CC-BY-4.0',
      category: 'coordination',
      tags: [
        'community',
        'neighborhood',
        'mesh-network',
        'mutual-aid',
        'events',
        'resource-sharing',
        'coordination',
        'resilience',
        'visual-protocol'
      ],
      dependencies: [],
      lastUpdated: new Date(),
      
      // VPI: Module Visual Identity
      iconEmoji: '🏘️',
      protocolFrequency: '528Hz',
      tetrahedral: true,
      
      // VPI: Vertex Balance (4 vertices, equal weight)
      vertexBalance: {
        emotional: 1,    // Events & connection
        practical: 1,    // Resources & aid
        technical: 1,    // Coordination systems
        philosophical: 1 // Resilience architecture
      }
    };

    const vertices: [Vertex, Vertex, Vertex, Vertex] = [
      {
        id: 'community-events',
        name: 'Events & Gatherings',
        category: 'emotional',
        description: 'Shared experiences that build connection and social capital',
        data: {},
        metadata: {
          purpose: 'Regular interaction builds trust and reciprocity',
          examples: [
            'Monthly block party',
            'Weekly family dinner rotation',
            'Quarterly work parties',
            'Holiday celebrations'
          ],
          frequency: 'At least monthly for stability',
          vpiColor: '#a855f7' // purple
        }
      },
      {
        id: 'community-resources',
        name: 'Resources & Mutual Aid',
        category: 'practical',
        description: 'Tool sharing, skill exchange, and support offers',
        data: {},
        metadata: {
          purpose: 'Make it easy to help and be helped',
          examples: [
            'Tool library (ladders, power tools)',
            'Skill exchange (plumbing, coding, gardening)',
            'Emergency contacts (I can help with X)',
            'Material resources (have/need board)'
          ],
          principle: 'Reduce friction for mutual aid',
          vpiColor: '#10b981' // green
        }
      },
      {
        id: 'community-coordination',
        name: 'Communication & Coordination',
        category: 'technical',
        description: 'Systems that keep everyone informed without overwhelming',
        data: {},
        metadata: {
          purpose: 'Information flows without single coordinator',
          features: [
            'Shared calendar (opt-in)',
            'Group messaging (with quiet hours)',
            'Directory (privacy-controlled)',
            'Announcement system'
          ],
          principle: 'Mesh communication, not hub-and-spoke',
          vpiColor: '#3b82f6' // blue
        }
      },
      {
        id: 'community-resilience',
        name: 'Mesh Resilience',
        category: 'philosophical',
        description: 'Building stability through distributed support',
        data: {},
        metadata: {
          coreIdea: 'No single point of failure',
          strategy: 'Identify 4 anchor families who commit to stability',
          scaling: 'Each anchor can support 3-4 other families = 16 people stable mesh',
          fractal: '4 neighborhoods × 4 anchors = 16 anchors = 64+ families',
          vpiColor: '#f59e0b' // amber
        }
      }
    ];

    super(metadata, vertices);
  }

  async initialize(): Promise<void> {
    // Load community data if persisted
  }

  async destroy(): Promise<void> {
    this.events = [];
    this.resources = [];
    this.offers = [];
    this.members = [];
  }

  async createEvent(event: Omit<CommunityEvent, 'id'>): Promise<CommunityEvent> {
    const newEvent: CommunityEvent = {
      id: `evt-${Date.now()}`,
      ...event
    };
    this.events.push(newEvent);
    return newEvent;
  }

  async rsvpToEvent(eventId: string, familyName: string): Promise<void> {
    const event = this.events.find(e => e.id === eventId);
    if (event && !event.attendees.includes(familyName)) {
      event.attendees.push(familyName);
    }
  }

  async getUpcomingEvents(): Promise<CommunityEvent[]> {
    return this.events.filter(e => 
      e.date > new Date() && e.status !== 'cancelled'
    ).sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  // ═══════════════════════════════════════════════════════════════
  // RESOURCE MANAGEMENT
  // ═══════════════════════════════════════════════════════════════

  async addResource(resource: Omit<Resource, 'id'>): Promise<Resource> {
    const newResource: Resource = {
      id: `res-${Date.now()}`,
      ...resource
    };
    this.resources.push(newResource);
    return newResource;
  }

  async searchResources(query: string): Promise<Resource[]> {
    return this.resources.filter(r => 
      r.available && (
        r.name.toLowerCase().includes(query.toLowerCase()) ||
        r.description.toLowerCase().includes(query.toLowerCase())
      )
    );
  }

  async offerSupport(offer: Omit<SupportOffer, 'id'>): Promise<SupportOffer> {
    const newOffer: SupportOffer = {
      id: `off-${Date.now()}`,
      ...offer
    };
    this.offers.push(newOffer);
    return newOffer;
  }

  // ═══════════════════════════════════════════════════════════════
  // MEMBER MANAGEMENT
  // ═══════════════════════════════════════════════════════════════

  async addMember(member: Omit<CommunityMember, 'id'>): Promise<CommunityMember> {
    const newMember: CommunityMember = {
      id: `mem-${Date.now()}`,
      ...member
    };
    this.members.push(newMember);
    return newMember;
  }

  async getDirectory(viewerPrivacy: 'public' | 'friends' | 'private'): Promise<CommunityMember[]> {
    // Return members based on privacy settings
    return this.members.filter(m => {
      if (viewerPrivacy === 'private') return m.visibility === 'public';
      if (viewerPrivacy === 'friends') return ['public', 'friends'].includes(m.visibility);
      return true; // 'public' viewer sees all
    });
  }

  async setAnchorFamily(familyId: string, isAnchor: boolean): Promise<void> {
    const member = this.members.find(m => m.id === familyId);
    if (member) {
      member.isAnchor = isAnchor;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // MESH METRICS
  // ═══════════════════════════════════════════════════════════════

  async getMeshMetrics(): Promise<MeshMetrics> {
    const totalFamilies = this.members.length;
    const anchorFamilies = this.members.filter(m => m.isAnchor).length;
    
    // Count active connections (families who've attended events or shared resources)
    const activeMembers = new Set<string>();
    this.events.forEach(e => e.attendees.forEach(a => activeMembers.add(a)));
    this.resources.forEach(r => activeMembers.add(r.owner));
    
    const now = new Date();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const eventsThisMonth = this.events.filter(e => e.date > monthAgo).length;
    
    // Mesh density: how connected is the network?
    // High density = most families know/help each other
    const meshDensity = totalFamilies > 0 ? activeMembers.size / totalFamilies : 0;
    
    // Resilience: can we lose any one family and still function?
    // Target: 4 anchor families means we can lose 1 and still have 3
    const resilience = Math.min(anchorFamilies / 4, 1);
    
    return {
      totalFamilies,
      anchorFamilies,
      activeConnections: activeMembers.size,
      eventsThisMonth,
      resourcesShared: this.resources.filter(r => r.borrowable).length,
      meshDensity,
      resilience
    };
  }

  // ═══════════════════════════════════════════════════════════════
  // VPI: DEMO DATA
  // ═══════════════════════════════════════════════════════════════

  async loadDemoData(): Promise<void> {
    // Add demo anchor families
    await this.addMember({
      familyName: 'The Johnsons',
      visibility: 'public',
      isAnchor: true
    });

    await this.addMember({
      familyName: 'The Garcias',
      visibility: 'public',
      isAnchor: true
    });

    await this.addMember({
      familyName: 'The Chens',
      visibility: 'public',
      isAnchor: true
    });

    await this.addMember({
      familyName: 'The Patels',
      visibility: 'public',
      isAnchor: true
    });

    // Add demo event
    await this.createEvent({
      title: 'Monthly Block Party',
      description: 'Potluck dinner, kids play, adults chat',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
      location: 'Park at end of street',
      hostFamily: 'The Johnsons',
      attendees: ['The Johnsons', 'The Garcias'],
      type: 'celebration',
      recurring: 'monthly',
      status: 'confirmed'
    });

    // Add demo resources
    await this.addResource({
      type: 'tool',
      name: '40-foot Extension Ladder',
      description: 'Perfect for gutter cleaning, tree trimming',
      owner: 'The Garcias',
      available: true,
      borrowable: true,
      conditions: 'Return same day, text before borrowing'
    });

    await this.addResource({
      type: 'skill',
      name: 'Plumbing Repairs',
      description: 'Licensed plumber, happy to help with small repairs',
      owner: 'The Chens',
      available: true,
      borrowable: false,
      conditions: 'Just ask!'
    });
  }
}
