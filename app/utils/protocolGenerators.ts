import {
  ProtocolInput,
  IndividualProtocol,
  StakeholderTemplate,
  ContingencyPlan,
} from '../types/protocol';
import { getOSApproach, getRoleGuidance, getStructureContext } from '../utils/protocolHelpers';

/**
 * Generate master protocol overview
 */
export function generateMasterOverview(input: ProtocolInput): string {
  const context = getStructureContext(input.structure);
  const nodeCount = input.nodes.length;
  const stakeholderCount = input.stakeholders.length;

  return `# Master Protocol Overview

## System Configuration
- **Structure Type**: ${input.structure}
- **Current State**: ${input.currentState}
- **Number of Nodes**: ${nodeCount}
- **Active Stakeholders**: ${stakeholderCount}
- **Timeline**: ${input.timeline.days} days (Target: ${input.timeline.targetDate})

## Primary Focus
${context.focus}

## Key Challenges to Address
${context.challenges.map((c, i) => `${i + 1}. ${c}`).join('\n')}

## Strategic Priorities
${context.priorities.map((p, i) => `${i + 1}. ${p}`).join('\n')}

## Protocol Objectives
1. **Stability**: Establish predictable patterns and clear expectations
2. **Communication**: Create effective channels for all nodes and stakeholders
3. **Adaptation**: Support healthy adjustment to changes
4. **Measurement**: Track progress through defined success metrics
5. **Resilience**: Build capacity to handle setbacks and challenges

## Implementation Approach
This protocol uses a **phased deployment strategy** tailored to each node's operating system and role. Individual protocols are customized based on:
- Operating system compatibility (technical, emotional, practical, analytical)
- Role-specific needs and responsibilities
- Age-appropriate delivery (where applicable)
- Stakeholder involvement and oversight

${input.protocolNotes ? `\n## Additional Context\n${input.protocolNotes}\n` : ''}

---
`;
}

/**
 * Generate individual delivery protocols
 */
export function generateIndividualProtocols(input: ProtocolInput): IndividualProtocol[] {
  return input.nodes.map(node => {
    const osInfo = getOSApproach(node.os);
    const roleInfo = getRoleGuidance(node.role, node.age);

    return {
      nodeName: node.name,
      role: node.role,
      operatingSystem: node.os,
      approach: osInfo.approach,
      deliveryMethod: osInfo.deliveryMethod,
      keyMessages: roleInfo.keyMessages,
      supportNeeds: roleInfo.supportNeeds,
      redFlags: roleInfo.redFlags,
    };
  });
}

/**
 * Format individual protocol as markdown
 */
export function formatIndividualProtocol(protocol: IndividualProtocol, index: number): string {
  return `## ${index + 1}. ${protocol.nodeName} - ${protocol.role}

### Operating System: ${protocol.operatingSystem}
**Approach**: ${protocol.approach}

**Delivery Method**: ${protocol.deliveryMethod}

### Key Messages
${protocol.keyMessages.map((msg, i) => `${i + 1}. ${msg}`).join('\n')}

### Support Needs
${protocol.supportNeeds.map((need) => `- ${need}`).join('\n')}

### Red Flags to Monitor
${protocol.redFlags.map((flag) => `⚠️ ${flag}`).join('\n')}

---
`;
}

/**
 * Generate stakeholder communication templates
 */
export function generateStakeholderTemplates(input: ProtocolInput): StakeholderTemplate[] {
  const templates: StakeholderTemplate[] = [];

  input.stakeholders.forEach(stakeholder => {
    const stakeholderLower = stakeholder.toLowerCase();

    if (stakeholderLower.includes('legal')) {
      templates.push({
        stakeholderType: 'Legal Representatives',
        purpose: 'Maintain compliance and documentation',
        frequency: 'As needed / Major milestones',
        template: `Subject: Protocol Update - [Date]

Dear [Legal Representative],

This update covers progress on the family systems protocol:

**Timeline Status**: Day [X] of ${input.timeline.days}
**Compliance Items**: [List any legal requirements being addressed]
**Documentation**: [Attach relevant records/agreements]
**Questions/Concerns**: [Any legal guidance needed]

Next scheduled update: [Date]

Best regards,
[Name]`,
      });
    }

    if (stakeholderLower.includes('extended') || stakeholderLower.includes('family')) {
      templates.push({
        stakeholderType: 'Extended Family',
        purpose: 'Keep support network informed and aligned',
        frequency: 'Weekly or bi-weekly',
        template: `Subject: Family Update - [Date]

Dear Family,

Here's an update on how everyone is doing:

**Overall Progress**: [Brief summary]
**What's Going Well**: [Positive developments]
**Current Focus**: [What we're working on this week]
**How You Can Help**: [Specific support requests, if any]

Thank you for your continued support.

Love,
[Name]`,
      });
    }

    if (stakeholderLower.includes('school') || stakeholderLower.includes('education')) {
      templates.push({
        stakeholderType: 'School/Educational',
        purpose: 'Ensure consistent support for children',
        frequency: 'Monthly or as needed',
        template: `Subject: Student Support Update - [Child Name]

Dear [Teacher/Counselor],

This is an update regarding [Child Name]'s current situation:

**Family Status**: [Brief context]
**Current Observations**: [Any changes in behavior/performance]
**Support in Place**: [What we're doing at home]
**Requested Support**: [How school can help]

Please contact me if you notice any concerns.

Thank you,
[Parent Name]`,
      });
    }

    if (stakeholderLower.includes('therapist') || stakeholderLower.includes('counselor')) {
      templates.push({
        stakeholderType: 'Therapeutic Professionals',
        purpose: 'Coordinate care and track progress',
        frequency: 'Per treatment plan',
        template: `Subject: Client Progress - [Name]

Dear [Therapist],

Progress update for [Client Name]:

**Protocol Milestones**: [Recent achievements]
**Challenges**: [Current difficulties]
**Behavioral Observations**: [Changes noticed]
**Questions**: [Treatment guidance needed]

Next session: [Date]

Regards,
[Name]`,
      });
    }
  });

  // Default template if no specific stakeholders matched
  if (templates.length === 0) {
    templates.push({
      stakeholderType: 'General Stakeholders',
      purpose: 'Maintain transparency and collaboration',
      frequency: 'Regular intervals',
      template: `Subject: Protocol Update - [Date]

Dear Stakeholder,

**Current Status**: [Summary]
**Progress**: [Key achievements]
**Next Steps**: [Upcoming focus]
**Support Needed**: [Any requests]

Thank you for your involvement.

Best,
[Name]`,
    });
  }

  return templates;
}

/**
 * Format stakeholder template as markdown
 */
export function formatStakeholderTemplate(template: StakeholderTemplate, index: number): string {
  return `## ${index + 1}. ${template.stakeholderType}

**Purpose**: ${template.purpose}
**Frequency**: ${template.frequency}

### Template

\`\`\`
${template.template}
\`\`\`

---
`;
}

/**
 * Generate contingency plans
 */
export function generateContingencyPlans(input: ProtocolInput): ContingencyPlan[] {
  const plans: ContingencyPlan[] = [];

  // Communication breakdown plan
  plans.push({
    scenario: 'Communication Breakdown',
    triggers: [
      'Repeated missed communications',
      'Escalating conflict',
      'Misinterpretation of agreements',
    ],
    response: `1. Pause and de-escalate
2. Return to written documentation
3. Engage neutral third party if needed
4. Revisit communication protocols
5. Implement cooling-off period if necessary`,
    escalation: 'If unresolved after 3 attempts, engage mediator or counselor',
  });

  // Child/dependent distress plan
  if (input.nodes.some(n => n.role.toLowerCase().includes('child') || (n.age && n.age < 18))) {
    plans.push({
      scenario: 'Child/Dependent Distress',
      triggers: [
        'Behavioral changes',
        'Academic performance decline',
        'Expressed anxiety or depression',
        'Physical symptoms of stress',
      ],
      response: `1. Immediate one-on-one check-in
2. Validate feelings and concerns
3. Adjust protocol delivery pace if needed
4. Increase support and monitoring
5. Consider professional assessment`,
      escalation: 'Contact pediatrician or mental health professional within 48 hours if symptoms persist',
    });
  }

  // Timeline pressure plan
  plans.push({
    scenario: 'Timeline Pressure / Milestone Delay',
    triggers: [
      'Falling behind scheduled milestones',
      'External deadline changes',
      'Unexpected obstacles',
    ],
    response: `1. Assess root cause of delay
2. Reprioritize objectives if needed
3. Redistribute responsibilities
4. Extend timeline if feasible
5. Focus on critical path items`,
    escalation: 'Review protocol viability if more than 2 major milestones are missed',
  });

  // Stakeholder conflict plan
  if (input.stakeholders.length > 0) {
    plans.push({
      scenario: 'Stakeholder Conflict or Misalignment',
      triggers: [
        'Contradictory advice from stakeholders',
        'Stakeholder interference',
        'Loss of stakeholder support',
      ],
      response: `1. Document the conflict/concern
2. Schedule alignment meeting
3. Clarify roles and boundaries
4. Revisit shared objectives
5. Establish clear decision-making authority`,
      escalation: 'Consider mediation or replacement if stakeholder relationship cannot be repaired',
    });
  }

  return plans;
}

/**
 * Format contingency plan as markdown
 */
export function formatContingencyPlan(plan: ContingencyPlan, index: number): string {
  return `## ${index + 1}. ${plan.scenario}

### Triggers
${plan.triggers.map(t => `- ${t}`).join('\n')}

### Response Protocol
${plan.response}

### Escalation
${plan.escalation}

---
`;
}
