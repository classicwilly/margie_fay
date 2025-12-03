/**
 * 📅 Calendar Module - Tetrahedral Time Orchestration
 * 
 * VPI PROTOCOL: Time & Relationship Coordination Engine
 * Frequency: 741 Hz (Awakening Intuition, Solutions, Problem-Solving)
 * 
 * Four Vertices (Tetrahedral Structure):
 * ┌─────────────────────────────────────────────────────────┐
 * │ 1. SCHEDULE (Technical) - Calendar views, time blocks   │
 * │    - Day/Week/Month/Year views with visual density maps │
 * │    - Conflict detection with visual heat indicators     │
 * │    - Time block visualization with color psychology     │
 * │    - Capacity planning with burnout warnings            │
 * │                                                          │
 * │ 2. EVENTS (Practical) - Create/manage events, invites   │
 * │    - Event creation with relationship context tracking  │
 * │    - Multi-party coordination with role definitions     │
 * │    - Location intelligence with travel time prediction  │
 * │    - Event type taxonomy with emotional weight scores   │
 * │                                                          │
 * │ 3. SYNC (Technical) - Cross-platform synchronization    │
 * │    - Google Calendar, Outlook, iCal, Apple Calendar     │
 * │    - Bidirectional sync with conflict resolution UI     │
 * │    - Privacy-aware sharing with granular permissions    │
 * │    - Real-time updates with WebSocket coordination      │
 * │                                                          │
 * │ 4. REMINDERS (Emotional) - Notifications, alerts        │
 * │    - Context-aware reminders with emotional intelligence│
 * │    - Recurring patterns with relationship rhythm tracking│
 * │    - Gentle nudges vs urgent alerts (tone calibration)  │
 * │    - Preparation reminders (mental load distribution)   │
 * └─────────────────────────────────────────────────────────┘
 * 
 * PROTOCOL PHILOSOPHY:
 * Time is relationship made visible. Every event exists within a web of
 * human connections, emotional contexts, and practical constraints. This
 * module doesn't just track "when" - it tracks "with whom," "for what,"
 * and "with what emotional energy."
 * 
 * VPI ENRICHMENT:
 * - Visual Protocol: Color-coded by relationship type & emotional weight
 * - Rhythm Detection: Identifies patterns in family coordination
 * - Conflict Visualization: Shows scheduling tensions before they explode
 * - Energy Mapping: Tracks cognitive/emotional load distribution
 * - Relationship Graph: Every event connects to people, not just times
 */

import { BaseModule } from '@/lib/modules/BaseModule';
import type { ModuleMetadata, Vertex, HubAuth } from '@/lib/types/module';

/**
 * 🎨 VPI: Event Visual Markers (Color Psychology)
 */
export type EventVisualType = 
  | 'coordination'    // 🔵 Blue - Co-parent coordination (calm, structured)
  | 'transition'      // 🟣 Purple - Kid transition/handoff (transformation)
  | 'milestone'       // 🟡 Gold - Kid milestone/celebration (joy, achievement)
  | 'therapy'         // 🟢 Green - Therapy/support (healing, growth)
  | 'conflict'        // 🔴 Red - High-stakes/difficult (alert, attention)
  | 'routine'         // ⚪ Gray - Regular routine (neutral, predictable)
  | 'personal'        // 💙 Light Blue - Self-care (restorative)
  | 'emergency';      // 🟠 Orange - Crisis/urgent (immediate action)

/**
 * 🧠 VPI: Emotional Intelligence Layer
 */
export interface EmotionalContext {
  anticipatedStress: 'low' | 'medium' | 'high' | 'critical';
  preparationNeeded: boolean;
  supportRecommended: boolean;
  deescalationProtocol?: string;  // Link to de-escalation docs
  recoveryTimeAfter: number;      // Minutes needed to decompress
  relationshipTemperature: 'cold' | 'neutral' | 'warm' | 'hot';
}

/**
 * 🤝 VPI: Relationship Tracking
 */
export interface RelationshipContext {
  primaryPeople: string[];        // Who are the main participants?
  relationshipType: 'coparent' | 'child' | 'therapist' | 'family' | 'friend' | 'professional';
  communicationHistory: number;   // How many previous interactions?
  conflictRisk: 'minimal' | 'low' | 'moderate' | 'high';
  boundariesSet: boolean;         // Are clear boundaries established?
  protocolRequired?: string;      // Link to communication protocol
}

