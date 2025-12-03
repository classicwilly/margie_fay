/**
 * 🤝 Parenting Module - Co-Parenting Coordination Engine
 * 
 * VPI PROTOCOL: Relationship Repair & Coordination Intelligence
 * Frequency: 528 Hz (Transformation, Miracles, DNA Repair)
 * 
 * Four Vertices (Tetrahedral Co-Parenting Architecture):
 * ┌───────────────────────────────────────────────────────────┐
 * │ 1. COMMUNICATION (Emotional) - Structured messaging         │
 * │    - BIFF protocol (Brief, Informative, Friendly, Firm)  │
 * │    - Tone calibration (reduces escalation)               │
 * │    - Template library for common scenarios               │
 * │    - Conflict de-escalation flowcharts                   │
 * │    - Read receipts & response time tracking              │
 * │                                                           │
 * │ 2. CUSTODY CALENDAR (Practical) - Transition scheduling  │
 * │    - Visual custody timeline with color coding           │
 * │    - Holiday rotation algorithms                         │
 * │    - Exception handling & swap requests                  │
 * │    - Integration with main calendar module               │
 * │    - Transition prep reminders                           │
 * │                                                           │
 * │ 3. RULE ALIGNMENT (Philosophical) - Consistency protocol │
 * │    - Shared house rules repository                       │
 * │    - Consequence alignment system                        │
 * │    - Agreement versioning & tracking                     │
 * │    - Collaborative rule editing                          │
 * │    - "United front" reinforcement tools                  │
 * │                                                           │
 * │ 4. TRANSITIONS (Technical) - Handoff orchestration       │
 * │    - Interactive handoff checklists                      │
 * │    - Kid preparation protocols                           │
 * │    - Emotional prep for both parents & kids              │
 * │    - Post-transition debrief system                      │
 * │    - Smooth transition success tracking                  │
 * └───────────────────────────────────────────────────────────┘
 * 
 * PROTOCOL PHILOSOPHY:
 * Co-parenting after separation is one of the hardest relationship tasks.
 * This module doesn't try to fix the relationship - it provides structure,
 * reduces friction, and protects kids from adult conflict. Every feature
 * is designed to lower the temperature, increase predictability, and
 * maintain consistency across two households.
 * 
 * VPI ENRICHMENT:
 * - Communication Intelligence: Tone analysis, escalation detection
 * - Transition Smoothness: Success metrics, pattern learning
 * - Conflict Mapping: Track what triggers fights, suggest alternatives
 * - Rule Consistency: Version control for parenting agreements
 * - Kid-Centric Design: Every feature asks "does this help the kids?"
 */

import { BaseModule } from '@/lib/modules/BaseModule';
import type { ModuleMetadata, Vertex, HubAuth } from '@/lib/types/module';

// VPI: Message tone classification
export type MessageTone = 'neutral' | 'friendly' | 'urgent' | 'conflict' | 'celebration';

// VPI: Message visual markers
export type MessagePriority = 'low' | 'normal' | 'high' | 'urgent';

export interface Message {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  timestamp: Date;
  read: boolean;
  urgent: boolean;
  category: 'schedule' | 'health' | 'school' | 'discipline' | 'general';
  
  // VPI: Communication intelligence
  tone?: MessageTone;
  priority?: MessagePriority;
  sentiment?: 'positive' | 'neutral' | 'negative';  // AI-detected
  templateUsed?: string;  // Which BIFF template was used
  responseTime?: number;  // Minutes to respond
  escalationRisk?: 'low' | 'medium' | 'high';  // AI prediction
}

export interface CustodySchedule {
  id: string;
  parentId: string;
  startDate: Date;
  endDate: Date;
  type: 'regular' | 'holiday' | 'exception';
  notes?: string;
}

export interface HouseRule {
  id: string;
  category: 'bedtime' | 'screen' | 'homework' | 'chores' | 'discipline' | 'safety' | 'other';
  rule: string;
  consequence?: string;
  agreed: boolean;
  agreedDate?: Date;
}

export interface TransitionChecklist {
  id: string;
  name: string;
  items: {
    id: string;
    text: string;
    completed: boolean;
  }[];
  lastUsed?: Date;
}

export class ParentingModule extends BaseModule {
  private messages: Message[] = [];
  private custodySchedule: CustodySchedule[] = [];
  private houseRules: HouseRule[] = [];
  private checklists: TransitionChecklist[] = [];

