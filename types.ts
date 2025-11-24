export type ViewType =
  | "workshop"
  | "workshop"
  | "sop-vault"
  | "weekly-review"
  | "kids-corner"
  | "manifesto"
  | "foundational-protocols"
  | "family-structure-mode"
  | "classic-willy-protocol"
  | "context-switching"
  | "executive-dysfunction"
  | "sensory-overload"
  | "life-maintenance-protocol"
  | "morning-transition-protocol"
  | "personal-hygiene-protocol"
  | "bubble-shield-protocol"
  | "cockpit-setup"
  | "workshop-setup"
  | "solo-execution-mode"
  | "pixel-fold-setup"
  | "accessibility-safety"
  | "headphone-controller-ipi"
  | "create-sop"
  | "system-integration"
  | "co-parenting-protocol"
  | "all-checklists"
  | "willows-corner"
  | "bashs-corner";

export type SopSubCategory =
  | "foundational"
  | "mode"
  | "maintenance"
  | "hardware"
  | "meta"
  | "kids"
  | "ipi";

// Fix: Defined Sop interface here to break circular dependency with constants.ts
export interface Sop {
  id: string;
  category: string;
  subCategory?: SopSubCategory;
  viewId?: ViewType;
  title: string;
  description: string;
  steps?: string[];
  cues?: string[];
}

export type Mood = "Focused" | "Calm" | "Overwhelmed" | null;
export type Energy = "High" | "Medium" | "Low" | null;
export type KidLocation = "At Mom's" | "With Me" | "School/Other" | null;

export interface CalendarEvent {
  id: string;
  date: string; // ISO string for date
  title: string;
  type: "appointment" | "school" | "handoff" | "other";
}

export interface AppState {
  view: ViewType;
  checkedItems: { [key: string]: boolean };
  textInputs: { [key: string]: string };
  statusMood: Mood;
  statusEnergy: Energy;
  kidsWillowLocation: KidLocation;
  kidsSebastianLocation: KidLocation;
  collectedGems: {
    willow: string[];
    sebastian: string[];
  };
  collectedAchievements: Record<string, { unlockedAt: string }>;
  userSops: Sop[];
  modifiedSops: { [key: string]: Sop };
  isModMode: boolean;
  calendarEvents: CalendarEvent[];
}

export type Action =
  | { type: "SET_VIEW"; payload: ViewType }
  | { type: "TOGGLE_CHECKED"; payload: string }
  | { type: "SET_TEXT_INPUT"; payload: { id: string; value: string } }
  | { type: "SET_MOOD"; payload: Mood }
  | { type: "SET_ENERGY"; payload: Energy }
  | {
      type: "SET_KID_LOCATION";
      payload: { kid: "willow" | "sebastian"; location: KidLocation };
    }
  | {
      type: "ADD_GEM";
      payload: { id: string; recipient: "willow" | "sebastian" };
    }
  | { type: "ADD_ACHIEVEMENT"; payload: string }
  | { type: "ADD_SOP"; payload: Sop }
  | { type: "UPDATE_SOP"; payload: Sop }
  | { type: "RESET_SOP"; payload: string }
  | { type: "TOGGLE_MOD_MODE" }
  | { type: "ADD_CALENDAR_EVENT"; payload: Omit<CalendarEvent, "id"> }
  | { type: "REMOVE_CALENDAR_EVENT"; payload: string }
  | { type: "RESET_CHECKLISTS_AND_INPUTS" }
  | { type: "RESET_REWARDS" };
