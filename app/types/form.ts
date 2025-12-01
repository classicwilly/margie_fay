export type StructureType = 'family' | 'team' | 'self' | 'org';

export type FamilySubType = 'divorce-separation' | 'intact';
export type TeamSubType = 'work-team';

export type SystemState = 'wye' | 'delta' | 'transition';

export type CustodyStatus = 'joint' | 'primary' | 'shared' | 'pending' | 'none';
export type CoParentRelationship = 'cooperative' | 'parallel' | 'conflicted' | 'no-contact';
export type LegalInvolvement = 'none' | 'mediation' | 'lawyers' | 'court-ordered' | 'active-litigation';
export type CommunicationPattern = 'open' | 'selective' | 'avoidant' | 'aggressive' | 'passive-aggressive';
export type ReportingStructure = 'flat' | 'hierarchical' | 'matrix' | 'hybrid';

export interface Node {
  id: string;
  name: string;
  role: string;
  operatingSystem: string;
}

export interface Stakeholder {
  id: string;
  name: string;
  relationship: string;
  influence: 'high' | 'medium' | 'low';
}

// Conditional data structures based on structure type
export interface FamilyDivorceSeparationData {
  custodyStatus: CustodyStatus;
  custodyDetails: string;
  coParentRelationship: CoParentRelationship;
  relationshipNotes: string;
  childrenAges: number[];
  legalInvolvement: LegalInvolvement;
  legalDetails: string;
}

export interface FamilyIntactData {
  stressPoints: string[];
  stressDescription: string;
  communicationPattern: CommunicationPattern;
  communicationNotes: string;
  recentChanges: string[];
  changeDescription: string;
}

export interface WorkTeamData {
  teamSize: number;
  reportingStructure: ReportingStructure;
  structureDetails: string;
  currentDysfunction: string[];
  dysfunctionDescription: string;
}

export interface FormData {
  // Step 1: Structure Identification
  structureType: StructureType;
  structureDescription: string;
  
  // Sub-type based on structure
  familySubType?: FamilySubType;
  teamSubType?: TeamSubType;
  
  // Conditional Step 2 data
  familyDivorceSeparation?: FamilyDivorceSeparationData;
  familyIntact?: FamilyIntactData;
  workTeam?: WorkTeamData;
  
  // Step 2: Node Count and Details
  nodeCount: number;
  nodes: Node[];
  
  // Step 3: Current State Assessment
  currentState: SystemState;
  stateDescription: string;
  
  // Step 4: Operating System Identification
  // (handled in nodes array)
  
  // Step 5: Stakeholder Identification
  stakeholders: Stakeholder[];
  
  // Step 6: Timeline and Constraints
  timelineStart: string;
  timelineEnd: string;
  constraints: string[];
  
  // Step 7: Protocol Generation
  protocolNotes: string;
}

export type StepData = Partial<FormData>;