/**
 * 📍 VPI: Location Intelligence
 */
export interface LocationContext {
  address?: string;
  travelTimeMinutes?: number;
  transportMethod?: 'drive' | 'walk' | 'transit' | 'bike' | 'virtual';
  parkingRequired?: boolean;
  accessibilityNotes?: string;
  weatherImpact?: boolean;        // Does weather affect this event?
  safetyRating?: 'safe' | 'caution' | 'unsafe';
}

/**
 * 📅 VPI-Enhanced Calendar Event
 * Extended with Visual Protocol Interface metadata
 */
export interface CalendarEvent {
  // Core Data
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  
  // Basic Metadata
  location?: string;
  attendees?: string[];
  reminders?: number[];           // Minutes before event
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: Date;
    exceptions?: Date[];          // Skip these dates
  };
  
  // VPI: Vertex & Protocol Binding
  vertexId?: string;              // Associated vertex (e.g., "calendar-events")
  protocolId?: string;            // Link to protocol doc (e.g., "custody-handoff")
  
  // VPI: Visual & Emotional Intelligence
  visualType: EventVisualType;
  emotionalContext?: EmotionalContext;
  relationshipContext?: RelationshipContext;
  locationContext?: LocationContext;
  
  // VPI: Coordination & Conflict
  conflictsWith?: string[];       // Event IDs that overlap
  bufferTimeBefore?: number;      // Minutes of prep time needed
  bufferTimeAfter?: number;       // Minutes of recovery time needed
  
  // VPI: Notes & Learning
  preparationNotes?: string[];    // Checklist for this event
  postEventNotes?: string[];      // What happened? What to remember?
  lessonsLearned?: string[];      // Wisdom gathered from past instances
  
  // VPI: Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;              // User ID
  lastModifiedBy: string;
  version: number;                // For conflict resolution
}

/**
 * 🔮 Calendar Module Class - Tetrahedral Time Orchestration Engine
 * 
 * VPI IMPLEMENTATION: This module transforms time management into relationship
 * coordination. Every scheduling decision is viewed through the lens of human
 * connection, emotional capacity, and practical wisdom.
 */
export class CalendarModule extends BaseModule {
  private events: CalendarEvent[] = [];
  
  // VPI: Visual Density Maps
  private densityCache: Map<string, number> = new Map();  // Date -> event density
  
  // VPI: Conflict Resolution History
  private conflictLog: Array<{
    timestamp: Date;
    eventIds: string[];
    resolution: 'manual' | 'auto' | 'cancelled';
    outcome: string;
  }> = [];
  
  // VPI: Relationship Rhythm Patterns
  private rhythmPatterns: Map<string, {
    frequency: number;
    lastOccurrence: Date;
    averageStress: number;
    successRate: number;
  }> = new Map();

