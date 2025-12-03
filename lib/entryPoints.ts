/**
 * Entry Points Architecture
 * 
 * Multiple paths in. One destination.
 * Meet people where they are, not where we want them to be.
 */

export type EntryPoint = 
  | 'crisis'           // "I need help NOW"
  | 'parenting'        // "Co-parenting is chaos"
  | 'kids'             // "My child is struggling"
  | 'community'        // "We need to coordinate"
  | 'learning'         // "I want to understand systems"
  | 'builder'          // "I want to create tools"
  | 'protocol';        // "I understand the mission, deploy it"

export interface EntryPointConfig {
  id: EntryPoint;
  title: string;
  tagline: string;
  painPoint: string;
  immediateAction: string;
  moduleId: string;
  route: string;
  icon: string;
  color: string;
  journey: {
    step1: string;
    step2: string;
    step3: string;
    revelation: string;
  };
}

/**
 * Entry Point Configurations
 * 
 * Each entry point:
 * - Addresses immediate pain
 * - Provides practical tool
 * - Reveals deeper pattern
 * - Leads to tetrahedron
 */
export const ENTRY_POINTS: Record<EntryPoint, EntryPointConfig> = {
  crisis: {
    id: 'crisis',
    title: 'I Need Help Now',
    tagline: 'Immediate support when everything feels overwhelming',
    painPoint: 'You\'re in crisis. You need someone. Fast.',
    immediateAction: 'Broadcast your status. Alert your people.',
    moduleId: 'status',
    route: '/modules/status',
    icon: '🚨',
    color: 'red',
    journey: {
      step1: 'Set status to RED → your support team gets notified',
      step2: 'See crisis resources → call/text hotlines immediately',
      step3: 'Identify your 4 people → who can you actually reach right now?',
      revelation: 'Crisis reveals who\'s really there. Build that redundancy BEFORE next crisis.'
    }
  },

  parenting: {
    id: 'parenting',
    title: 'Co-Parenting Is Chaos',
    tagline: 'Coordinate custody, communicate better, reduce conflict',
    painPoint: 'Every handoff is a fight. Communication is toxic. Kids are caught in the middle.',
    immediateAction: 'Start with structured messaging. Custody calendar. Transition checklists.',
    moduleId: 'parenting',
    route: '/modules/parenting',
    icon: '👨‍👩‍👧',
    color: 'blue',
    journey: {
      step1: 'Use message templates → reduce conflict in communication',
      step2: 'Add custody schedule → kids see what\'s coming, less anxiety',
      step3: 'Align on house rules → consistency across both homes',
      revelation: 'You can\'t co-parent alone. You need 4 people supporting each parent. That\'s 8 vertices in the system.'
    }
  },

  kids: {
    id: 'kids',
    title: 'My Child Is Struggling',
    tagline: 'Help kids understand their support system',
    painPoint: 'Your child is anxious, withdrawn, or acting out. They feel alone.',
    immediateAction: 'Show them their support team. Age-appropriate content.',
    moduleId: 'kids',
    route: '/kids',
    icon: '🌟',
    color: 'purple',
    journey: {
      step1: 'Age-appropriate explanation → they understand they\'re not alone',
      step2: 'Identify their 4 people → they know who to turn to',
      step3: 'Activities and check-ins → they practice reaching out',
      revelation: 'Kids need their own tetrahedron. Not your support team. THEIR support team.'
    }
  },

  community: {
    id: 'community',
    title: 'Our Neighborhood Needs Coordination',
    tagline: 'Organize events, share resources, build resilience',
    painPoint: 'Everyone\'s busy. No one knows what\'s happening. Community feels disconnected.',
    immediateAction: 'Start with shared calendar. Coordinate events.',
    moduleId: 'calendar',
    route: '/modules/calendar',
    icon: '📅',
    color: 'green',
    journey: {
      step1: 'Shared calendar → everyone sees what\'s happening',
      step2: 'Coordinate pickups, events, resource sharing',
      step3: 'Four families start helping each other regularly',
      revelation: '4 families = 16 people = stable mesh. Scale to 4 neighborhoods = 64 people. Fractal.'
    }
  },

  learning: {
    id: 'learning',
    title: 'I Want to Understand Systems',
    tagline: 'Deep dive into family systems theory and practice',
    painPoint: 'You\'re a therapist, student, or curious human. You want the theory.',
    immediateAction: 'Start with the four vertices. Read the documentation.',
    moduleId: 'docs',
    route: '/docs',
    icon: '📚',
    color: 'amber',
    journey: {
      step1: 'Technical vertex → understand the structure',
      step2: 'Emotional vertex → feel the pattern',
      step3: 'Practical vertex → apply the tools',
      revelation: 'Theory without practice is useless. Practice without theory is blind. You need both.'
    }
  },

  builder: {
    id: 'builder',
    title: 'I Want to Build Tools',
    tagline: 'Create modules for your community\'s specific needs',
    painPoint: 'You have a specific use case. The existing modules don\'t quite fit.',
    immediateAction: 'Use the module creator. Build what you need.',
    moduleId: 'creator',
    route: '/modules/creator',
    icon: '🔧',
    color: 'indigo',
    journey: {
      step1: 'Define your four vertices → what are the core components?',
      step2: 'Build the module → use the template, test locally',
      step3: 'Share with community → others fork and customize',
      revelation: 'Infrastructure is what you make of it. Build for your context. Share what works.'
    }
  },

  protocol: {
    id: 'protocol',
    title: 'I Understand the Mission',
    tagline: 'Deploy the full protocol infrastructure',
    painPoint: 'You get it. Wye→Delta. Mesh topology. You\'re ready.',
    immediateAction: 'Deploy your tetrahedron. Install all modules. Go.',
    moduleId: 'hub',
    route: '/hub',
    icon: '▲',
    color: 'slate',
    journey: {
      step1: 'Configure your 4 vertices → identify your support team',
      step2: 'Install modules → calendar, status, parenting, kids',
      step3: 'Invite your tetrahedron → they install their modules',
      revelation: 'You\'re not deploying for yourself. You\'re deploying for humanity. Fractal from 4 to millions.'
    }
  }
};

