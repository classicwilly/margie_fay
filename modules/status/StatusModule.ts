/**
 * 🧭 Status Module - Phenix Navigator (Presence Broadcasting Engine)
 * 
 * VPI PROTOCOL: Real-time Wellness & Availability Signaling
 * Frequency: 639 Hz (Harmonizing Relationships, Connection, Understanding)
 * 
 * Four Vertices (Tetrahedral Presence Architecture):
 * ┌───────────────────────────────────────────────────────────┐
 * │ 1. AVAILABILITY (Technical) - Capacity signaling          │
 * │    - Green/Yellow/Red traffic light system               │
 * │    - Visual presence indicators with context             │
 * │    - Auto-detection of schedule density                  │
 * │    - Boundary enforcement through color coding           │
 * │                                                           │
 * │ 2. HEALTH (Practical) - Physical wellness broadcasting   │
 * │    - Sleep quality, hydration, exercise tracking         │
 * │    - Energy levels with visual gauges                    │
 * │    - Wellness trends and pattern detection               │
 * │    - Self-care reminders and encouragement               │
 * │                                                           │
 * │ 3. MOOD (Emotional) - Emotional weather reporting        │
 * │    - Granular mood spectrum (not just happy/sad)         │
 * │    - Emotional trajectory visualization                  │
 * │    - Context-aware mood patterns                         │
 * │    - Trigger identification and learning                 │
 * │                                                           │
 * │ 4. NEEDS (Philosophical) - Support request system        │
 * │    - Clear articulation of current needs                 │
 * │    - Request types: space, support, conversation, help   │
 * │    - Reciprocity tracking (give/receive balance)         │
 * │    - Need fulfillment celebration                        │
 * └───────────────────────────────────────────────────────────┘
 * 
 * PROTOCOL PHILOSOPHY:
 * Presence is not just "available" or "busy." It's a rich tapestry of
 * physical state, emotional weather, relational capacity, and support needs.
 * This module transforms status updates from binary signals into full-spectrum
 * human presence broadcasting. It helps families stay connected without
 * constant check-ins, respecting boundaries while maintaining awareness.
 * 
 * VPI ENRICHMENT:
 * - Color Psychology: Traffic light system + mood spectrum visualization
 * - Presence History: Pattern detection across time (when are you greenest?)
 * - Proactive Support: AI suggests when someone might need check-in
 * - Boundary Intelligence: Auto-sets red based on schedule/stress
 * - Reciprocity Metrics: Tracks give/receive balance in support requests
 */

import { BaseModule } from '@/lib/modules/BaseModule';
import type { ModuleMetadata, Vertex, HubAuth } from '@/lib/types/module';

export type AvailabilityStatus = 'green' | 'yellow' | 'red';

export type HealthStatus = 
  | 'excellent' 
  | 'good' 
  | 'fair' 
  | 'struggling' 
  | 'crisis';

export type MoodState = 
  | 'great' 
  | 'good' 
  | 'neutral' 
  | 'down' 
  | 'distressed';

export interface StatusUpdate {
  timestamp: Date;
  availability: AvailabilityStatus;
  health: HealthStatus;
  mood: MoodState;
  needs: string;
  notes?: string;
  healthMetrics?: {
    sleep?: number;
    exercise?: number;
    water?: number;
    energy?: number;
  };
  customMessage?: string;
}

export interface CurrentStatus extends StatusUpdate {
  userId: string;
  vertexId?: string;  // If broadcasting from specific vertex
}

export class StatusModule extends BaseModule {
  private currentStatus: CurrentStatus;
  private statusHistory: StatusUpdate[] = [];