  constructor() {
    const metadata: ModuleMetadata = {
      id: 'calendar',
      name: '📅 Calendar - Time Orchestration',
      description: 'Visual protocol for time, relationship, and energy coordination',
      author: 'Tetrahedron Protocol',
      version: '2.0.0',  // VPI Enhanced
      license: 'CC-BY-4.0',
      category: 'productivity',
      tags: [
        'calendar', 
        'scheduling', 
        'coordination', 
        'relationship-tracking',
        'emotional-intelligence',
        'conflict-detection',
        'rhythm-analysis',
        'visual-protocol'
      ],
      dependencies: [],
      lastUpdated: new Date(),
      
      // VPI: Module Visual Identity
      primaryColor: '#3B82F6',      // Blue - Trust, Structure
      secondaryColor: '#8B5CF6',    // Purple - Transformation
      accentColor: '#F59E0B',       // Amber - Energy, Attention
      iconEmoji: '📅',
      
      // VPI: Protocol Metadata
      protocolFrequency: '741Hz',   // Awakening intuition, solutions
      tetrahedral: true,
      vertexBalance: {
        technical: 2,               // Schedule + Sync
        practical: 1,               // Events
        emotional: 1                // Reminders
      }
    };

    const vertices: [Vertex, Vertex, Vertex, Vertex] = [
      {
        id: 'calendar-schedule',
        name: '🗓️ Schedule',
        category: 'technical',
        description: 'Visual calendar views with density mapping, conflict detection, and capacity planning',
        
        // VPI: Vertex Metadata
        metadata: {
          viewTypes: ['day', 'week', 'month', 'year', 'timeline'],
          visualizations: ['density-heatmap', 'conflict-overlay', 'energy-graph'],
          capabilities: [
            'multi-view rendering',
            'real-time conflict detection',
            'capacity warning system',
            'visual density mapping',
            'drag-drop rescheduling'
          ],
          uiElements: [
            'calendar-grid',
            'time-blocks',
            'mini-calendar',
            'density-indicator',
            'conflict-badge'
          ]
        }
      },
      {
        id: 'calendar-events',
        name: '📌 Events',
        category: 'practical',
        description: 'Create, manage, and coordinate events with relationship context and emotional intelligence',
        
        // VPI: Vertex Metadata
        metadata: {
          eventTypes: [
            'coordination',
            'transition',
            'milestone',
            'therapy',
            'conflict',
            'routine',
            'personal',
            'emergency'
          ],
          features: [
            'rich event creation',
            'relationship tracking',
            'emotional context',
            'location intelligence',
            'preparation checklists',
            'post-event learning'
          ],
          workflows: [
            'event-creation',
            'event-editing',
            'event-duplication',
            'bulk-operations',
            'template-library'
          ]
        }
      },
      {
        id: 'calendar-sync',
        name: '🔄 Sync',
        category: 'technical',
        description: 'Cross-platform synchronization with conflict resolution and privacy controls',
        
        // VPI: Vertex Metadata
        metadata: {
          providers: [
            'google-calendar',
            'outlook-calendar',
            'apple-ical',
            'caldav',
            'exchange'
          ],
          syncModes: [
            'bidirectional',
            'import-only',
            'export-only',
            'selective'
          ],
          features: [
            'real-time sync',
            'conflict resolution',
            'privacy filtering',
            'multi-calendar',
            'timezone handling',
            'offline support'
          ]
        }
      },
      {
        id: 'calendar-reminders',
        name: '🔔 Reminders',
        category: 'emotional',
        description: 'Context-aware notifications with emotional intelligence and preparation support',
        
        // VPI: Vertex Metadata
        metadata: {
          reminderTypes: [
            'preparation',      // Get ready for upcoming event
            'departure',        // Time to leave
            'transition',       // Kids transitioning
            'follow-up',        // After-event check-in
            'recurring-pattern' // Rhythm-based
          ],
          toneOptions: [
            'gentle-nudge',
            'standard-alert',
            'urgent-attention',
            'supportive-prep',
            'celebration'
          ],
          deliveryMethods: [
            'push-notification',
            'email',
            'sms',
            'in-app',
            'calendar-popup'
          ],
          intelligence: [
            'context-aware timing',
            'stress-level adaptation',
            'relationship-aware',
            'energy-level consideration',
            'history-based optimization'
          ]
        }
      }
    ];

    super(metadata, vertices);
  }

  async initialize(): Promise<void> {
    // Load events from storage
    this.events = this.loadEvents();
    
    // VPI: Initialize rhythm pattern detection
    this.analyzeRhythmPatterns();
    
    // VPI: Build density cache
    this.buildDensityCache();
    
    // VPI: Log initialization
    console.log('📅 Calendar Module initialized with VPI enhancements');
    console.log(`   Events loaded: ${this.events.length}`);
    console.log(`   Rhythm patterns detected: ${this.rhythmPatterns.size}`);
    console.log(`   Density map cached: ${this.densityCache.size} days`);
  }

  async destroy(): Promise<void> {
    // Save events before destruction
    this.saveEvents();
    
    // VPI: Save analytics data
    this.saveRhythmPatterns();
    this.saveConflictLog();
    
    // Clear memory
    this.events = [];
    this.densityCache.clear();
    this.rhythmPatterns.clear();
    this.conflictLog = [];
    
    console.log('📅 Calendar Module destroyed gracefully');
  }

  protected async onConnect(hubAuth: HubAuth): Promise<void> {
    // Sync with hub when connecting
    await this.syncWithHub();
    
    // VPI: Share rhythm insights with hub
    await this.shareRhythmInsights();
  }

