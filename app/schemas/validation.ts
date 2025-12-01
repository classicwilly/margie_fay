import { z } from 'zod';

// Step 1: Structure Identification (updated with sub-types)
export const step1Schema = z.object({
  structureType: z.enum(['family', 'team', 'self', 'org'], {
    message: 'Please select a structure type',
  }),
  structureDescription: z.string().min(10, {
    message: 'Please provide at least 10 characters describing your structure',
  }),
  familySubType: z.enum(['divorce-separation', 'intact']).optional(),
  teamSubType: z.enum(['work-team']).optional(),
}).superRefine((data, ctx) => {
  // Require family sub-type if structure is family
  if (data.structureType === 'family' && !data.familySubType) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please select a family type',
      path: ['familySubType'],
    });
  }
  // Require team sub-type if structure is team
  if (data.structureType === 'team' && !data.teamSubType) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please select a team type',
      path: ['teamSubType'],
    });
  }
});

// Step 2a: Family (Divorce/Separation) Details
export const familyDivorceSeparationSchema = z.object({
  custodyStatus: z.enum(['joint', 'primary', 'shared', 'pending', 'none'], {
    message: 'Please select custody status',
  }),
  custodyDetails: z.string().min(10, 'Please provide custody details (min 10 characters)'),
  coParentRelationship: z.enum(['cooperative', 'parallel', 'conflicted', 'no-contact'], {
    message: 'Please select co-parent relationship type',
  }),
  relationshipNotes: z.string().min(10, 'Please describe the relationship (min 10 characters)'),
  childrenAges: z.array(z.number().min(0).max(25)).min(1, 'Please add at least one child'),
  legalInvolvement: z.enum(['none', 'mediation', 'lawyers', 'court-ordered', 'active-litigation'], {
    message: 'Please select legal involvement level',
  }),
  legalDetails: z.string().min(10, 'Please provide legal details (min 10 characters)'),
});

// Step 2b: Family (Intact) Details
export const familyIntactSchema = z.object({
  stressPoints: z.array(z.string()).min(1, 'Please identify at least one stress point'),
  stressDescription: z.string().min(20, 'Please describe stress points in detail (min 20 characters)'),
  communicationPattern: z.enum(['open', 'selective', 'avoidant', 'aggressive', 'passive-aggressive'], {
    message: 'Please select communication pattern',
  }),
  communicationNotes: z.string().min(20, 'Please describe communication patterns (min 20 characters)'),
  recentChanges: z.array(z.string()).min(1, 'Please identify at least one recent change'),
  changeDescription: z.string().min(20, 'Please describe recent changes (min 20 characters)'),
});

// Step 2c: Work Team Details
export const workTeamSchema = z.object({
  teamSize: z.number().min(2, 'Team must have at least 2 members').max(100, 'Maximum team size is 100'),
  reportingStructure: z.enum(['flat', 'hierarchical', 'matrix', 'hybrid'], {
    message: 'Please select reporting structure',
  }),
  structureDetails: z.string().min(20, 'Please describe the structure (min 20 characters)'),
  currentDysfunction: z.array(z.string()).min(1, 'Please identify at least one dysfunction'),
  dysfunctionDescription: z.string().min(20, 'Please describe the dysfunction (min 20 characters)'),
});

// Old Step 2 renamed to Step 3: Node Count and Details
export const nodeSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  operatingSystem: z.string().min(1, 'Operating system is required'),
});

export const step3Schema = z.object({
  nodeCount: z.number().min(1, 'At least one node is required').max(50, 'Maximum 50 nodes allowed'),
  nodes: z.array(nodeSchema).min(1, 'At least one node is required'),
});

// Step 4: Current State Assessment
export const step4Schema = z.object({
  currentState: z.enum(['wye', 'delta', 'transition'], {
    message: 'Please select the current state',
  }),
  stateDescription: z.string().min(10, {
    message: 'Please provide at least 10 characters describing the current state',
  }),
});

// Step 5: Operating System (embedded in step 3)
export const step5Schema = z.object({
  nodes: z.array(nodeSchema).refine(
    (nodes) => nodes.every(node => node.operatingSystem.length > 0),
    { message: 'All nodes must have an operating system assigned' }
  ),
});

// Step 6: Stakeholder Identification
export const stakeholderSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  relationship: z.string().min(1, 'Relationship is required'),
  influence: z.enum(['high', 'medium', 'low'], {
    message: 'Please select influence level',
  }),
});

export const step6Schema = z.object({
  stakeholders: z.array(stakeholderSchema).min(1, 'At least one stakeholder is required'),
});

// Step 7: Timeline and Constraints (now step 7 instead of 6)
export const step7Schema = z.object({
  timelineStart: z.string().min(1, 'Start date is required'),
  timelineEnd: z.string().min(1, 'End date is required'),
  constraints: z.array(z.string()).min(1, 'At least one constraint is required'),
}).refine(
  (data) => new Date(data.timelineEnd) > new Date(data.timelineStart),
  { message: 'End date must be after start date', path: ['timelineEnd'] }
);

// Step 8: Protocol Generation (now step 8 instead of 7)
export const step8Schema = z.object({
  protocolNotes: z.string().min(20, {
    message: 'Please provide at least 20 characters for protocol notes',
  }),
});

export type Step1Data = z.infer<typeof step1Schema>;
export type FamilyDivorceSeparationData = z.infer<typeof familyDivorceSeparationSchema>;
export type FamilyIntactData = z.infer<typeof familyIntactSchema>;
export type WorkTeamData = z.infer<typeof workTeamSchema>;
export type Step3Data = z.infer<typeof step3Schema>;
export type Step4Data = z.infer<typeof step4Schema>;
export type Step5Data = z.infer<typeof step5Schema>;
export type Step6Data = z.infer<typeof step6Schema>;
export type Step7Data = z.infer<typeof step7Schema>;
export type Step8Data = z.infer<typeof step8Schema>;

