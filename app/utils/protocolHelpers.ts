import { ProtocolInput, Milestone } from '../types/protocol';

/**
 * Calculate milestones based on timeline
 */
export function calculateMilestones(input: ProtocolInput): Milestone[] {
  const { timeline, nodes } = input;
  const startDate = new Date();
  // targetDate calculation removed
  const totalDays = timeline.days;

  const milestones: Milestone[] = [];

  // Initial Assessment (Day 1)
  milestones.push({
    day: 1,
    date: formatDate(addDays(startDate, 0)),
    title: 'Initial Assessment & Kickoff',
    description: 'Complete baseline assessment and communicate protocol to all nodes',
    responsible: ['All Nodes'],
  });

  // Early Phase Checkpoint (25% mark)
  const day25 = Math.floor(totalDays * 0.25);
  milestones.push({
    day: day25,
    date: formatDate(addDays(startDate, day25 - 1)),
    title: 'Early Phase Checkpoint',
    description: 'Review initial responses, adjust delivery methods if needed',
    responsible: ['Primary Nodes'],
  });

  // Mid-Point Review (50% mark)
  const day50 = Math.floor(totalDays * 0.5);
  milestones.push({
    day: day50,
    date: formatDate(addDays(startDate, day50 - 1)),
    title: 'Mid-Point Review',
    description: 'Comprehensive review of progress, stakeholder check-ins',
    responsible: nodes.map(n => n.name),
  });

  // Late Phase Checkpoint (75% mark)
  const day75 = Math.floor(totalDays * 0.75);
  milestones.push({
    day: day75,
    date: formatDate(addDays(startDate, day75 - 1)),
    title: 'Late Phase Checkpoint',
    description: 'Final adjustments, prepare for completion',
    responsible: nodes.map(n => n.name),
  });

  // Final Assessment
  milestones.push({
    day: totalDays,
    date: timeline.targetDate,
    title: 'Final Assessment & Target Achievement',
    description: 'Complete final evaluation, measure success metrics, celebrate progress',
    responsible: ['All Nodes', 'All Stakeholders'],
  });

  return milestones;
}

/**
 * Format date as YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Add days to a date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Get operating system approach
 */
export function getOSApproach(os: string): {
  approach: string;
  deliveryMethod: string;
  keyStrengths: string[];
} {
  const osLower = os.toLowerCase();

  const approaches: Record<string, { approach: string; deliveryMethod: string; keyStrengths: string[] }> = {
    technical: {
      approach: 'Data-driven, logical presentation with clear cause-effect relationships',
      deliveryMethod: 'Written documentation, charts, step-by-step plans',
      keyStrengths: ['Problem-solving', 'Systematic thinking', 'Process orientation'],
    },
    emotional: {
      approach: 'Empathetic, feeling-centered communication with emotional validation',
      deliveryMethod: 'One-on-one conversations, check-ins, emotional support',
      keyStrengths: ['Empathy', 'Relationship building', 'Emotional intelligence'],
    },
    practical: {
      approach: 'Action-oriented, concrete examples with immediate applications',
      deliveryMethod: 'Hands-on activities, visual demonstrations, practical exercises',
      keyStrengths: ['Action orientation', 'Concrete thinking', 'Hands-on learning'],
    },
    analytical: {
      approach: 'Research-based, detailed analysis with comprehensive information',
      deliveryMethod: 'Reports, data analysis, detailed briefings',
      keyStrengths: ['Critical thinking', 'Detail orientation', 'Research skills'],
    },
  };

  return approaches[osLower] || approaches.practical;
}

/**
 * Get role-specific guidance
 */
export function getRoleGuidance(role: string, age?: number): {
  keyMessages: string[];
  supportNeeds: string[];
  redFlags: string[];
} {
  const roleLower = role.toLowerCase();

  if (roleLower.includes('child') || (age && age < 18)) {
    return {
      keyMessages: [
        'Age-appropriate explanation of changes',
        'Reassurance of continued love and support',
        'Clear expectations about what will/won\'t change',
        'Validation of feelings and concerns',
      ],
      supportNeeds: [
        'Consistent routines',
        'Safe space to express feelings',
        'Age-appropriate books/resources',
        'Professional counseling if needed',
      ],
      redFlags: [
        'Withdrawal from activities',
        'Changes in sleep/eating patterns',
        'Academic performance decline',
        'Aggressive or regressive behavior',
      ],
    };
  }

  if (roleLower.includes('parent')) {
    return {
      keyMessages: [
        'Focus on co-parenting effectiveness',
        'Maintain consistency for children',
        'Establish clear boundaries and communication protocols',
        'Prioritize children\'s wellbeing',
      ],
      supportNeeds: [
        'Co-parenting plan and schedule',
        'Communication tools/platforms',
        'Legal guidance as needed',
        'Personal support network',
      ],
      redFlags: [
        'Communication breakdown',
        'Inconsistent parenting approaches',
        'Using children as messengers',
        'Inability to separate couple issues from parenting',
      ],
    };
  }

  // Default for other roles
  return {
    keyMessages: [
      'Clear role definition and expectations',
      'Transparent communication about changes',
      'Respect for boundaries',
      'Collaborative approach to challenges',
    ],
    supportNeeds: [
      'Regular communication',
      'Clear documentation',
      'Access to resources',
      'Defined escalation paths',
    ],
    redFlags: [
      'Confusion about role/responsibilities',
      'Communication gaps',
      'Boundary violations',
      'Unresolved conflicts',
    ],
  };
}

/**
 * Get structure-specific context
 */
export function getStructureContext(structureType: string): {
  focus: string;
  challenges: string[];
  priorities: string[];
} {
  const contexts: Record<string, { focus: string; challenges: string[]; priorities: string[] }> = {
    'family-divorce': {
      focus: 'Minimizing disruption while establishing healthy new patterns',
      challenges: ['Co-parent communication', 'Child adjustment', 'Legal complexities', 'Emotional processing'],
      priorities: ['Child wellbeing', 'Clear boundaries', 'Effective communication', 'Legal compliance'],
    },
    'family-intact': {
      focus: 'Strengthening communication and addressing stress points',
      challenges: ['Communication patterns', 'Stress management', 'Change adaptation', 'Role clarity'],
      priorities: ['Open dialogue', 'Stress reduction', 'Family cohesion', 'Healthy boundaries'],
    },
    'work-team': {
      focus: 'Building trust and improving team effectiveness',
      challenges: ['Trust issues', 'Conflict avoidance', 'Accountability gaps', 'Result focus'],
      priorities: ['Team trust', 'Clear roles', 'Accountability', 'Performance metrics'],
    },
  };

  return contexts[structureType] || {
    focus: 'System stabilization and improved functioning',
    challenges: ['Communication', 'Role clarity', 'Change management'],
    priorities: ['Clarity', 'Consistency', 'Communication'],
  };
}
