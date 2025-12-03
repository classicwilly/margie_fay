/**
 * 🌈 Kids Module - Child Resilience Architecture
 * 
 * VPI PROTOCOL: Age-Appropriate Support & Empowerment Systems
 * Frequency: 396 Hz (Liberating Guilt & Fear, Grounding)
 * 
 * Four Vertices (Tetrahedral Growth Architecture):
 * ┌───────────────────────────────────────────────────────────┐
 * │ 1. LITTLE KIDS 5-9 (Emotional) - Safety & comfort       │
 * │    - Simple tetrahedron explanation (4 support people)   │
 * │    - Feelings chart with emoji & colors                  │
 * │    - Comfort activities (drawing, play, stories)         │
 * │    - "Not your fault" messaging reinforcement            │
 * │    - Safe space creation                                 │
 * │                                                           │
 * │ 2. TWEENS 10-12 (Practical) - Understanding systems     │
 * │    - Family system visualization                         │
 * │    - Support network mapping                             │
 * │    - Coping skills toolkit (breathing, journaling)       │
 * │    - Emotional vocabulary expansion                      │
 * │    - Peer support resources                              │
 * │                                                           │
 * │ 3. TEENS 13-17 (Philosophical) - Autonomy & agency      │
 * │    - Resilience architecture concepts                    │
 * │    - Agency in own support system                        │
 * │    - Future self visualization                           │
 * │    - Relationship pattern awareness                      │
 * │    - College/independence preparation                    │
 * │                                                           │
 * │ 4. FAMILY ACTIVITIES (Technical) - Connection building  │
 * │    - Shared experience library                           │
 * │    - Low-stress connection activities                    │
 * │    - Ritual creation tools                               │
 * │    - Memory documentation                                │
 * │    - Team strengthening exercises                        │
 * └───────────────────────────────────────────────────────────┘
 * 
 * PROTOCOL PHILOSOPHY:
 * Kids don't need to understand tetrahedrons - they need to feel safe,
 * understood, and empowered. This module adapts its language, activities,
 * and support strategies to developmental stage. For little ones, it's
 * about safety and "not your fault." For tweens, it's skill-building.
 * For teens, it's autonomy and agency in their own support system.
 * 
 * VPI ENRICHMENT:
 * - Developmental Adaptation: Content scales with cognitive ability
 * - Visual Language: Heavy use of emoji, colors, metaphors
 * - Safety First: Every feature reinforces "you're not alone"
 * - Empowerment Focus: From victim to agent of own life
 * - Check-in Intelligence: Detects when kids need help
 * - Resource Curation: Age-appropriate books, apps, hotlines
 */

import { BaseModule } from '@/lib/modules/BaseModule';
import type { ModuleMetadata, Vertex } from '@/lib/types/module';

export type AgeGroup = 'little-kids' | 'tweens' | 'teens';

// VPI: Emotion spectrum for kids
export type KidsMood = 'amazing' | 'happy' | 'okay' | 'sad' | 'mad' | 'scared' | 'confused';

// VPI: Visual activity markers
export type ActivityDifficulty = 'easy' | 'medium' | 'challenging';
export type ActivityDuration = 'quick' | 'medium' | 'long';  // 5min, 15min, 30min+

export interface KidsContent {
  ageGroup: AgeGroup;
  activities: Activity[];
  resources: Resource[];
  conversationStarters: string[];
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  ageGroup: AgeGroup;
  category: 'creative' | 'coping' | 'connection' | 'learning';
  completed: boolean;
  completedDate?: Date;
}

export interface Resource {
  id: string;
  type: 'book' | 'website' | 'hotline' | 'app';
  title: string;
  description: string;
  ageGroup: AgeGroup;
  url?: string;
  phone?: string;
}

export interface CheckIn {
  id: string;
  timestamp: Date;
  ageGroup: AgeGroup;
  mood: 'great' | 'good' | 'okay' | 'not-good' | 'bad';
  needsHelp: boolean;
  notes?: string;
}

export class KidsModule extends BaseModule {
  private activities: Activity[] = [];
  private checkIns: CheckIn[] = [];

