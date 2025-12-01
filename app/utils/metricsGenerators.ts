import { ProtocolInput, SuccessMetric } from '../types/protocol';
import { calculateMilestones } from '../utils/protocolHelpers';

/**
 * Generate timeline with milestones
 */
export function generateTimeline(input: ProtocolInput): string {
  const milestones = calculateMilestones(input);

  let timeline = `# Timeline & Milestones

**Total Duration**: ${input.timeline.days} days
**Target Completion**: ${input.timeline.targetDate}
**Number of Checkpoints**: ${milestones.length}

`;

  milestones.forEach((milestone, index) => {
    timeline += `## ${milestone.title}
**Day ${milestone.day}** - ${milestone.date}

${milestone.description}

**Responsible**: ${milestone.responsible.join(', ')}

`;

    // Add spacing between milestones
    if (index < milestones.length - 1) {
      timeline += `---

`;
    }
  });

  return timeline;
}

/**
 * Generate success metrics dashboard
 */
export function generateSuccessMetrics(input: ProtocolInput): SuccessMetric[] {
  const metrics: SuccessMetric[] = [];

  // Communication metrics
  metrics.push({
    category: 'Communication',
    metric: 'Communication Quality',
    target: 'All scheduled communications completed on time',
    measurement: 'Track completion rate of scheduled check-ins and updates',
  });

  metrics.push({
    category: 'Communication',
    metric: 'Conflict Resolution',
    target: 'Conflicts resolved within 48 hours',
    measurement: 'Time from conflict identification to resolution',
  });

  // Node wellbeing metrics
  input.nodes.forEach(node => {
    const isChild = node.role.toLowerCase().includes('child') || (node.age && node.age < 18);

    if (isChild) {
      metrics.push({
        category: 'Wellbeing',
        metric: `${node.name} - Adjustment`,
        target: 'No red flags observed; stable routine maintained',
        measurement: 'Weekly behavior checklist and teacher/caregiver feedback',
      });
    } else {
      metrics.push({
        category: 'Wellbeing',
        metric: `${node.name} - Adaptation`,
        target: 'Demonstrates understanding and engagement with protocol',
        measurement: 'Self-reported stress levels and protocol adherence',
      });
    }
  });

  // Timeline adherence
  metrics.push({
    category: 'Progress',
    metric: 'Milestone Achievement',
    target: 'All major milestones completed within ±3 days',
    measurement: 'Percentage of milestones completed on schedule',
  });

  // System stability
  metrics.push({
    category: 'System Health',
    metric: 'Protocol Adherence',
    target: '80%+ adherence to agreed protocols',
    measurement: 'Weekly self-assessment and observation logs',
  });

  metrics.push({
    category: 'System Health',
    metric: 'Stakeholder Satisfaction',
    target: 'Positive feedback from all active stakeholders',
    measurement: 'Monthly stakeholder survey or check-in',
  });

  // Contingency activation
  metrics.push({
    category: 'Risk Management',
    metric: 'Contingency Plan Usage',
    target: 'Less than 2 contingency activations',
    measurement: 'Log of contingency plan invocations and outcomes',
  });

  return metrics;
}

/**
 * Format success metrics as markdown
 */
export function formatSuccessMetrics(metrics: SuccessMetric[]): string {
  let output = `# Success Metrics Dashboard

This dashboard tracks key performance indicators for the protocol deployment.

`;

  // Group metrics by category
  const categories = [...new Set(metrics.map(m => m.category))];

  categories.forEach(category => {
    const categoryMetrics = metrics.filter(m => m.category === category);

    output += `## ${category}

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
`;

    categoryMetrics.forEach(metric => {
      output += `| ${metric.metric} | ${metric.target} | ${metric.measurement} |
`;
    });

    output += `
`;
  });

  output += `## Tracking Template

Use this template to log weekly progress:

\`\`\`
Week: [Date Range]

Communication Quality: ☐ On Track ☐ Needs Attention ☐ Critical
Notes: ___________________________________________

Wellbeing Indicators:
${metrics.filter(m => m.category === 'Wellbeing').map(m => `- ${m.metric}: ☐ Green ☐ Yellow ☐ Red`).join('\n')}

Milestone Progress: _____% complete
Protocol Adherence: _____% 

Action Items:
1. ___________________________________________
2. ___________________________________________
3. ___________________________________________
\`\`\`

---
`;

  return output;
}