  constructor() {
    const metadata: ModuleMetadata = {
      id: 'parenting',
      name: '🤝 Parenting - Co-Parent Coordinator',
      description: 'Structured communication, custody coordination, rule alignment, and transition protocols for separated parents',
      author: 'Tetrahedron Protocol',
      version: '2.0.0',  // VPI Enhanced
      license: 'CC-BY-4.0',
      category: 'parenting',
      tags: [
        'parenting',
        'co-parenting',
        'custody-coordination',
        'structured-communication',
        'divorce-support',
        'conflict-reduction',
        'transition-protocols',
        'rule-alignment',
        'BIFF-method',
        'visual-protocol'
      ],
      dependencies: ['calendar'],
      lastUpdated: new Date(),
      
      // VPI: Module Visual Identity
      primaryColor: '#8B5CF6',      // Purple - Transformation, Healing
      secondaryColor: '#EC4899',    // Pink - Connection, Care
      accentColor: '#10B981',       // Green - Growth, Agreement
      iconEmoji: '🤝',
      
      // VPI: Protocol Metadata
      protocolFrequency: '528Hz',   // Transformation & miracles
      tetrahedral: true,
      vertexBalance: {
        emotional: 1,               // Communication
        practical: 1,               // Custody
        philosophical: 1,           // Rules
        technical: 1                // Transitions (perfect balance!)
      }
    };

    const vertices: [Vertex, Vertex, Vertex, Vertex] = [
      {
        id: 'parenting-communication',
        name: 'Co-parent Communication',
        category: 'emotional',
        description: 'Structured messaging, status updates, conflict de-escalation'
      },
      {
        id: 'parenting-custody',
        name: 'Custody Calendar',
        category: 'practical',
        description: 'Transition schedule, pickups, holidays, exceptions'
      },
      {
        id: 'parenting-rules',
        name: 'Rule Alignment',
        category: 'philosophical',
        description: 'Shared house rules, consequences, consistency'
      },
      {
        id: 'parenting-transitions',
        name: 'Transition Protocol',
        category: 'technical',
        description: 'Handoff checklists, kid prep, parent coordination'
      }
    ];

    super(metadata, vertices);
  }

  async initialize(): Promise<void> {
    this.messages = this.loadMessages();
    this.custodySchedule = this.loadCustodySchedule();
    this.houseRules = this.loadHouseRules();
    this.checklists = this.loadChecklists();
    
    // Create default checklists if none exist
    if (this.checklists.length === 0) {
      this.createDefaultChecklists();
    }
  }

  async destroy(): Promise<void> {
    this.saveMessages();
    this.saveCustodySchedule();
    this.saveHouseRules();
    this.saveChecklists();
  }

  // ============================================================================
  // COMMUNICATION
  // ============================================================================

  sendMessage(message: Omit<Message, 'id' | 'timestamp' | 'read'>): Message {
    const newMessage: Message = {
      id: this.generateId('msg'),
      ...message,
      timestamp: new Date(),
      read: false
    };

    this.messages.push(newMessage);
    this.saveMessages();
    this.triggerEvent('message:sent', newMessage);

    return newMessage;
  }