  constructor() {
    const metadata: ModuleMetadata = {
      id: 'kids',
      name: '🌈 Kids - Resilience Architect',
      description: 'Support and coping tools for kids (5-17) navigating family change',
      author: 'Tetrahedron Protocol',
      version: '2.0.0',  // VPI Enhanced
      license: 'CC-BY-4.0',
      category: 'education',
      tags: [
        'kids',
        'children',
        'resilience',
        'coping-skills',
        'emotional-support',
        'age-appropriate',
        'empowerment',
        'safety',
        'family-activities',
        'visual-protocol'
      ],
      dependencies: [],
      lastUpdated: new Date(),
      
      // VPI: Module Visual Identity
      primaryColor: '#F59E0B',      // Amber - Warmth, Safety
      secondaryColor: '#EC4899',    // Pink - Care, Nurturing
      accentColor: '#8B5CF6',       // Purple - Growth, Magic
      iconEmoji: '🌈',
      
      // VPI: Protocol Metadata
      protocolFrequency: '396Hz',   // Liberation from fear & guilt
      tetrahedral: true,
      vertexBalance: {
        emotional: 1,               // Little Kids
        practical: 1,               // Tweens
        philosophical: 1,           // Teens
        technical: 1                // Family Activities
      }
    };

    const vertices: [Vertex, Vertex, Vertex, Vertex] = [
      {
        id: 'kids-little',
        name: 'Little Kids (5-9)',
        category: 'emotional',
        description: 'Simple explanations, comfort activities, building safety'
      },
      {
        id: 'kids-tweens',
        name: 'Tweens (10-12)',
        category: 'practical',
        description: 'Understanding systems, identifying support, coping skills'
      },
      {
        id: 'kids-teens',
        name: 'Teens (13-17)',
        category: 'philosophical',
        description: 'Autonomy, resilience architecture, agency in own system'
      },
      {
        id: 'kids-family',
        name: 'Family Activities',
        category: 'technical',
        description: 'Shared experiences, connection-building, team strengthening'
      }
    ];

    super(metadata, vertices);
  }

  async initialize(): Promise<void> {
    this.activities = this.loadActivities();
    this.checkIns = this.loadCheckIns();
    
    // Create default activities if none exist
    if (this.activities.length === 0) {
      this.createDefaultActivities();
    }
  }

  async destroy(): Promise<void> {
    this.saveActivities();
    this.saveCheckIns();
  }

  // ============================================================================
  // ACTIVITIES
  // ============================================================================

  getActivities(ageGroup?: AgeGroup): Activity[] {
    if (ageGroup) {
      return this.activities.filter(a => a.ageGroup === ageGroup);
    }
    return this.activities;
  }

  completeActivity(activityId: string): Activity | null {
    const activity = this.activities.find(a => a.id === activityId);
    if (!activity) return null;

    activity.completed = true;
    activity.completedDate = new Date();
    this.saveActivities();
    this.triggerEvent('activity:completed', activity);

    return activity;
  }

  addCustomActivity(activity: Omit<Activity, 'id' | 'completed'>): Activity {
    const newActivity: Activity = {
      id: this.generateId('activity'),
      ...activity,
      completed: false
    };

    this.activities.push(newActivity);
    this.saveActivities();

    return newActivity;
  }

  // ============================================================================
  // CHECK-INS
  // ============================================================================

  createCheckIn(checkIn: Omit<CheckIn, 'id' | 'timestamp'>): CheckIn {
    const newCheckIn: CheckIn = {
      id: this.generateId('checkin'),
      timestamp: new Date(),
      ...checkIn
    };

    this.checkIns.push(newCheckIn);
    this.saveCheckIns();
    this.triggerEvent('checkin:created', newCheckIn);

    // If needs help, trigger alert
    if (newCheckIn.needsHelp) {
      this.triggerHelpAlert(newCheckIn);
    }

    return newCheckIn;
  }

