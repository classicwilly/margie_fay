export type VertexType = 'technical' | 'emotional' | 'practical' | 'philosophical';

export interface Document {
  id: string;
  title: string;
  description: string;
  path: string;
  category?: string;
}

export interface ConnectedEdge {
  fromVertex: VertexType;
  toVertex: VertexType;
  title: string;
  description: string;
  path: string;
}

export interface VertexConfig {
  type: VertexType;
  name: string;
  color: string;
  darkColor: string;
  icon: string;
  description: string;
  longDescription: string;
  characteristics: string[];
  documents: Document[];
  connectedEdges: ConnectedEdge[];
}

export const VERTEX_COLORS: Record<VertexType, { main: string; dark: string; light: string }> = {
  technical: {
    main: '#3B82F6',
    dark: '#1E40AF',
    light: '#DBEAFE',
  },
  emotional: {
    main: '#8B5CF6',
    dark: '#6D28D9',
    light: '#EDE9FE',
  },
  practical: {
    main: '#10B981',
    dark: '#047857',
    light: '#D1FAE5',
  },
  philosophical: {
    main: '#F59E0B',
    dark: '#D97706',
    light: '#FEF3C7',
  },
};

export const VERTEX_CONFIGS: Record<VertexType, VertexConfig> = {
  technical: {
    type: 'technical',
    name: 'Technical',
    color: VERTEX_COLORS.technical.main,
    darkColor: VERTEX_COLORS.technical.dark,
    icon: '⚙️',
    description: 'Systems, processes, and logical frameworks',
    longDescription: 'The Technical vertex represents systematic thinking, logical processes, and structured approaches. This is where data-driven analysis, cause-effect relationships, and procedural frameworks live. Technical documents focus on "how things work" and provide clear, step-by-step guidance.',
    characteristics: [
      'Data-driven decision making',
      'Systematic processes and workflows',
      'Logical cause-effect relationships',
      'Measurable outcomes and metrics',
      'Structured problem-solving',
      'Process optimization',
    ],
    documents: [
      {
        id: 'tech-1',
        title: 'Systems Thinking Framework',
        description: 'Core principles of systems analysis and design',
        path: '/docs/technical/systems-thinking',
        category: 'Foundations',
      },
      {
        id: 'tech-2',
        title: 'Protocol Development Guide',
        description: 'How to create effective deployment protocols',
        path: '/docs/technical/protocol-development',
        category: 'Implementation',
      },
      {
        id: 'tech-3',
        title: 'Metrics & Measurement',
        description: 'Tracking success and system health',
        path: '/docs/technical/metrics',
        category: 'Evaluation',
      },
      {
        id: 'tech-4',
        title: 'Configuration Patterns',
        description: 'Common system configuration templates',
        path: '/docs/technical/patterns',
        category: 'Reference',
      },
    ],
    connectedEdges: [
      {
        fromVertex: 'technical',
        toVertex: 'emotional',
        title: 'Tech-Emotional Bridge',
        description: 'Humanizing systems: Making technical processes emotionally intelligent',
        path: '/docs/edges/tech-emotional',
      },
      {
        fromVertex: 'technical',
        toVertex: 'practical',
        title: 'Tech-Practical Bridge',
        description: 'Implementation: Converting theory into action',
        path: '/docs/edges/tech-practical',
      },
      {
        fromVertex: 'technical',
        toVertex: 'philosophical',
        title: 'Tech-Philosophical Bridge',
        description: 'Ethics of systems: Why we build what we build',
        path: '/docs/edges/tech-philosophical',
      },
    ],
  },
  emotional: {
    type: 'emotional',
    name: 'Emotional',
    color: VERTEX_COLORS.emotional.main,
    darkColor: VERTEX_COLORS.emotional.dark,
    icon: '💜',
    description: 'Feelings, relationships, and human connection',
    longDescription: 'The Emotional vertex honors the human experience—feelings, relationships, empathy, and connection. This is where we acknowledge that systems are made of people with emotions, needs, and interpersonal dynamics. Emotional documents focus on "how people feel" and provide guidance for navigating the human side of change.',
    characteristics: [
      'Empathy and emotional intelligence',
      'Relationship dynamics',
      'Feelings validation',
      'Interpersonal communication',
      'Psychological safety',
      'Attachment and bonding',
    ],
    documents: [
      {
        id: 'emo-1',
        title: 'Emotional Processing Guide',
        description: 'Supporting healthy emotional expression',
        path: '/docs/emotional/processing',
        category: 'Foundations',
      },
      {
        id: 'emo-2',
        title: 'Relationship Mapping',
        description: 'Understanding interpersonal dynamics',
        path: '/docs/emotional/relationships',
        category: 'Assessment',
      },
      {
        id: 'emo-3',
        title: 'Communication Patterns',
        description: 'Healthy dialogue and conflict resolution',
        path: '/docs/emotional/communication',
        category: 'Skills',
      },
      {
        id: 'emo-4',
        title: 'Attachment & Bonding',
        description: 'Building and maintaining secure connections',
        path: '/docs/emotional/attachment',
        category: 'Theory',
      },
    ],
    connectedEdges: [
      {
        fromVertex: 'emotional',
        toVertex: 'technical',
        title: 'Emotional-Tech Bridge',
        description: 'Measuring emotion: Data-driven empathy',
        path: '/docs/edges/emotional-tech',
      },
      {
        fromVertex: 'emotional',
        toVertex: 'practical',
        title: 'Emotional-Practical Bridge',
        description: 'Daily practices: Making feelings actionable',
        path: '/docs/edges/emotional-practical',
      },
      {
        fromVertex: 'emotional',
        toVertex: 'philosophical',
        title: 'Emotional-Philosophical Bridge',
        description: 'The meaning of connection: Why relationships matter',
        path: '/docs/edges/emotional-philosophical',
      },
    ],
  },
  practical: {
    type: 'practical',
    name: 'Practical',
    color: VERTEX_COLORS.practical.main,
    darkColor: VERTEX_COLORS.practical.dark,
    icon: '🛠️',
    description: 'Actions, tools, and real-world application',
    longDescription: 'The Practical vertex is about doing—concrete actions, tools, and real-world implementation. This is where theory becomes practice, where plans become reality. Practical documents focus on "what to do next" and provide actionable steps, tools, and exercises.',
    characteristics: [
      'Action-oriented approaches',
      'Concrete tools and exercises',
      'Step-by-step implementation',
      'Real-world examples',
      'Hands-on learning',
      'Immediate applicability',
    ],
    documents: [
      {
        id: 'prac-1',
        title: 'Action Planning Toolkit',
        description: 'Templates and tools for immediate use',
        path: '/docs/practical/toolkit',
        category: 'Tools',
      },
      {
        id: 'prac-2',
        title: 'Daily Practices',
        description: 'Routines and habits for system health',
        path: '/docs/practical/daily-practices',
        category: 'Routines',
      },
      {
        id: 'prac-3',
        title: 'Case Studies',
        description: 'Real-world implementation examples',
        path: '/docs/practical/case-studies',
        category: 'Examples',
      },
      {
        id: 'prac-4',
        title: 'Quick Reference Guide',
        description: 'Cheat sheets for common scenarios',
        path: '/docs/practical/quick-reference',
        category: 'Reference',
      },
    ],
    connectedEdges: [
      {
        fromVertex: 'practical',
        toVertex: 'technical',
        title: 'Practical-Tech Bridge',
        description: 'Process meets action: Systematizing practices',
        path: '/docs/edges/practical-tech',
      },
      {
        fromVertex: 'practical',
        toVertex: 'emotional',
        title: 'Practical-Emotional Bridge',
        description: 'Emotion in action: Practicing empathy',
        path: '/docs/edges/practical-emotional',
      },
      {
        fromVertex: 'practical',
        toVertex: 'philosophical',
        title: 'Practical-Philosophical Bridge',
        description: 'Values in action: Living your principles',
        path: '/docs/edges/practical-philosophical',
      },
    ],
  },
  philosophical: {
    type: 'philosophical',
    name: 'Philosophical',
    color: VERTEX_COLORS.philosophical.main,
    darkColor: VERTEX_COLORS.philosophical.dark,
    icon: '🔆',
    description: 'Meaning, values, and deeper purpose',
    longDescription: 'The Philosophical vertex explores the "why"—meaning, values, ethics, and purpose. This is where we examine our assumptions, question our approaches, and connect our work to deeper principles. Philosophical documents focus on "why it matters" and provide context, meaning, and ethical frameworks.',
    characteristics: [
      'Purpose and meaning-making',
      'Values clarification',
      'Ethical frameworks',
      'Big-picture thinking',
      'Existential questions',
      'Principle-based decision making',
    ],
    documents: [
      {
        id: 'phil-1',
        title: 'Core Values Framework',
        description: 'Identifying and honoring what matters most',
        path: '/docs/philosophical/values',
        category: 'Foundations',
      },
      {
        id: 'phil-2',
        title: 'Systems Ethics',
        description: 'Moral considerations in system design',
        path: '/docs/philosophical/ethics',
        category: 'Theory',
      },
      {
        id: 'phil-3',
        title: 'Purpose & Meaning',
        description: 'Finding significance in the work',
        path: '/docs/philosophical/purpose',
        category: 'Reflection',
      },
      {
        id: 'phil-4',
        title: 'Paradox Navigation',
        description: 'Holding tension between competing truths',
        path: '/docs/philosophical/paradox',
        category: 'Advanced',
      },
    ],
    connectedEdges: [
      {
        fromVertex: 'philosophical',
        toVertex: 'technical',
        title: 'Philosophical-Tech Bridge',
        description: 'Purpose-driven systems: Building with intention',
        path: '/docs/edges/philosophical-tech',
      },
      {
        fromVertex: 'philosophical',
        toVertex: 'emotional',
        title: 'Philosophical-Emotional Bridge',
        description: 'Meaningful connection: The philosophy of relationships',
        path: '/docs/edges/philosophical-emotional',
      },
      {
        fromVertex: 'philosophical',
        toVertex: 'practical',
        title: 'Philosophical-Practical Bridge',
        description: 'Principled action: Ethics in practice',
        path: '/docs/edges/philosophical-practical',
      },
    ],
  },
};