  getMessages(category?: string): Message[] {
    if (category) {
      return this.messages.filter(m => m.category === category);
    }
    return [...this.messages].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  markAsRead(messageId: string): void {
    const message = this.messages.find(m => m.id === messageId);
    if (message) {
      message.read = true;
      this.saveMessages();
    }
  }

  getUnreadCount(): number {
    return this.messages.filter(m => !m.read).length;
  }

  // ============================================================================
  // CUSTODY CALENDAR
  // ============================================================================

  addCustodyPeriod(period: Omit<CustodySchedule, 'id'>): CustodySchedule {
    const newPeriod: CustodySchedule = {
      id: this.generateId('custody'),
      ...period
    };

    this.custodySchedule.push(newPeriod);
    this.saveCustodySchedule();
    this.triggerEvent('custody:added', newPeriod);

    // Sync with calendar module if available
    this.syncWithCalendarModule(newPeriod);

    return newPeriod;
  }

  getCustodySchedule(startDate?: Date, endDate?: Date): CustodySchedule[] {
    let schedule = this.custodySchedule;

    if (startDate) {
      schedule = schedule.filter(s => s.endDate >= startDate);
    }
    if (endDate) {
      schedule = schedule.filter(s => s.startDate <= endDate);
    }

    return schedule.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  }

  getUpcomingTransitions(count: number = 5): CustodySchedule[] {
    const now = new Date();
    return this.custodySchedule
      .filter(s => s.startDate >= now)
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
      .slice(0, count);
  }

  // ============================================================================
  // RULE ALIGNMENT
  // ============================================================================

  addHouseRule(rule: Omit<HouseRule, 'id'>): HouseRule {
    const newRule: HouseRule = {
      id: this.generateId('rule'),
      ...rule
    };

    this.houseRules.push(newRule);
    this.saveHouseRules();
    this.triggerEvent('rule:added', newRule);

    return newRule;
  }

  updateHouseRule(ruleId: string, updates: Partial<HouseRule>): HouseRule | null {
    const rule = this.houseRules.find(r => r.id === ruleId);
    if (!rule) return null;

    Object.assign(rule, updates);
    this.saveHouseRules();
    this.triggerEvent('rule:updated', rule);

    return rule;
  }

  agreeToRule(ruleId: string): HouseRule | null {
    const rule = this.houseRules.find(r => r.id === ruleId);
    if (!rule) return null;

    rule.agreed = true;
    rule.agreedDate = new Date();
    this.saveHouseRules();
    this.triggerEvent('rule:agreed', rule);

    return rule;
  }

  getHouseRules(category?: string): HouseRule[] {
    if (category) {
      return this.houseRules.filter(r => r.category === category);
    }
    return this.houseRules;
  }

  getAgreedRules(): HouseRule[] {
    return this.houseRules.filter(r => r.agreed);
  }

  getPendingRules(): HouseRule[] {
    return this.houseRules.filter(r => !r.agreed);
  }

  // ============================================================================
  // TRANSITION CHECKLISTS
  // ============================================================================

  createChecklist(name: string, items: string[]): TransitionChecklist {
    const checklist: TransitionChecklist = {
      id: this.generateId('checklist'),
      name,
      items: items.map((text, index) => ({
        id: `item-${index}`,
        text,
        completed: false
      }))
    };

    this.checklists.push(checklist);
    this.saveChecklists();
    this.triggerEvent('checklist:created', checklist);

    return checklist;
  }

  getChecklist(checklistId: string): TransitionChecklist | undefined {
    return this.checklists.find(c => c.id === checklistId);
  }

  getAllChecklists(): TransitionChecklist[] {
    return this.checklists;
  }

  toggleChecklistItem(checklistId: string, itemId: string): void {
    const checklist = this.getChecklist(checklistId);
    if (!checklist) return;

    const item = checklist.items.find(i => i.id === itemId);
    if (item) {
      item.completed = !item.completed;
      checklist.lastUsed = new Date();
      this.saveChecklists();
      this.triggerEvent('checklist:updated', checklist);
    }
  }

  resetChecklist(checklistId: string): void {
    const checklist = this.getChecklist(checklistId);
    if (!checklist) return;

    checklist.items.forEach(item => {
      item.completed = false;
    });
    this.saveChecklists();
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  private createDefaultChecklists(): void {
    this.createChecklist('Parent Handoff', [
      'Pack child\'s clothes for next few days',
      'Include medications and instructions',
      'Pack school supplies and homework',
      'Add favorite comfort items',
      'Brief other parent on recent updates',
      'Exchange relevant documents'
    ]);

    this.createChecklist('Pre-Transition (Kid Prep)', [
      'Remind child of upcoming transition',
      'Help pack personal items',
      'Review schedule for next few days',
      'Address any concerns or questions',
      'Ensure contact info is accessible'
    ]);

    this.createChecklist('Post-Transition Debrief', [
      'Check in on child\'s emotional state',
      'Review what went well',
      'Note any issues or concerns',
      'Update other parent if needed',
      'Plan improvements for next time'
    ]);
  }

  private async syncWithCalendarModule(period: CustodySchedule): Promise<void> {
    if (!this.isConnected()) return;

    // Send to calendar module
    await this.docking.sendToModule('calendar', {
      type: 'add_event',
      event: {
        title: `Custody: ${period.type}`,
        startTime: period.startDate,
        endTime: period.endDate,
        description: period.notes,
        category: 'custody'
      }
    });
  }

  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  private saveMessages(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('parenting_messages', JSON.stringify(this.messages));
  }

  private loadMessages(): Message[] {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('parenting_messages');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return (parsed as unknown[]).map(m => {
        const mm = m as unknown as Message;
        return ({
          ...mm,
          timestamp: new Date((mm as Message).timestamp as unknown as string | number)
        }) as Message;
      });
    } catch {
      return [];
    }
  }

  private saveCustodySchedule(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('parenting_custody', JSON.stringify(this.custodySchedule));
  }

  private loadCustodySchedule(): CustodySchedule[] {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('parenting_custody');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return (parsed as unknown[]).map(s => {
        const ss = s as unknown as CustodySchedule;
        return ({
          ...ss,
          startDate: new Date((ss as CustodySchedule).startDate as unknown as string | number),
          endDate: new Date((ss as CustodySchedule).endDate as unknown as string | number),
        }) as CustodySchedule;
      });
    } catch {
      return [];
    }
  }

  private saveHouseRules(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('parenting_rules', JSON.stringify(this.houseRules));
  }

  private loadHouseRules(): HouseRule[] {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('parenting_rules');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return (parsed as unknown[]).map(r => {
        const rr = r as unknown as HouseRule;
        return ({
          ...rr,
          agreedDate: (rr as HouseRule).agreedDate ? new Date((rr as HouseRule).agreedDate as unknown as string | number) : undefined
        }) as HouseRule;
      });
    } catch {
      return [];
    }
  }

  private saveChecklists(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('parenting_checklists', JSON.stringify(this.checklists));
  }

  private loadChecklists(): TransitionChecklist[] {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('parenting_checklists');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return (parsed as unknown[]).map(c => {
        const cc = c as unknown as TransitionChecklist;
        return ({
          ...cc,
          lastUsed: (cc as HouseRule).lastUsed ? new Date((cc as HouseRule).lastUsed as unknown as string | number) : undefined
        }) as TransitionChecklist;
      });
    } catch {
      return [];
    }
  }
}