/**
 * Entry Point Router
 * 
 * Analyzes user's stated need and routes to appropriate entry point
 */
export function routeToEntryPoint(userInput: string): EntryPoint {
  const input = userInput.toLowerCase();

  // Crisis patterns
  if (
    input.includes('crisis') ||
    input.includes('emergency') ||
    input.includes('help now') ||
    input.includes('suicide') ||
    input.includes('hurt myself')
  ) {
    return 'crisis';
  }

  // Parenting patterns
  if (
    input.includes('co-parent') ||
    input.includes('custody') ||
    input.includes('divorce') ||
    input.includes('separated') ||
    input.includes('ex-partner') ||
    input.includes('handoff')
  ) {
    return 'parenting';
  }

  // Kids patterns
  if (
    input.includes('my child') ||
    input.includes('my kid') ||
    input.includes('my son') ||
    input.includes('my daughter') ||
    input.includes('struggling') ||
    input.includes('anxious child')
  ) {
    return 'kids';
  }

  // Community patterns
  if (
    input.includes('neighborhood') ||
    input.includes('community') ||
    input.includes('organize') ||
    input.includes('coordinate') ||
    input.includes('neighbors')
  ) {
    return 'community';
  }

  // Learning patterns
  if (
    input.includes('learn') ||
    input.includes('theory') ||
    input.includes('understand') ||
    input.includes('study') ||
    input.includes('therapist') ||
    input.includes('documentation')
  ) {
    return 'learning';
  }

  // Builder patterns
  if (
    input.includes('build') ||
    input.includes('create') ||
    input.includes('developer') ||
    input.includes('custom') ||
    input.includes('module')
  ) {
    return 'builder';
  }

  // Protocol patterns
  if (
    input.includes('deploy') ||
    input.includes('protocol') ||
    input.includes('tetrahedron') ||
    input.includes('mesh') ||
    input.includes('wye') ||
    input.includes('delta')
  ) {
    return 'protocol';
  }

  // Default: Show them all entry points
  return 'learning';
}

/**
 * Get recommended next steps based on current entry point
 */
export function getNextSteps(currentEntry: EntryPoint): EntryPoint[] {
  const progressionPaths: Record<EntryPoint, EntryPoint[]> = {
    crisis: ['kids', 'parenting', 'protocol'],
    parenting: ['kids', 'community', 'protocol'],
    kids: ['parenting', 'learning', 'protocol'],
    community: ['parenting', 'builder', 'protocol'],
    learning: ['builder', 'parenting', 'protocol'],
    builder: ['community', 'learning', 'protocol'],
    protocol: ['builder', 'community', 'learning']
  };

  return progressionPaths[currentEntry];
}
