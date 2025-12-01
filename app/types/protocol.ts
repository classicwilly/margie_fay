export interface ProtocolNode {
  name: string;
  age?: number;
  role: string;
  os: string; // operating system: technical, emotional, practical, analytical, etc.
}

export interface ProtocolTimeline {
  days: number;
  targetDate: string;
}

export interface ProtocolInput {
  structure: string;
  nodes: ProtocolNode[];
  currentState: string;
  timeline: ProtocolTimeline;
  stakeholders: string[];
  // Additional context from form
  structureType?: string;
  familySubType?: string;
  constraints?: string[];
  protocolNotes?: string;
}

export interface Milestone {
  day: number;
  date: string;
  title: string;
  description: string;
  responsible: string[];
}

export interface SuccessMetric {
  category: string;
  metric: string;
  target: string;
  measurement: string;
}

export interface IndividualProtocol {
  nodeName: string;
  role: string;
  operatingSystem: string;
  approach: string;
  deliveryMethod: string;
  keyMessages: string[];
  supportNeeds: string[];
  redFlags: string[];
}

export interface StakeholderTemplate {
  stakeholderType: string;
  purpose: string;
  template: string;
  frequency: string;
}

export interface ContingencyPlan {
  scenario: string;
  triggers: string[];
  response: string;
  escalation: string;
}

export interface GeneratedProtocol {
  masterOverview: string;
  individualProtocols: IndividualProtocol[];
  stakeholderTemplates: StakeholderTemplate[];
  timeline: Milestone[];
  successMetrics: SuccessMetric[];
  contingencyPlans: ContingencyPlan[];
  fullDocument: string;
}