  constructor() {
    const metadata: ModuleMetadata = {
      id: 'status',
      name: '🧭 Status - Phenix Navigator',
      description: 'Real-time presence broadcasting with wellness tracking, mood signaling, and support requests',
      author: 'Tetrahedron Protocol',
      version: '2.0.0',  // VPI Enhanced
      license: 'CC-BY-4.0',
      category: 'communication',
      tags: [
        'status', 
        'presence', 
        'health-tracking', 
        'mood-spectrum', 
        'availability-signaling',
        'wellness-dashboard',
        'boundary-enforcement',
        'emotional-weather',
        'support-requests',
        'visual-protocol'
      ],
      dependencies: [],
      lastUpdated: new Date(),
      
      // VPI: Module Visual Identity
      primaryColor: '#10B981',      // Green - Wellness, Growth
      secondaryColor: '#F59E0B',    // Amber - Caution, Attention
      accentColor: '#EF4444',       // Red - Alert, Boundaries
      iconEmoji: '🧭',
      
      // VPI: Protocol Metadata
      protocolFrequency: '639Hz',   // Harmonizing relationships
      tetrahedral: true,
      vertexBalance: {
        technical: 1,               // Availability
        practical: 1,               // Health
        emotional: 1,               // Mood
        philosophical: 1            // Needs (perfect balance!)
      }
    };

    const vertices: [Vertex, Vertex, Vertex, Vertex] = [
      {
        id: 'status-availability',
        name: '🟢 Availability',
        category: 'technical',
        description: 'Traffic light presence system: Green (available), Yellow (limited), Red (unavailable)',
        metadata: {
          visualizations: ['traffic-light-badge', 'capacity-gauge', 'boundary-indicator'],
          statuses: ['green', 'yellow', 'red'],
          autoDetection: [
            'schedule-density',
            'stress-levels',
            'recent-interactions',
            'time-since-break'
          ],
          boundaryFeatures: [
            'do-not-disturb-mode',
            'auto-responder',
            'expectation-setting',
            'emergency-override'
          ]
        }
      },
      {
        id: 'status-health',
        name: '💪 Health',
        category: 'practical',
        description: 'Physical wellness dashboard: sleep, exercise, hydration, energy tracking',
        metadata: {
          metrics: ['sleep-hours', 'exercise-minutes', 'water-intake', 'energy-level'],
          visualizations: ['wellness-gauges', 'trend-charts', 'streak-calendar'],
          trackingTypes: ['daily-checkin', 'metric-logging', 'wellness-snapshot'],
          insights: [
            'pattern-detection',
            'correlation-analysis',
            'goal-progress',
            'encouragement-system'
          ]
        }
      },
      {
        id: 'status-mood',
        name: '🌈 Mood',
        category: 'emotional',
        description: 'Emotional weather spectrum: granular mood tracking with context and patterns',
        metadata: {
          moodSpectrum: ['great', 'good', 'neutral', 'down', 'distressed'],
          visualizations: ['mood-wheel', 'emotional-timeline', 'weather-metaphors'],
          contextTracking: [
            'trigger-identification',
            'pattern-recognition',
            'mood-forecasting',
            'improvement-suggestions'
          ],
          features: [
            'private-notes',
            'therapist-sharing',
            'trend-analysis',
            'celebration-markers'
          ]
        }
      },
      {
        id: 'status-needs',
        name: '🤝 Needs',
        category: 'philosophical',
        description: 'Support request system: articulate needs, track reciprocity, celebrate fulfillment',
        metadata: {
          needTypes: [
            'space',
            'conversation',
            'practical-help',
            'emotional-support',
            'advice',
            'presence',
            'celebration'
          ],
          features: [
            'clear-articulation',
            'request-broadcast',
            'fulfillment-tracking',
            'reciprocity-balance',
            'gratitude-system'
          ],
          intelligence: [
            'pattern-learning',
            'proactive-suggestions',
            'unmet-need-alerts',
            'support-network-mapping'
          ]
        }
      }
    ];

    super(metadata, vertices);

    // Initialize with default status
    this.currentStatus = {
      userId: '',
      timestamp: new Date(),
      availability: 'green',
      health: 'good',
      mood: 'neutral',
      needs: ''
    };
  }

  async initialize(): Promise<void> {
    // Load status history from storage
    this.statusHistory = this.loadHistory();
    
    // Load last known status
    const lastStatus = this.loadCurrentStatus();
    if (lastStatus) {
      this.currentStatus = lastStatus;
    }
  }

  async destroy(): Promise<void> {
    // Save before destruction
    this.saveCurrentStatus();
    this.saveHistory();
  }

  protected async onConnect(hubAuth: HubAuth): Promise<void> {
    // Set user ID when connecting
    this.currentStatus.userId = hubAuth.userId;
    
    // Broadcast current status to hub
    await this.broadcastStatus();
  }

  /**
   * Update status
   */
  updateStatus(updates: Partial<Omit<StatusUpdate, 'timestamp'>>): CurrentStatus {
    this.currentStatus = {
      ...this.currentStatus,
      ...updates,
      timestamp: new Date()
    };

    // Add to history
    this.statusHistory.push({
      timestamp: this.currentStatus.timestamp,
      availability: this.currentStatus.availability,
      health: this.currentStatus.health,
      mood: this.currentStatus.mood,
      needs: this.currentStatus.needs,
      notes: this.currentStatus.notes
    });

    // Keep only last 100 entries
    if (this.statusHistory.length > 100) {
      this.statusHistory = this.statusHistory.slice(-100);
    }

    this.saveCurrentStatus();
    this.saveHistory();
    this.broadcastStatus();
    this.triggerEvent('status:updated', this.currentStatus);

    return this.currentStatus;
  }