  getCheckIns(days: number = 7): CheckIn[] {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    return this.checkIns
      .filter(c => c.timestamp >= cutoff)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  getMoodTrend(days: number = 7): { date: string; average: number }[] {
    const checkIns = this.getCheckIns(days);
    const grouped = new Map<string, number[]>();

    const moodValues: Record<CheckIn['mood'], number> = {
      'great': 5,
      'good': 4,
      'okay': 3,
      'not-good': 2,
      'bad': 1
    };

    checkIns.forEach(checkIn => {
      const date = checkIn.timestamp.toISOString().split('T')[0];
      
      if (!grouped.has(date)) {
        grouped.set(date, []);
      }

      grouped.get(date)!.push(moodValues[checkIn.mood]);
    });

    return Array.from(grouped.entries()).map(([date, values]) => ({
      date,
      average: values.reduce((a, b) => a + b, 0) / values.length
    }));
  }

  // ============================================================================
  // RESOURCES
  // ============================================================================

  getCrisisResources(): Resource[] {
    return [
      {
        id: 'crisis-1',
        type: 'hotline',
        title: 'Kids Help Phone',
        description: '24/7 support for kids and teens',
        ageGroup: 'teens',
        phone: '1-800-668-6868'
      },
      {
        id: 'crisis-2',
        type: 'hotline',
        title: 'Crisis Text Line',
        description: 'Text-based support',
        ageGroup: 'teens',
        phone: 'Text HOME to 741741'
      },
      {
        id: 'crisis-3',
        type: 'hotline',
        title: 'National Suicide Prevention Lifeline',
        description: '24/7 crisis support',
        ageGroup: 'teens',
        phone: '988'
      }
    ];
  }

  getBooks(ageGroup: AgeGroup): Resource[] {
    const books: Record<AgeGroup, Resource[]> = {
      'little-kids': [
        {
          id: 'book-lk-1',
          type: 'book',
          title: 'The Invisible String',
          description: 'Understanding connection even when apart',
          ageGroup: 'little-kids'
        },
        {
          id: 'book-lk-2',
          type: 'book',
          title: 'Dinosaurs Divorce',
          description: 'Helping kids understand family changes',
          ageGroup: 'little-kids'
        }
      ],
      'tweens': [
        {
          id: 'book-tw-1',
          type: 'book',
          title: 'My Parents Are Divorced, My Elbows Have Nicknames, and Other Facts About Me',
          description: 'Honest, funny look at life with divorced parents',
          ageGroup: 'tweens'
        },
        {
          id: 'book-tw-2',
          type: 'book',
          title: 'The Survival Guide for Kids with Divorced Parents',
          description: 'Practical advice and coping strategies',
          ageGroup: 'tweens'
        }
      ],
      'teens': [
        {
          id: 'book-tn-1',
          type: 'book',
          title: 'It\'s Not Your Fault, Koko Bear',
          description: 'Processing emotions around divorce',
          ageGroup: 'teens'
        },
        {
          id: 'book-tn-2',
          type: 'book',
          title: 'Teen Anxiety',
          description: 'Understanding and managing anxiety',
          ageGroup: 'teens'
        }
      ]
    };

    return books[ageGroup];
  }

  getConversationStarters(ageGroup: AgeGroup): string[] {
    const starters: Record<AgeGroup, string[]> = {
      'little-kids': [
        "Who are your four special grown-ups?",
        "If you felt worried, who would you talk to?",
        "What makes you feel safe and happy?",
        "Who helps you when things are hard?"
      ],
      'tweens': [
        "Who's in your support network?",
        "What do you do when you're feeling stressed?",
        "Who can you talk to about different things?",
        "How do you know when you need help?"
      ],
      'teens': [
        "What does your support system look like right now?",
        "How do you take care of your mental health?",
        "What boundaries do you need in your relationships?",
        "When was the last time you checked in with your support people?"
      ]
    };

    return starters[ageGroup];
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  private createDefaultActivities(): void {
    // Little Kids activities
    this.addCustomActivity({
      title: 'Draw Your Support Team',
      description: 'Draw pictures of your four special grown-ups',
      ageGroup: 'little-kids',
      category: 'creative'
    });

    this.addCustomActivity({
      title: 'Make a Call List',
      description: 'Create a list with phone numbers for your team',
      ageGroup: 'little-kids',
      category: 'connection'
    });

    // Tweens activities
    this.addCustomActivity({
      title: 'Map Your Tetrahedron',
      description: 'Draw your support network and how everyone connects',
      ageGroup: 'tweens',
      category: 'learning'
    });

    this.addCustomActivity({
      title: 'Practice Deep Breathing',
      description: '4-7-8 breathing exercise when stressed',
      ageGroup: 'tweens',
      category: 'coping'
    });

    // Teens activities
    this.addCustomActivity({
      title: 'Identify Your Edges',
      description: 'Write about the connections between your support people',
      ageGroup: 'teens',
      category: 'learning'
    });

    this.addCustomActivity({
      title: 'Create Your Boundaries',
      description: 'List what you need from each support person',
      ageGroup: 'teens',
      category: 'coping'
    });
  }

  private triggerHelpAlert(checkIn: CheckIn): void {
    // In production, this would notify support team
    this.triggerEvent('help:needed', {
      checkInId: checkIn.id,
      ageGroup: checkIn.ageGroup,
      mood: checkIn.mood,
      timestamp: checkIn.timestamp
    });

    // Share with status module
    if (this.isConnected()) {
      this.docking.sendToModule('status', {
        type: 'crisis_alert',
        source: 'kids_module',
        data: checkIn
      });
    }
  }

  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  private saveActivities(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('kids_activities', JSON.stringify(this.activities));
  }

  private loadActivities(): Activity[] {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('kids_activities');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return (parsed as unknown[]).map(ci => {
        const c = ci as unknown as CheckIn;
        return ({
          ...c,
          timestamp: new Date((ci as CheckIn).timestamp as unknown as string | number)
        }) as CheckIn;
      });
    } catch {
      return [];
    }
  }

  private saveCheckIns(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('kids_checkins', JSON.stringify(this.checkIns));
  }

  private loadCheckIns(): CheckIn[] {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('kids_checkins');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return (parsed as unknown[]).map(c => {
        const ci = c as unknown as CheckIn;
        return ({
          ...c,
          timestamp: new Date((ci as CheckIn).timestamp as unknown as string | number)
        }) as CheckIn;
      });
    } catch {
      return [];
    }
  }

  /**
   * Get all children profiles
   */
  async getChildren(): Promise<any[]> {
    // Return mock data for now - this would come from user data in production
    return [
      {
        id: 'child-1',
        name: 'Emma',
        age: 8,
        interests: ['art', 'reading', 'animals'],
        recentActivities: []
      }
    ];
  }

  /**
   * Log an activity for a child
   */
  async logActivity(childId: string, activity: string): Promise<void> {
    // Store activity - in production this would be persisted
    console.log(`Activity logged for ${childId}:`, activity);
  }
}
