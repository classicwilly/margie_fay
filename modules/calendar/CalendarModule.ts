/**
 * Calendar Module
 * 
 * Four Vertices:
 * 1. Schedule - Calendar view, time blocks
 * 2. Events - Create/manage events, invites
 * 3. Sync - Cross-platform sync (Google Cal, Outlook, iCal)
 * 4. Reminders - Notifications, alerts, recurring
 */

import { BaseModule } from '@/lib/modules/BaseModule';
import type { ModuleMetadata, Vertex, HubAuth } from '@/lib/types/module';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  attendees?: string[];
  reminders?: number[];  // Minutes before event
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: Date;
  };
  vertexId?: string;  // Associated vertex (e.g., "pickup with co-parent")
}

export class CalendarModule extends BaseModule {
  private events: CalendarEvent[] = [];

  constructor() {
    const metadata: ModuleMetadata = {
      id: 'calendar',
      name: 'Calendar Module',
      description: 'Schedule coordination, events, reminders, and cross-platform sync',
      author: 'Tetrahedron Protocol',
      version: '1.0.0',
      license: 'CC-BY-4.0',
      category: 'productivity',
      tags: ['calendar', 'scheduling', 'events', 'coordination'],
      dependencies: [],
      lastUpdated: new Date()
    };

    const vertices: [Vertex, Vertex, Vertex, Vertex] = [
      {
        id: 'calendar-schedule',
        name: 'Schedule',
        category: 'technical',
        description: 'Calendar view, time blocks, daily/weekly/monthly views'
      },
      {
        id: 'calendar-events',
        name: 'Events',
        category: 'practical',
        description: 'Create/manage events, invites, attendees'
      },
      {
        id: 'calendar-sync',
        name: 'Sync',
        category: 'technical',
        description: 'Cross-platform sync (Google Calendar, Outlook, iCal)'
      },
      {
        id: 'calendar-reminders',
        name: 'Reminders',
        category: 'emotional',
        description: 'Notifications, alerts, recurring reminders'
      }
    ];

    super(metadata, vertices);
  }

  async initialize(): Promise<void> {
    // Load events from storage
    this.events = this.loadEvents();
  }

  async destroy(): Promise<void> {
    // Save events before destruction
    this.saveEvents();
    this.events = [];
  }

  protected async onConnect(hubAuth: HubAuth): Promise<void> {
    // Sync with hub when connecting
    await this.syncWithHub();
  }

  /**
   * Create a new event
   */
  createEvent(event: Omit<CalendarEvent, 'id'>): CalendarEvent {
    const newEvent: CalendarEvent = {
      id: this.generateEventId(),
      ...event
    };

    this.events.push(newEvent);
    this.saveEvents();
    this.triggerEvent('event:created', newEvent);

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
      return parsed.map((event: any) => ({
        ...event,
        startTime: new Date(event.startTime),
        endTime: new Date(event.endTime)
      }));
    } catch {
      return [];
    }
  }
}