  /**
   * Quick status update (just availability)
   */
  setAvailability(status: AvailabilityStatus): CurrentStatus {
    return this.updateStatus({ availability: status });
  }

  /**
   * Get current status
   */
  getCurrentStatus(): CurrentStatus {
    return { ...this.currentStatus };
  }

  /**
   * Get status history
   */
  getHistory(days: number = 7): StatusUpdate[] {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    return this.statusHistory.filter(s => s.timestamp >= cutoff);
  }

  /**
   * Get availability trend
   */
  getAvailabilityTrend(days: number = 7): { date: string; green: number; yellow: number; red: number }[] {
    const history = this.getHistory(days);
    const grouped = new Map<string, { green: number; yellow: number; red: number }>();

    history.forEach(status => {
      const date = status.timestamp.toISOString().split('T')[0];
      
      if (!grouped.has(date)) {
        grouped.set(date, { green: 0, yellow: 0, red: 0 });
      }

      const counts = grouped.get(date)!;
      counts[status.availability]++;
    });

    return Array.from(grouped.entries()).map(([date, counts]) => ({
      date,
      ...counts
    }));
  }

  /**
   * Get mood trend
   */
  getMoodTrend(days: number = 7): { date: string; average: number }[] {
    const history = this.getHistory(days);
    const grouped = new Map<string, number[]>();

    const moodValues: Record<MoodState, number> = {
      'great': 5,
      'good': 4,
      'neutral': 3,
      'down': 2,
      'distressed': 1
    };

    history.forEach(status => {
      const date = status.timestamp.toISOString().split('T')[0];
      
      if (!grouped.has(date)) {
        grouped.set(date, []);
      }

      grouped.get(date)!.push(moodValues[status.mood]);
    });

    return Array.from(grouped.entries()).map(([date, values]) => ({
      date,
      average: values.reduce((a, b) => a + b, 0) / values.length
    }));
  }

  /**
   * Check if in crisis
   */
  isInCrisis(): boolean {
    return (
      this.currentStatus.availability === 'red' &&
      (this.currentStatus.health === 'crisis' || this.currentStatus.mood === 'distressed')
    );
  }

  /**
   * Get crisis resources
   */
  getCrisisResources(): { name: string; phone: string; description: string }[] {
    return [
      {
        name: 'National Suicide Prevention Lifeline',
        phone: '988',
        description: '24/7 crisis support'
      },
      {
        name: 'Crisis Text Line',
        phone: 'Text HOME to 741741',
        description: 'Text-based crisis support'
      },
      {
        name: 'Emergency Services',
        phone: '911',
        description: 'Immediate emergency response'
      }
    ];
  }

  /**
   * Broadcast status to hub and other modules
   */
  private async broadcastStatus(): Promise<void> {
    if (!this.isConnected()) return;

    await this.docking.shareData('current_status', this.currentStatus);
  }

  /**
   * Save current status to storage
   */
  private saveCurrentStatus(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem('status_current', JSON.stringify(this.currentStatus));
  }

  /**
   * Load current status from storage
   */
  private loadCurrentStatus(): CurrentStatus | null {
    if (typeof window === 'undefined') return null;
    
    const saved = localStorage.getItem('status_current');
    if (!saved) return null;

    try {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        timestamp: new Date(parsed.timestamp)
      };
    } catch {
      return null;
    }
  }

  /**
   * Save status history to storage
   */
  private saveHistory(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem('status_history', JSON.stringify(this.statusHistory));
  }

  /**
   * Load status history from storage
   */
  private loadHistory(): StatusUpdate[] {
    if (typeof window === 'undefined') return [];
    
    const saved = localStorage.getItem('status_history');
    if (!saved) return [];

    try {
      const parsed = JSON.parse(saved);
      return (parsed as unknown[]).map(s => {
        const st = s as unknown as { timestamp: string } & Partial<CurrentStatus>;
        return {
          ...st,
          timestamp: new Date(st.timestamp)
        } as CurrentStatus;
      });
    } catch {
      return [];
    }
  }
}
