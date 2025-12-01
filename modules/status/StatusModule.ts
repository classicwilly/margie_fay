/**
 * Status Module (Phenix Navigator)
 * 
 * Four Vertices:
 * 1. Availability - Green/yellow/red status indicator
 * 2. Health - Physical wellness check-in
 * 3. Mood - Emotional state tracking
 * 4. Needs - What support needed right now
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
      name: 'Status Module (Phenix Navigator)',
      description: 'Real-time availability, health, mood, and needs broadcasting',
      author: 'Tetrahedron Protocol',
      version: '1.0.0',
      license: 'CC-BY-4.0',
      category: 'communication',
      tags: ['status', 'presence', 'health', 'mood', 'availability'],
      dependencies: [],
      lastUpdated: new Date()
    };

    const vertices: [Vertex, Vertex, Vertex, Vertex] = [
      {
        id: 'status-availability',
        name: 'Availability',
        category: 'technical',
        description: 'Green/yellow/red status indicator for immediate availability'
      },
      {
        id: 'status-health',
        name: 'Health',
        category: 'practical',
        description: 'Physical wellness check-in'
      },
      {
        id: 'status-mood',
        name: 'Mood',
        category: 'emotional',
        description: 'Emotional state tracking'
      },
      {
        id: 'status-needs',
        name: 'Needs',
        category: 'philosophical',
        description: 'What support is needed right now'
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
      return parsed.map((s: any) => ({
        ...s,
        timestamp: new Date(s.timestamp)
      }));
    } catch {
      return [];
    }
  }
}