  // ============================================================================
  // EVENT MANAGEMENT - VPI Enhanced
  // ============================================================================

  /**
   * 🎨 Create a new event with full VPI metadata
   * 
   * This method doesn't just add an event to a calendar - it weaves it into
   * the relational fabric of your life. Every event is an opportunity to
   * build awareness, set boundaries, and coordinate with compassion.
   */
  createEvent(event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt' | 'version'>): CalendarEvent {
    const now = new Date();
    
    const newEvent: CalendarEvent = {
      id: this.generateEventId(),
      ...event,
      
      // VPI: Auto-detect conflicts
      conflictsWith: this.detectConflicts(event.startTime, event.endTime),
      
      // VPI: Metadata
      createdAt: now,
      updatedAt: now,
      createdBy: event.createdBy || 'default-user',
      lastModifiedBy: event.lastModifiedBy || 'default-user',
      version: 1
    };

    // VPI: Validate and warn
    this.validateEvent(newEvent);
    
    // Store event
    this.events.push(newEvent);
    this.saveEvents();
    
    // VPI: Update caches
    this.updateDensityCache(newEvent.startTime);
    this.updateRhythmPatterns(newEvent);
    
    // Emit event
    this.triggerEvent('event:created', {
      event: newEvent,
      conflicts: newEvent.conflictsWith || [],
      recommendedActions: this.getRecommendations(newEvent)
    });

    return newEvent;
  }

  /**
   * Update an event
   */
  updateEvent(eventId: string, updates: Partial<CalendarEvent>): CalendarEvent | null {
    const event = this.events.find(e => e.id === eventId);
    if (!event) return null;

    Object.assign(event, updates);
    this.saveEvents();
    this.triggerEvent('event:updated', event);

    return event;
  }

  /**
   * Delete an event
   */
  deleteEvent(eventId: string): boolean {
    const index = this.events.findIndex(e => e.id === eventId);
    if (index === -1) return false;

    const event = this.events[index];
    this.events.splice(index, 1);
    this.saveEvents();
    this.triggerEvent('event:deleted', event);

    return true;
  }

  /**
   * Get events in date range
   */
  getEvents(startDate: Date, endDate: Date): CalendarEvent[] {
    return this.events.filter(
      event => event.startTime >= startDate && event.startTime <= endDate
    ).sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  }

  /**
   * Get events for specific vertex
   */
  getEventsByVertex(vertexId: string): CalendarEvent[] {
    return this.events.filter(e => e.vertexId === vertexId);
  }

  /**
   * Get upcoming events
   */
  getUpcomingEvents(count: number = 5): CalendarEvent[] {
    const now = new Date();
    return this.events
      .filter(e => e.startTime >= now)
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
      .slice(0, count);
  }

  /**
   * Check for event conflicts
   */
  hasConflict(startTime: Date, endTime: Date, excludeEventId?: string): boolean {
    return this.events.some(event => {
      if (excludeEventId && event.id === excludeEventId) return false;
      
      return (
        (startTime >= event.startTime && startTime < event.endTime) ||
        (endTime > event.startTime && endTime <= event.endTime) ||
        (startTime <= event.startTime && endTime >= event.endTime)
      );
    });
  }

  /**
   * Sync with external calendar (Google, Outlook, etc.)
   */
  async syncExternal(provider: 'google' | 'outlook' | 'ical'): Promise<void> {
    // In production, this would integrate with external APIs
    // For now, it's a stub
    console.log(`Syncing with ${provider}...`);
  }

  /**
   * Sync with hub
   */
  private async syncWithHub(): Promise<void> {
    if (!this.isConnected()) return;

    // Share events with hub
    await this.docking.shareData('calendar_events', this.events);
  }

  /**
   * Generate unique event ID
   */
  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  /**
   * Save events to storage
   */
  private saveEvents(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem('calendar_events', JSON.stringify(this.events));
  }

