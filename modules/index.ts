/**
 * Export all module classes for easy importing
 */

export { CalendarModule } from './calendar/CalendarModule';
export { StatusModule } from './status/StatusModule';
export { ParentingModule } from './parenting/ParentingModule';
export { KidsModule } from './kids/KidsModule';

export type { CalendarEvent } from './calendar/CalendarModule';
export type { 
  AvailabilityStatus, 
  HealthStatus, 
  MoodState, 
  StatusUpdate, 
  CurrentStatus 
} from './status/StatusModule';
export type { 
  Message, 
  CustodySchedule, 
  HouseRule, 
  TransitionChecklist 
} from './parenting/ParentingModule';
export type { 
  AgeGroup, 
  Activity, 
  Resource, 
  CheckIn 
} from './kids/KidsModule';