  /**
   * Load events from storage
   */
  private loadEvents(): CalendarEvent[] {
    if (typeof window === 'undefined') return [];
    
    const saved = localStorage.getItem('calendar_events');
    if (!saved) return [];

    try {
      const parsed = JSON.parse(saved);
      // Convert date strings back to Date objects
      return (parsed as unknown[]).map(event => {
        const ev = event as unknown as CalendarEvent;
        return ({
          ...ev,
          startTime: new Date((ev as CalendarEvent).startTime as unknown as string | number),
          endTime: new Date((ev as CalendarEvent).endTime as unknown as string | number),
          createdAt: new Date((ev as CalendarEvent).createdAt as unknown as string | number || Date.now()),
          updatedAt: new Date((ev as CalendarEvent).updatedAt as unknown as string | number || Date.now())
        }) as CalendarEvent;
      });
    } catch {
      return [];
    }
  }

  // ============================================================================
  // VPI: CONFLICT DETECTION & RESOLUTION
  // ============================================================================

  /**
   * 🔍 Detect conflicts with existing events
   */
  private detectConflicts(startTime: Date, endTime: Date, excludeEventId?: string): string[] {
    const conflicts: string[] = [];
    
    this.events.forEach(event => {
      if (excludeEventId && event.id === excludeEventId) return;
      
      const hasOverlap = (
        (startTime >= event.startTime && startTime < event.endTime) ||
        (endTime > event.startTime && endTime <= event.endTime) ||
        (startTime <= event.startTime && endTime >= event.endTime)
      );
      
      if (hasOverlap) {
        conflicts.push(event.id);
      }
    });
    
    return conflicts;
  }

  /**
   * ✅ Validate event before saving
   */
  private validateEvent(event: CalendarEvent): void {
    const warnings: string[] = [];
    
    // VPI: Check for scheduling stress
    if (event.conflictsWith && event.conflictsWith.length > 0) {
      warnings.push(`⚠️ Conflict detected with ${event.conflictsWith.length} existing event(s)`);
    }
    
    // VPI: Check for capacity overload
    const dayDensity = this.getDayDensity(event.startTime);
    if (dayDensity > 5) {
      warnings.push(`⚠️ High schedule density (${dayDensity} events) - consider spacing`);
    }
    
    // VPI: Check for insufficient buffer time
    if (event.emotionalContext?.anticipatedStress === 'high' && !event.bufferTimeBefore) {
      warnings.push(`💡 High-stress event without preparation buffer - consider adding prep time`);
    }
    
    // VPI: Check for relationship pattern risks
    if (event.relationshipContext?.conflictRisk === 'high' && !event.emotionalContext?.deescalationProtocol) {
      warnings.push(`🚨 High conflict risk without de-escalation protocol - link a protocol doc`);
    }
    
    if (warnings.length > 0) {
      console.warn('📅 Event validation warnings:', warnings);
    }
  }

  /**
   * 💡 Get AI-powered recommendations for an event
   */
  private getRecommendations(event: CalendarEvent): string[] {
    const recommendations: string[] = [];
    
    // VPI: Recommend buffer time
    if (event.visualType === 'transition' && !event.bufferTimeBefore) {
      recommendations.push('Add 15-30 min prep time before kid transitions');
    }
    
    if (event.visualType === 'coordination' && !event.bufferTimeAfter) {
      recommendations.push('Add recovery time after co-parent coordination');
    }
    
    // VPI: Recommend protocols
    if (event.relationshipContext?.conflictRisk === 'high' && !event.protocolId) {
      recommendations.push('Link a communication protocol for high-risk interactions');
    }
    
    // VPI: Recommend reminders
    if (event.visualType === 'therapy' && (!event.reminders || event.reminders.length === 0)) {
      recommendations.push('Add reminder 24h before and 1h before therapy sessions');
    }
    
    // VPI: Recommend preparation
    if (event.emotionalContext?.preparationNeeded && !event.preparationNotes) {
      recommendations.push('Create preparation checklist for this event type');
    }
    
    return recommendations;
  }

  // ============================================================================
  // VPI: DENSITY MAPPING & CAPACITY MANAGEMENT
  // ============================================================================

  /**
   * 📊 Build density cache for visual heatmaps
   */
  private buildDensityCache(): void {
    this.densityCache.clear();
    
    this.events.forEach(event => {
      const dateKey = this.getDateKey(event.startTime);
      const current = this.densityCache.get(dateKey) || 0;
      this.densityCache.set(dateKey, current + 1);
    });
  }

  /**
   * 📈 Update density cache when event added/removed
   */
  private updateDensityCache(date: Date): void {
    const dateKey = this.getDateKey(date);
    const count = this.events.filter(e => 
      this.getDateKey(e.startTime) === dateKey
    ).length;
    this.densityCache.set(dateKey, count);
  }

  /**
   * 📅 Get event density for a specific day
   */
  private getDayDensity(date: Date): number {
    const dateKey = this.getDateKey(date);
    return this.densityCache.get(dateKey) || 0;
  }

  /**
   * 🔑 Get date key for caching (YYYY-MM-DD)
   */
  private getDateKey(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  // ============================================================================
  // VPI: RHYTHM PATTERN ANALYSIS
  // ============================================================================

  /**
   * 🎵 Analyze rhythm patterns in family coordination
   */
  private analyzeRhythmPatterns(): void {
    this.rhythmPatterns.clear();
    
    // Group events by type
    const eventsByType = new Map<EventVisualType, CalendarEvent[]>();
    this.events.forEach(event => {
      const existing = eventsByType.get(event.visualType) || [];
      existing.push(event);
      eventsByType.set(event.visualType, existing);
    });
    
    // Analyze each type
    eventsByType.forEach((events, type) => {
      if (events.length < 2) return;
      
      // Calculate frequency (events per month)
      const sortedEvents = [...events].sort((a, b) => 
        a.startTime.getTime() - b.startTime.getTime()
      );
      
      const firstEvent = sortedEvents[0];
      const lastEvent = sortedEvents[sortedEvents.length - 1];
      const daySpan = (lastEvent.startTime.getTime() - firstEvent.startTime.getTime()) / (1000 * 60 * 60 * 24);
      const frequency = events.length / (daySpan / 30); // Events per month
      
      // Calculate average stress
      const stressScores = events
        .filter(e => e.emotionalContext?.anticipatedStress)
        .map(e => {
          switch (e.emotionalContext!.anticipatedStress) {
            case 'low': return 1;
            case 'medium': return 2;
            case 'high': return 3;
            case 'critical': return 4;
            default: return 0;
          }
        });
      const averageStress = stressScores.length > 0
        ? stressScores.reduce((sum: number, s) => sum + s, 0) / stressScores.length
        : 0;
      
      // Calculate success rate (assume success if has postEventNotes)
      const successCount = events.filter(e => 
        e.postEventNotes && e.postEventNotes.length > 0
      ).length;
      const successRate = successCount / events.length;
      
      this.rhythmPatterns.set(type, {
        frequency,
        lastOccurrence: lastEvent.startTime,
        averageStress,
        successRate
      });
    });
  }

  /**
   * 🔄 Update rhythm patterns when new event added
   */
  private updateRhythmPatterns(event: CalendarEvent): void {
    // Simplified: just re-analyze everything
    // In production, this would be incremental
    this.analyzeRhythmPatterns();
  }

  /**
   * 💾 Save rhythm patterns to storage
   */
  private saveRhythmPatterns(): void {
    if (typeof window === 'undefined') return;
    
    const patternsArray = Array.from(this.rhythmPatterns.entries()).map(([type, data]) => ({
      type,
      ...data,
      lastOccurrence: data.lastOccurrence.toISOString()
    }));
    
    localStorage.setItem('calendar_rhythm_patterns', JSON.stringify(patternsArray));
  }

  /**
   * 💾 Save conflict log to storage
   */
  private saveConflictLog(): void {
    if (typeof window === 'undefined') return;
    
    const logArray = this.conflictLog.map(entry => ({
      ...entry,
      timestamp: entry.timestamp.toISOString()
    }));
    
    localStorage.setItem('calendar_conflict_log', JSON.stringify(logArray));
  }

  /**
   * 🌐 Share rhythm insights with hub
   */
  private async shareRhythmInsights(): Promise<void> {
    if (!this.isConnected()) return;
    
    const insights = {
      totalEvents: this.events.length,
      patterns: Object.fromEntries(this.rhythmPatterns),
      conflictRate: this.conflictLog.length / this.events.length,
      averageDensity: Array.from(this.densityCache.values()).reduce((sum, n) => sum + n, 0) / this.densityCache.size
    };
    
    await this.docking.shareData('calendar_insights', insights);
  }
}

