export interface ChecklistItemData {
  id: string;
  label: string;
  gemAwardId?: string;
  gemRecipient?: "willow" | "sebastian";
  achievementAwardId?: string;
  large?: boolean;
}

export interface ChecklistSectionData {
  id: string;
  title: string;
  sourceDocument: string;
  items?: ChecklistItemData[];
  subSections?: ChecklistSectionData[];
  description?: string;
  validation?: string; // For hygiene protocol
}

export const ALL_CHECKLIST_DATA: ChecklistSectionData[] = [
  // EssentialsTracker (from CommandCenter)
  {
    id: "essentials-tracker",
    title: "Daily Essentials",
    sourceDocument: "Command Center",
    subSections: [
      {
        id: "essentials-meds-section",
        title: "💊 Medicine",
        sourceDocument: "Command Center",
        items: [
          { id: "essentials-meds-am", label: "Morning" },
          { id: "essentials-meds-noon", label: "Noon" },
          { id: "essentials-meds-pm", label: "Night" },
        ],
      },
      {
        id: "essentials-hydration-section",
        title: "💧 Hydration",
        sourceDocument: "Command Center",
        items: [
          { id: "essentials-water-1", label: "Cup 1" },
          { id: "essentials-water-2", label: "Cup 2" },
          { id: "essentials-water-3", label: "Cup 3" },
          { id: "essentials-water-4", label: "Cup 4" },
        ],
      },
      {
        id: "essentials-nutrition-section",
        title: "🍎 Nutrition",
        sourceDocument: "Command Center",
        items: [
          { id: "essentials-food-1", label: "Breakfast" },
          { id: "essentials-food-2", label: "Lunch" },
          { id: "essentials-food-3", label: "Dinner" },
        ],
      },
    ],
  },
  // WeeklyReview.tsx
  {
    id: "wr-setup",
    title: "PRE-PROTOCOL SETUP (5 Minutes)",
    sourceDocument: "Weekly Review",
    items: [
      { id: "wr-setup-1", label: "Clear physical space at Command Center" },
      { id: "wr-setup-2", label: "Close all browser tabs and applications" },
      {
        id: "wr-setup-3",
        label:
          "Open only: Google Keep, Google Tasks, NotebookLM, Calendar, this checklist",
      },
      { id: "wr-setup-4", label: "Deploy Bubble Shield Profile 1.0" },
      { id: "wr-setup-5", label: "Set phone to Do Not Disturb" },
      { id: "wr-setup-6", label: "Set timer for 60 minutes" },
    ],
  },
  {
    id: "wr-chaos-processing-parent",
    title: "PHASE 1: CHAOS PROCESSING (15 Minutes)",
    sourceDocument: "Weekly Review",
    subSections: [
      {
        id: "wr-chaos-processing-google-keep",
        title: "Google Keep Chaos Audit (10 minutes)",
        sourceDocument: "Weekly Review",
        items: [
          {
            id: "wr-p1-s1-i1",
            label: "Open Google Keep and review all notes from this week",
          },
          {
            id: "wr-p1-s1-i2",
            label: "Process actionable tasks → Move to Google Tasks",
          },
          {
            id: "wr-p1-s1-i3",
            label:
              'Process project ideas → Move to NotebookLM with tag "Ideas - [Module]"',
          },
          {
            id: "wr-p1-s1-i4",
            label:
              'Process reference info → Move to NotebookLM with tag "Reference - [Topic]"',
          },
          { id: "wr-p1-s1-i5", label: "Archive already-handled notes" },
          { id: "wr-p1-s1-i6", label: "Delete no-longer-relevant notes" },
          { id: "wr-p1-s1-i7", label: 'Tag unclear items "Review Next Week"' },
          {
            id: "wr-p1-s1-i8",
            label:
              'Goal: Google Keep is empty (or only has "Review Next Week" items)',
            achievementAwardId: "inbox-zero",
          },
        ],
      },
      {
        id: "wr-chaos-processing-voice",
        title: "Voice Recording Processing (5 minutes)",
        sourceDocument: "Weekly Review",
        items: [
          { id: "wr-p1-s2-i1", label: "Open Soundcore AI Recorder app" },
          { id: "wr-p1-s2-i2", label: "Review untranscribed recordings" },
          { id: "wr-p1-s2-i3", label: "Extract key information from each" },
          {
            id: "wr-p1-s2-i4",
            label: "File in Google Keep / Tasks / NotebookLM",
          },
          { id: "wr-p1-s2-i5", label: "Delete recordings after filing" },
        ],
      },
    ],
  },
  {
    id: "wr-task-review-parent",
    title: "PHASE 2: TASK COMPLETION REVIEW (10 Minutes)",
    sourceDocument: "Weekly Review",
    subSections: [
      {
        id: "wr-task-review-completed",
        title: "Completed Task Audit (5 minutes)",
        sourceDocument: "Weekly Review",
        items: [
          {
            id: "wr-p2-s1-i1",
            label: 'Open Google Tasks and review all "Completed" tasks',
          },
          {
            id: "wr-p2-s1-i2",
            label: "Note which tasks took more/less time than expected",
          },
          { id: "wr-p2-s1-i3", label: "Note what made tasks easy or hard" },
          {
            id: "wr-p2-s1-i4",
            label: "Identify recurring tasks that should be scheduled",
          },
          {
            id: "wr-p2-s1-i5",
            label: "Track productivity patterns (which days, which types)",
          },
        ],
      },
      {
        id: "wr-task-review-incomplete",
        title: "Incomplete Task Triage (5 minutes)",
        sourceDocument: "Weekly Review",
        items: [
          { id: "wr-p2-s2-i1", label: 'Review all "Not Completed" tasks' },
          {
            id: "wr-p2-s2-i2",
            label: "For each: Is it still relevant? (Yes = keep, No = delete)",
          },
          {
            id: "wr-p2-s2-i3",
            label:
              "For each: Why didn't I complete it? (vague, too big, wrong priority, blocker)",
          },
          {
            id: "wr-p2-s2-i4",
            label: "Rewrite vague tasks with clear micro-actions",
          },
          { id: "wr-p2-s2-i5", label: "Break big tasks into smaller tasks" },
          { id: "wr-p2-s2-i6", label: "Archive or delete non-relevant tasks" },
          { id: "wr-p2-s2-i7", label: "Update deadlines for carryover tasks" },
        ],
      },
    ],
  },
  // Willow's Corner
  {
    id: "wc-weekend",
    title: "📋 Weekend with Dad Checklist",
    sourceDocument: "Willow's Corner",
    subSections: [
      {
        id: "wc-weekend-morning",
        title: "Morning",
        sourceDocument: "Willow's Corner",
        items: [
          {
            id: "kwp-willow-daily-morning-1",
            label: "Brush hair",
            gemAwardId: "morning-hair",
            gemRecipient: "willow",
            large: true,
          },
          {
            id: "kwp-willow-daily-morning-2",
            label: "Brush teeth",
            gemAwardId: "morning-teeth",
            gemRecipient: "willow",
            large: true,
          },
          {
            id: "kwp-willow-daily-morning-3",
            label: "Change clothes",
            gemAwardId: "morning-clothes",
            gemRecipient: "willow",
            large: true,
          },
          {
            id: "kwp-willow-daily-morning-5",
            label: "Water",
            gemAwardId: "morning-water",
            gemRecipient: "willow",
            large: true,
          },
          {
            id: "kwp-willow-daily-morning-6",
            label: "Feed Pets",
            gemAwardId: "morning-pets",
            gemRecipient: "willow",
            large: true,
          },
        ],
      },
      {
        id: "wc-weekend-prep",
        title: "Sunday Prep",
        sourceDocument: "Willow's Corner",
        items: [
          {
            id: "kwp-willow-sunprep-1",
            label: "Make your bed",
            gemAwardId: "prep-bed",
            gemRecipient: "willow",
            large: true,
          },
          {
            id: "kwp-willow-sunprep-2",
            label: "Pick Monday school outfit",
            gemAwardId: "prep-outfit",
            gemRecipient: "willow",
            large: true,
          },
          {
            id: "kwp-willow-sunprep-3",
            label: "Pack school backpack",
            gemAwardId: "prep-pack",
            gemRecipient: "willow",
            large: true,
          },
          {
            id: "kwp-willow-sunprep-4",
            label: "Do your chores",
            gemAwardId: "prep-chores",
            gemRecipient: "willow",
            large: true,
          },
          {
            id: "kwp-willow-sunprep-5",
            label: "Help Dad with house prep",
            gemAwardId: "prep-help",
            gemRecipient: "willow",
            large: true,
          },
        ],
      },
    ],
  },
  {
    id: "wc-weekday",
    title: "📋 Weekdays at Mom's Checklist",
    sourceDocument: "Willow's Corner",
    subSections: [
      {
        id: "wc-weekday-morning",
        title: "Morning",
        sourceDocument: "Willow's Corner",
        items: [
          {
            id: "kwp-willow-moms-morning-1",
            label: "Wake up on time",
            gemAwardId: "moms-wake",
            gemRecipient: "willow",
            large: true,
          },
          {
            id: "kwp-willow-moms-morning-2",
            label: "Get dressed",
            gemAwardId: "moms-dress",
            gemRecipient: "willow",
            large: true,
          },
          {
            id: "kwp-willow-moms-morning-4",
            label: "Brush teeth",
            gemAwardId: "moms-teeth-am",
            gemRecipient: "willow",
            large: true,
          },
          {
            id: "kwp-willow-moms-morning-5",
            label: "Brush hair",
            gemAwardId: "moms-hair",
            gemRecipient: "willow",
            large: true,
          },
          {
            id: "kwp-willow-moms-morning-6",
            label: "Pack backpack",
            gemAwardId: "moms-pack",
            gemRecipient: "willow",
            large: true,
          },
          {
            id: "kwp-willow-moms-morning-7",
            label: "Get to school ⭐",
            gemAwardId: "moms-school",
            gemRecipient: "willow",
            large: true,
          },
        ],
      },
      {
        id: "wc-weekday-evening",
        title: "Evening",
        sourceDocument: "Willow's Corner",
        items: [
          {
            id: "kwp-willow-moms-afternoon-2",
            label: "Put backpack away",
            gemAwardId: "moms-unpack",
            gemRecipient: "willow",
            large: true,
          },
          {
            id: "kwp-willow-moms-afternoon-5",
            label: "Do homework",
            gemAwardId: "moms-homework",
            gemRecipient: "willow",
            large: true,
          },
          {
            id: "kwp-willow-moms-evening-2",
            label: "Clean up spot",
            gemAwardId: "moms-cleanup",
            gemRecipient: "willow",
            large: true,
          },
          {
            id: "kwp-willow-moms-evening-5",
            label: "Brush teeth",
            gemAwardId: "moms-teeth-pm",
            gemRecipient: "willow",
            large: true,
          },
          {
            id: "kwp-willow-moms-evening-6",
            label: "Get bag ready",
            gemAwardId: "moms-prep-pm",
            gemRecipient: "willow",
            large: true,
          },
        ],
      },
    ],
  },
  // Bash's Corner
  {
    id: "bc-weekend",
    title: "📋 Weekend with Dad Checklist",
    sourceDocument: "Bash's Corner",
    subSections: [
      {
        id: "bc-weekend-morning",
        title: "Morning",
        sourceDocument: "Bash's Corner",
        items: [
          {
            id: "kwp-sebastian-daily-morning-1",
            label: "Brush hair",
            gemAwardId: "morning-hair",
            gemRecipient: "sebastian",
            large: true,
          },
          {
            id: "kwp-sebastian-daily-morning-2",
            label: "Brush teeth",
            gemAwardId: "morning-teeth",
            gemRecipient: "sebastian",
            large: true,
          },
          {
            id: "kwp-sebastian-daily-morning-3",
            label: "Change clothes",
            gemAwardId: "morning-clothes",
            gemRecipient: "sebastian",
            large: true,
          },
          {
            id: "kwp-sebastian-daily-morning-5",
            label: "Water",
            gemAwardId: "morning-water",
            gemRecipient: "sebastian",
            large: true,
          },
          {
            id: "kwp-sebastian-daily-morning-6",
            label: "Feed Pets",
            gemAwardId: "morning-pets",
            gemRecipient: "sebastian",
            large: true,
          },
        ],
      },
      {
        id: "bc-weekend-prep",
        title: "Sunday Prep",
        sourceDocument: "Bash's Corner",
        items: [
          {
            id: "kwp-sebastian-sunprep-1",
            label: "Make your bed",
            gemAwardId: "prep-bed",
            gemRecipient: "sebastian",
            large: true,
          },
          {
            id: "kwp-sebastian-sunprep-2",
            label: "Pick Monday school outfit",
            gemAwardId: "prep-outfit",
            gemRecipient: "sebastian",
            large: true,
          },
          {
            id: "kwp-sebastian-sunprep-3",
            label: "Pack school backpack",
            gemAwardId: "prep-pack",
            gemRecipient: "sebastian",
            large: true,
          },
          {
            id: "kwp-sebastian-sunprep-4",
            label: "Do your chores",
            gemAwardId: "prep-chores",
            gemRecipient: "sebastian",
            large: true,
          },
          {
            id: "kwp-sebastian-sunprep-5",
            label: "Help Dad with house prep",
            gemAwardId: "prep-help",
            gemRecipient: "sebastian",
            large: true,
          },
        ],
      },
    ],
  },
  {
    id: "bc-weekday",
    title: "📋 Weekdays at Mom's Checklist",
    sourceDocument: "Bash's Corner",
    subSections: [
      {
        id: "bc-weekday-morning",
        title: "Morning",
        sourceDocument: "Bash's Corner",
        items: [
          {
            id: "kwp-sebastian-moms-morning-1",
            label: "Wake up on time",
            gemAwardId: "moms-wake",
            gemRecipient: "sebastian",
            large: true,
          },
          {
            id: "kwp-sebastian-moms-morning-2",
            label: "Get dressed",
            gemAwardId: "moms-dress",
            gemRecipient: "sebastian",
            large: true,
          },
          {
            id: "kwp-sebastian-moms-morning-4",
            label: "Brush teeth",
            gemAwardId: "moms-teeth-am",
            gemRecipient: "sebastian",
            large: true,
          },
          {
            id: "kwp-sebastian-moms-morning-5",
            label: "Brush hair",
            gemAwardId: "moms-hair",
            gemRecipient: "sebastian",
            large: true,
          },
          {
            id: "kwp-sebastian-moms-morning-6",
            label: "Pack backpack",
            gemAwardId: "moms-pack",
            gemRecipient: "sebastian",
            large: true,
          },
          {
            id: "kwp-sebastian-moms-morning-7",
            label: "Get to school ⭐",
            gemAwardId: "moms-school",
            gemRecipient: "sebastian",
            large: true,
          },
        ],
      },
      {
        id: "bc-weekday-evening",
        title: "Evening",
        sourceDocument: "Bash's Corner",
        items: [
          {
            id: "kwp-sebastian-moms-afternoon-2",
            label: "Put backpack away",
            gemAwardId: "moms-unpack",
            gemRecipient: "sebastian",
            large: true,
          },
          {
            id: "kwp-sebastian-moms-afternoon-5",
            label: "Do homework",
            gemAwardId: "moms-homework",
            gemRecipient: "sebastian",
            large: true,
          },
          {
            id: "kwp-sebastian-moms-evening-2",
            label: "Clean up spot",
            gemAwardId: "moms-cleanup",
            gemRecipient: "sebastian",
            large: true,
          },
          {
            id: "kwp-sebastian-moms-evening-5",
            label: "Brush teeth",
            gemAwardId: "moms-teeth-pm",
            gemRecipient: "sebastian",
            large: true,
          },
          {
            id: "kwp-sebastian-moms-evening-6",
            label: "Get bag ready",
            gemAwardId: "moms-prep-pm",
            gemRecipient: "sebastian",
            large: true,
          },
        ],
      },
    ],
  },
  // FoundationalProtocols.tsx
  {
    id: "fp-checklist",
    title: "Execution Checklist",
    sourceDocument: "Foundational Protocols",
    subSections: [
      {
        id: "fp-checklist-morning",
        title: "Morning",
        sourceDocument: "Foundational Protocols",
        items: [
          { id: "fdp-check-1", label: "Wake at 6:00 AM" },
          { id: "fdp-check-2", label: "Drink 16 oz water immediately" },
          { id: "fdp-check-3", label: "Take all pills from organizer" },
        ],
      },
      {
        id: "fp-checklist-allday",
        title: "All Day",
        sourceDocument: "Foundational Protocols",
        items: [
          { id: "fdp-check-4", label: "Capture Protocol active" },
          { id: "fdp-check-5", label: "Process nothing—only capture" },
        ],
      },
      {
        id: "fp-checklist-evening",
        title: "Evening",
        sourceDocument: "Foundational Protocols",
        items: [
          { id: "fdp-check-6", label: "10:00 PM - Begin wind down" },
          { id: "fdp-check-7", label: "10:25 PM - Write 3 critical tasks" },
          {
            id: "fdp-check-8",
            label: "10:30 PM - In bed, lights out",
            achievementAwardId: "foundational-day-complete",
          },
        ],
      },
    ],
  },
  {
    id: "fp-failure",
    title: "Failure Protocol",
    sourceDocument: "Foundational Protocols",
    description: "If you miss a protocol:",
    items: [
      { id: "fdp-fail-1", label: "Water/Pill Missed:" },
      { id: "fdp-fail-2", label: "Capture Missed:" },
      { id: "fdp-fail-3", label: "Sleep Anchor Missed:" },
    ],
  },
  // ContextSwitchingProtocol.tsx
  {
    id: "csp-recognition",
    title: "RECOGNITION SIGNALS",
    sourceDocument: "Context Switching Protocol",
    description: "Execute this protocol when:",
    items: [
      {
        id: "cs-recog-1",
        label:
          'Someone interrupts you during deep work (knock, call, "quick question").',
      },
      {
        id: "cs-recog-2",
        label:
          "An emergency requires immediate attention (child hurt, system alert).",
      },
      {
        id: "cs-recog-3",
        label: "You must switch between Solo and Family modes mid-task.",
      },
      { id: "cs-recog-4", label: "A meeting starts while you're mid-flow." },
      {
        id: "cs-recog-5",
        label: "Technical failure forces you to abandon the current task.",
      },
    ],
  },
  {
    id: "csp-phase1",
    title: "PHASE 1: IMMEDIATE CAPTURE (30-90 Seconds)",
    sourceDocument: "Context Switching Protocol",
    items: [
      { id: "cs-p1-1", label: "Step 1: STOP and Freeze (5 seconds)" },
      { id: "cs-p1-2", label: "Step 2: Active Task Capture (20 seconds)" },
      { id: "cs-p1-3", label: "Step 3: Screen State Capture (10 seconds)" },
      { id: "cs-p1-4", label: "Step 4: Save All Work (10 seconds)" },
    ],
  },
  {
    id: "csp-phase2",
    title: "PHASE 2: INTERRUPT HANDLING",
    sourceDocument: "Context Switching Protocol",
    items: [
      { id: "cs-p2-1", label: "Step 5: Interrupt Triage (10 seconds)" },
      { id: "cs-p2-2", label: "Step 6: Handle or Defer" },
    ],
  },
  {
    id: "csp-phase3",
    title: "PHASE 3: CONTEXT RELOAD (2-5 Minutes)",
    sourceDocument: "Context Switching Protocol",
    items: [
      { id: "cs-p3-1", label: "Step 7: Transition Buffer (60 seconds)" },
      { id: "cs-p3-2", label: "Step 8: Read Your Capture (30 seconds)" },
      { id: "cs-p3-3", label: "Step 9: Visual Context Reload (30 seconds)" },
      { id: "cs-p3-4", label: "Step 10: Micro-Restart (30 seconds)" },
      { id: "cs-p3-5", label: "Step 11: Timer + Re-Engage" },
    ],
  },
  // ExecutiveDysfunctionProtocol.tsx
  {
    id: "edp-recognition",
    title: "RECOGNITION SIGNALS",
    sourceDocument: "Executive Dysfunction Protocol",
    description:
      "If 3 or more signals are present: STOP EVERYTHING. Execute this protocol immediately.",
    items: [
      {
        id: "ed-recog-1",
        label:
          "You've been staring at your task list for 10+ minutes without starting anything.",
      },
      {
        id: "ed-recog-2",
        label:
          "Simple tasks feel overwhelming (making coffee, opening a file).",
      },
      {
        id: "ed-recog-3",
        label: "You're scrolling but not actually reading or enjoying it.",
      },
      {
        id: "ed-recog-4",
        label: "You feel physically heavy or stuck in your chair.",
      },
      {
        id: "ed-recog-5",
        label:
          "Time is passing but you're not doing anything productive or restful.",
      },
      {
        id: "ed-recog-6",
        label: "You're thinking \"I should just...\" but your body won't move.",
      },
      {
        id: "ed-recog-7",
        label: "You feel guilt/shame about not working but still can't start.",
      },
    ],
  },
  {
    id: "edp-phase1",
    title: "PHASE 1: BODY RESET (5 Minutes)",
    sourceDocument: "Executive Dysfunction Protocol",
    items: [
      { id: "ed-p1-1", label: "Step 1: Water Fix (60 seconds)" },
      { id: "ed-p1-2", label: "Step 2: Food Check (60 seconds)" },
      { id: "ed-p1-3", label: "Step 3: Medication Check (30 seconds)" },
      { id: "ed-p1-4", label: "Step 4: Movement Protocol (3 minutes)" },
    ],
  },
  {
    id: "edp-phase2",
    title: "PHASE 2: ENVIRONMENT RESET (3 Minutes)",
    sourceDocument: "Executive Dysfunction Protocol",
    items: [
      { id: "ed-p2-1", label: "Step 5: Bubble Shield Deployment (60 seconds)" },
      { id: "ed-p2-2", label: "Step 6: Visual Chaos Reduction (90 seconds)" },
    ],
  },
  {
    id: "edp-phase3",
    title: "PHASE 3: TASK RESET (3 Minutes)",
    sourceDocument: "Executive Dysfunction Protocol",
    items: [
      { id: "ed-p3-1", label: "Step 7: Task Selection (30 seconds)" },
      { id: "ed-p3-2", label: "Step 8: Micro-Action Extraction (60 seconds)" },
      { id: "ed-p3-3", label: "Step 9: Timer + Execute" },
    ],
  },
  {
    id: "edp-success",
    title: "SUCCESS METRICS",
    sourceDocument: "Executive Dysfunction Protocol",
    description:
      "You have succeeded when you have completed at least one 10-minute task block, addressed a physical root cause, and broken the scroll/stare paralysis cycle.",
  },
  // SensoryOverloadProtocol.tsx
  {
    id: "sop-recognition",
    title: "RECOGNITION SIGNALS",
    sourceDocument: "Sensory Overload Protocol",
    description:
      "If 3 or more signals are present: Execute this protocol immediately. Do not wait.",
    subSections: [
      {
        id: "sop-recog-aud",
        title: "Auditory Overload",
        sourceDocument: "Sensory Overload Protocol",
        items: [
          {
            id: "so-recog-aud-1",
            label: "Normal conversation volume feels like shouting.",
          },
          {
            id: "so-recog-aud-2",
            label: "Background noise is physically painful.",
          },
          {
            id: "so-recog-aud-3",
            label:
              "Multiple sound sources are happening and you can't filter them.",
          },
        ],
      },
      {
        id: "sop-recog-vis",
        title: "Visual Overload",
        sourceDocument: "Sensory Overload Protocol",
        items: [
          {
            id: "so-recog-vis-1",
            label: "Lights feel too bright, even normal indoor lighting.",
          },
          {
            id: "so-recog-vis-2",
            label: "Movement in your peripheral vision is deeply distracting.",
          },
          {
            id: "so-recog-vis-3",
            label: "You want to close your eyes or seek darkness.",
          },
        ],
      },
      {
        id: "sop-recog-tac",
        title: "Tactile Overload",
        sourceDocument: "Sensory Overload Protocol",
        items: [
          {
            id: "so-recog-tac-1",
            label: "Your clothing feels wrong (tags, seams, tightness).",
          },
          {
            id: "so-recog-tac-2",
            label: "Touch from others is irritating or painful.",
          },
          {
            id: "so-recog-tac-3",
            label: "Your skin feels hypersensitive to air or fabric.",
          },
        ],
      },
      {
        id: "sop-recog-sys",
        title: "Systemic Overload",
        sourceDocument: "Sensory Overload Protocol",
        items: [
          {
            id: "so-recog-sys-1",
            label: "You feel trapped, cornered, or claustrophobic.",
          },
          {
            id: "so-recog-sys-2",
            label:
              "Your fight-or-flight response is activated (heart racing, shallow breath).",
          },
          {
            id: "so-recog-sys-3",
            label:
              "You need everyone to stop talking, moving, and existing near you.",
          },
        ],
      },
    ],
  },
  {
    id: "sop-phase1",
    title: "PHASE 1: IMMEDIATE SENSORY REDUCTION (30-60 Seconds)",
    sourceDocument: "Sensory Overload Protocol",
    items: [
      {
        id: "so-p1-1",
        label: "Step 1: Bubble Shield Emergency Deployment (10s)",
      },
      { id: "so-p1-2", label: "Step 2: Visual Reduction (15s)" },
      { id: "so-p1-3", label: "Step 3: Verbal Signal (5s)" },
      { id: "so-p1-4", label: "Step 4: Immediate Escape (30s)" },
    ],
  },
  {
    id: "sop-phase2",
    title: "PHASE 2: ENVIRONMENT RESET (2-5 Minutes)",
    sourceDocument: "Sensory Overload Protocol",
    items: [
      { id: "so-p2-1", label: "Step 5: Location Security (30s)" },
      { id: "so-p2-2", label: "Step 6: Proprioceptive Input (60s)" },
      { id: "so-p2-3", label: "Step 7: Breathing Reset (90s)" },
    ],
  },
  {
    id: "sop-phase3",
    title: "PHASE 3: REGULATION & RECOVERY (10-30 Minutes)",
    sourceDocument: "Sensory Overload Protocol",
    items: [
      { id: "so-p3-1", label: "Step 8: Water Protocol (30s)" },
      { id: "so-p3-2", label: "Step 9: Passive Regulation Activities" },
      { id: "so-p3-3", label: "Step 10: Gentle Re-Entry" },
    ],
  },
  {
    id: "sop-phase4",
    title: "PHASE 4: POST-OVERLOAD MANAGEMENT",
    sourceDocument: "Sensory Overload Protocol",
    description:
      "Action: Accept that your capacity is reduced for the rest of the day. Cancel non-essential tasks, reduce expectations, and maintain a low-sensory environment. Your sensory threshold is lowered.",
  },
  // ClassicWillyProtocol.tsx
  {
    id: "cwp-purpose",
    title: "1.0 PURPOSE",
    sourceDocument: "Classicwilly Protocol",
    description: `This Standard Operating Procedure (SOP) defines the operational mode for "classicwilly." This protocol is engaged when a "non-conforming condition" has been identified and 11/10-perfection "structure" is required.<p class="text-lg text-text-light text-opacity-90 mt-2 italic">"Wonky Sprout" is the system. "classicwilly" is the fixer.</p>`,
  },
  {
    id: "cwp-scope",
    title: "2.0 SCOPE",
    sourceDocument: "Classicwilly Protocol",
    description:
      'This protocol applies when procedural, physical, or informational "chaos" must be diagnosed and fixed. It is the "anti-BS" filter for all operations.',
  },
  {
    id: "cwp-core",
    title: '3.0 CORE PRINCIPLES (THE "classicwilly" VIBE)',
    sourceDocument: "Classicwilly Protocol",
    items: [
      { id: "cwp-principle-1", label: "11/10 PERFECTION IS THE STANDARD." },
      { id: "cwp-principle-2", label: "OUTPUT OVER OPTICS." },
      { id: "cwp-principle-3", label: "DIAGNOSE BEFORE FIXING." },
      { id: "cwp-principle-4", label: 'BE THE "STRUCTURE."' },
    ],
  },
  {
    id: "cwp-procedure",
    title: '4.0 PROCEDURE (THE "I FIX STUFF" LOOP)',
    sourceDocument: "Classicwilly Protocol",
    description:
      "When this protocol is active, execute the following five-step loop.",
    items: [
      { id: "cwp-loop-1", label: 'IDENTIFY THE "CHAOS."' },
      { id: "cwp-loop-2", label: "DIAGNOSE THE ROOT CAUSE." },
      { id: "cwp-loop-3", label: 'BUILD THE "CARD CATALOG."' },
      { id: "cwp-loop-4", label: 'EXECUTE THE "FIX."' },
      { id: "cwp-loop-5", label: 'VERIFY THE "FIX."' },
    ],
  },
  // FamilyStructureModeProtocol.tsx
  {
    id: "fsm-friday",
    title: "Friday Transition (4:00 PM - 6:00 PM)",
    sourceDocument: "Family Structure Mode Protocol",
    items: [
      { id: "fsm-fri-1", label: "3:30 PM - 4:00 PM | Final Solo Prep:" },
      {
        id: "fsm-fri-2",
        label: "4:00 PM - 5:00 PM | Environment Preparation:",
      },
      { id: "fsm-fri-3", label: "5:00 PM - 6:00 PM | Arrival & Orientation:" },
    ],
  },
  {
    id: "fsm-saturday",
    title: "Saturday Schedule (Full Day)",
    sourceDocument: "Family Structure Mode Protocol",
    items: [
      { id: "fsm-sat-1", label: "6-7 AM:" },
      { id: "fsm-sat-2", label: "7-9 AM:" },
      { id: "fsm-sat-3", label: "9-10 AM:" },
      { id: "fsm-sat-4", label: "10 AM-12 PM:" },
      { id: "fsm-sat-5", label: "12-1 PM:" },
      { id: "fsm-sat-6", label: "1-3 PM:" },
      { id: "fsm-sat-7", label: "3-5 PM:" },
      { id: "fsm-sat-8", label: "5-7 PM:" },
      { id: "fsm-sat-9", label: "7-8:30 PM:" },
      { id: "fsm-sat-10", label: "8:30-9:30 PM:" },
      { id: "fsm-sat-11", label: "10-10:30 PM:" },
    ],
  },
  {
    id: "fsm-sunday",
    title: "Sunday Schedule (Grandma's House Day)",
    sourceDocument: "Family Structure Mode Protocol",
    description:
      "CRITICAL NOTE: Sunday has the highest decision-making load. Prep is mandatory to prevent overwhelm.",
    subSections: [
      {
        id: "fsm-sun-prep",
        title: "🚨 SUNDAY PREP PROTOCOL (9:00 AM - 12:00 PM) - MANDATORY",
        sourceDocument: "Family Structure Mode Protocol",
        description:
          'Reduces all decision-making to pre-defined checklists. No improvisation. No "we\'ll figure it out later."',
        items: [
          {
            id: "fsm-sun-prep-1",
            label: "PHASE 1: Kids Prep (9:00 - 10:30 AM)",
          },
          {
            id: "fsm-sun-prep-2",
            label: "PHASE 2: House Prep (10:30 - 11:15 AM)",
          },
          {
            id: "fsm-sun-prep-3",
            label: "PHASE 3: Personal & Vehicle Prep (11:15 AM - 12:00 PM)",
          },
          { id: "fsm-sun-prep-4", label: "DEPARTURE: 2:00 PM SHARP." },
        ],
      },
    ],
  },
  {
    id: "fsm-monday",
    title: "Monday Morning Departure & Recovery",
    sourceDocument: "Family Structure Mode Protocol",
    description:
      "After children depart, execute a 6-hour Recovery & Transition protocol: Decompress, full house reset, mental transition, physical regulation. Solo Execution Mode becomes active at 6:00 PM.",
  },
  {
    id: "fsm-checklist",
    title: "Execution Checklist (Daily)",
    sourceDocument: "Family Structure Mode Protocol",
    items: [
      { id: "fsm-check-1", label: "Morning:" },
      { id: "fsm-check-2", label: "Core Blocks:" },
      { id: "fsm-check-3", label: "Evening:" },
    ],
  },
  {
    id: "fsm-tools",
    title: "Tools Required",
    sourceDocument: "Family Structure Mode Protocol",
    items: [
      {
        id: "fsm-tool-1",
        label: "Soundcore Space One Headphones (Bubble Shield Profile 2.0)",
      },
      {
        id: "fsm-tool-2",
        label: "Large Whiteboard (Visual schedule for children)",
      },
      { id: "fsm-tool-3", label: "Google Tasks (Weekend structure planning)" },
      {
        id: "fsm-tool-4",
        label: "Fixed Meal Schedule (Eliminates decision fatigue)",
      },
    ],
  },
  // LifeMaintenanceProtocol.tsx
  {
    id: "lmp-philosophy",
    title: "Philosophy",
    sourceDocument: "Life Maintenance Protocol",
    description:
      "These tasks are not moral issues. They are mechanical systems.",
    items: [
      {
        id: "lmp-phil-1",
        label: "Dirty house ≠ lazy. It means your maintenance system failed.",
      },
      {
        id: "lmp-phil-2",
        label:
          "Empty fridge ≠ irresponsible. It means your grocery protocol broke.",
      },
      {
        id: "lmp-phil-3",
        label:
          "Skipped shower ≠ gross. It means your hygiene routine hit friction.",
      },
    ],
  },
  {
    id: "lmp-cleaning",
    title: "SECTION 1: HOUSE CLEANING",
    sourceDocument: "Life Maintenance Protocol",
    description:
      "The Solution: Zone-Based Maintenance. Don't clean the house. Maintain zones on a rotation.",
    subSections: [
      {
        id: "lmp-daily-clean",
        title: "DAILY MAINTENANCE (15 Minutes Total)",
        sourceDocument: "Life Maintenance Protocol",
        description:
          "Rule: Do these BEFORE they become emergencies. Set a 5-minute timer per zone.",
        items: [
          { id: "lmp-daily-1", label: "Zone 1: Kitchen (5 min):" },
          { id: "lmp-daily-2", label: "Zone 2: Bathroom (5 min):" },
          { id: "lmp-daily-3", label: "Zone 3: Living Space (5 min):" },
        ],
      },
      {
        id: "lmp-weekly-clean",
        title: "WEEKLY DEEP CLEAN (60 Minutes)",
        sourceDocument: "Life Maintenance Protocol",
        description: "Schedule: Sunday 9-10 AM. 4-week rotation.",
        items: [
          { id: "lmp-weekly-1", label: "Week 1:" },
          { id: "lmp-weekly-2", label: "Week 2:" },
          { id: "lmp-weekly-3", label: "Week 3:" },
          { id: "lmp-weekly-4", label: "Week 4:" },
        ],
      },
    ],
  },
  {
    id: "lmp-groceries",
    title: "SECTION 2: GROCERIES",
    sourceDocument: "Life Maintenance Protocol",
    description:
      "The Solution: Template-Based Shopping. Stop planning meals. Use a template list to eliminate decision fatigue.",
    subSections: [
      {
        id: "lmp-grocery-list",
        title: "Hidden",
        sourceDocument: "Life Maintenance Protocol",
        description:
          "Print, laminate, and keep on fridge. Shop when 50% of boxes are checked.",
        subSections: [
          {
            id: "lmp-groc-p",
            title: "Proteins (Pick 3-4)",
            sourceDocument: "Life Maintenance Protocol",
            items: [
              { id: "lmp-groc-p1", label: "Eggs" },
              { id: "lmp-groc-p2", label: "Rotisserie Chicken" },
              { id: "lmp-groc-p3", label: "Ground Beef" },
              { id: "lmp-groc-p4", label: "Canned Tuna" },
            ],
          },
          {
            id: "lmp-groc-c",
            title: "Carbs (Pick 3-4)",
            sourceDocument: "Life Maintenance Protocol",
            items: [
              { id: "lmp-groc-c1", label: "Bread" },
              { id: "lmp-groc-c2", label: "Pasta" },
              { id: "lmp-groc-c3", label: "Rice" },
              { id: "lmp-groc-c4", label: "Tortillas" },
            ],
          },
          {
            id: "lmp-groc-v",
            title: "Vegetables (Pick 4-5)",
            sourceDocument: "Life Maintenance Protocol",
            items: [
              { id: "lmp-groc-v1", label: "Baby Carrots" },
              { id: "lmp-groc-v2", label: "Bagged Salad" },
              { id: "lmp-groc-v3", label: "Frozen Veggies" },
              { id: "lmp-groc-v4", label: "Canned Veggies" },
            ],
          },
          {
            id: "lmp-groc-f",
            title: "Fruits (Pick 2-3)",
            sourceDocument: "Life Maintenance Protocol",
            items: [
              { id: "lmp-groc-f1", label: "Apples" },
              { id: "lmp-groc-f2", label: "Bananas" },
              { id: "lmp-groc-f3", label: "Applesauce Cups" },
            ],
          },
          {
            id: "lmp-groc-d",
            title: "Dairy (Pick 3-4)",
            sourceDocument: "Life Maintenance Protocol",
            items: [
              { id: "lmp-groc-d1", label: "Milk" },
              { id: "lmp-groc-d2", label: "Yogurt Cups" },
              { id: "lmp-groc-d3", label: "Sliced/Shredded Cheese" },
            ],
          },
          {
            id: "lmp-groc-e",
            title: "Frozen Meals (Backup)",
            sourceDocument: "Life Maintenance Protocol",
            items: [
              { id: "lmp-groc-e1", label: "Frozen Pizzas" },
              { id: "lmp-groc-e2", label: "Microwaveable Dinners" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "lmp-hygiene",
    title: "SECTION 3: PERSONAL HYGIENE",
    sourceDocument: "Life Maintenance Protocol",
    description:
      "The Solution: Tiered Hygiene System. Match hygiene tasks to your available capacity. Not every day requires a full shower.",
    items: [
      { id: "lmp-hyg-1", label: "Tier 1: Minimal Function Day (5 min):" },
      { id: "lmp-hyg-2", label: "Tier 2: Sink Wash (10 min):" },
      { id: "lmp-hyg-3", label: "Tier 3: Quick Shower (15 min):" },
      { id: "lmp-hyg-4", label: "Tier 4: Full Hygiene Routine (30-45 min):" },
    ],
  },
  {
    id: "lmp-emergency",
    title: "Emergency Reset Protocol",
    sourceDocument: "Life Maintenance Protocol",
    description: "When everything has collapsed. Triage and reboot.",
    items: [
      { id: "lmp-emer-1", label: "Today:" },
      { id: "lmp-emer-2", label: "Tomorrow:" },
      { id: "lmp-emer-3", label: "Day 3:" },
      { id: "lmp-emer-4", label: "Day 4:" },
      { id: "lmp-emer-5", label: "Day 5:" },
    ],
  },
  // MorningTransitionProtocol.tsx
  {
    id: "mtp-philosophy",
    title: "Protocol Philosophy",
    sourceDocument: "Morning Transition Protocol",
    description:
      "The neurodivergent brain needs structured transitions. This protocol removes barriers like decision paralysis, executive dysfunction, and cognitive fog through a fixed sequence and automated decisions.",
  },
  {
    id: "mtp-overview",
    title: "Transition Overview",
    sourceDocument: "Morning Transition Protocol",
    description: "The morning is divided into 4 non-negotiable phases:",
    items: [
      { id: "mtp-overview-1", label: "Physical Activation (6:00-6:15 AM)" },
      { id: "mtp-overview-2", label: "Environment Setup (6:15-6:30 AM)" },
      { id: "mtp-overview-3", label: "Mental Calibration (6:30-6:45 AM)" },
      { id: "mtp-overview-4", label: "Execution Launch (6:45-7:00 AM)" },
    ],
  },
  {
    id: "mtp-phase1",
    title: "Phase 1: Physical Activation (6:00-6:15 AM)",
    sourceDocument: "Morning Transition Protocol",
    items: [
      { id: "mtp-p1-1", label: "6:00-6:02 AM - Wake & Water Protocol:" },
      { id: "mtp-p1-2", label: "6:02-6:03 AM - Pill Protocol:" },
      { id: "mtp-p1-3", label: "6:03-6:10 AM - Movement Activation:" },
      { id: "mtp-p1-4", label: "6:10-6:15 AM - Caffeine Protocol:" },
    ],
  },
  {
    id: "mtp-phase2",
    title: "Phase 2: Environment Setup (6:15-6:30 AM)",
    sourceDocument: "Morning Transition Protocol",
    items: [
      { id: "mtp-p2-1", label: "6:15-6:20 AM - Command Center Activation:" },
      { id: "mtp-p2-2", label: "6:20-6:25 AM - Digital Environment Setup:" },
      { id: "mtp-p2-3", label: "6:25-6:30 AM - Bubble Shield Deployment:" },
    ],
  },
  {
    id: "mtp-phase3",
    title: "Phase 3: Mental Calibration (6:30-6:45 AM)",
    sourceDocument: "Morning Transition Protocol",
    items: [
      { id: "mtp-p3-1", label: "6:30-6:35 AM - Calendar Review:" },
      {
        id: "mtp-p3-2",
        label: "6:35-6:42 AM - Task Triage & Priority Selection:",
      },
      { id: "mtp-p3-3", label: "6:42-6:45 AM - Mental Transition Ritual:" },
    ],
  },
  {
    id: "mtp-phase4",
    title: "Phase 4: Execution Launch (6:45-7:00 AM)",
    sourceDocument: "Morning Transition Protocol",
    items: [
      { id: "mtp-p4-1", label: "6:45-6:50 AM - Pre-Launch Check:" },
      { id: "mtp-p4-2", label: "6:50-6:55 AM - First Micro-Action Execution:" },
      { id: "mtp-p4-3", label: "6:55-7:00 AM - Momentum Lock:" },
    ],
  },
  {
    id: "mtp-checklist",
    title: "Execution Checklist",
    sourceDocument: "Morning Transition Protocol",
    description:
      "This entire sequence is designed to be a single, continuous flow. Check off each phase as you complete it.",
  },
  // PersonalHygieneProtocol.tsx
  {
    id: "php-problem",
    title: "The Core Problem",
    sourceDocument: "Personal Hygiene Protocol",
    description:
      "Sensory issues + executive dysfunction + depression = hygiene tasks feel impossible. It's not the hygiene itself, but the sequence of micro-tasks and sensory inputs. This is not laziness. This is system overload.",
  },
  {
    id: "php-solution",
    title: "The Solution: Tiered Hygiene System",
    sourceDocument: "Personal Hygiene Protocol",
    description:
      "Not every day requires a full shower. Match hygiene to your capacity. Lower tier ≠ failure.",
    items: [
      { id: "php-sol-1", label: "Tier 1: Minimal function (5 min)" },
      { id: "php-sol-2", label: "Tier 2: Sink wash (10 min)" },
      { id: "php-sol-3", label: "Tier 3: Quick shower (15 min)" },
      { id: "php-sol-4", label: "Tier 4: Full routine (30-45 min)" },
    ],
  },
  {
    id: "php-t1",
    title: "🟢 Tier 1: Minimal Function Day (5 Minutes)",
    sourceDocument: "Personal Hygiene Protocol",
    description:
      "When to Use: Can't shower. Depression, exhaustion, executive dysfunction freeze. Goal is to do the minimum to not feel gross.",
    items: [
      { id: "php-t1-1", label: "Face Wipe (1 min):" },
      { id: "php-t1-2", label: "Deodorant (30 sec):" },
      { id: "php-t1-3", label: "Teeth (2 min):" },
      { id: "php-t1-4", label: "Hair (1 min):" },
      { id: "php-t1-5", label: "Clothes (30 sec):" },
    ],
    validation:
      "Validation: You are clean enough to exist in the world. This counts.",
  },
  {
    id: "php-t2",
    title: "🟡 Tier 2: Sink Wash (10 Minutes)",
    sourceDocument: "Personal Hygiene Protocol",
    description:
      "When to Use: Shower feels impossible but you want to feel cleaner than Tier 1. Goal is to wash the important parts without a full shower.",
    items: [
      { id: "php-t2-1", label: "Face Wash (2 min):" },
      { id: "php-t2-2", label: "Armpit Wash (2 min):" },
      { id: "php-t2-3", label: "Groin Wash (2 min):" },
      { id: "php-t2-4", label: "Deodorant (30 sec):" },
      { id: "php-t2-5", label: "Teeth (2 min):" },
      { id: "php-t2-6", label: "Fresh Clothes (30 sec):" },
    ],
    validation:
      "Validation: This is valid hygiene. You don't need a shower to be clean.",
  },
  {
    id: "php-t3",
    title: "🟠 Tier 3: Quick Shower (15 Minutes)",
    sourceDocument: "Personal Hygiene Protocol",
    description:
      "When to Use: Can manage a shower but need it fast. Goal is to get in, wash critical areas, and get out.",
    items: [
      { id: "php-t3-1", label: "Pre-Shower Setup (2 min):" },
      { id: "php-t3-2", label: "In-Shower Protocol (10 min):" },
      { id: "php-t3-3", label: "Post-Shower Protocol (3 min):" },
    ],
    validation:
      "Validation: You cleaned your body. That's the goal. Everything else is extra.",
  },
  {
    id: "php-t4",
    title: "🔴 Tier 4: Full Hygiene Routine (30-45 Minutes)",
    sourceDocument: "Personal Hygiene Protocol",
    description:
      'When to Use: You have the capacity for complete maintenance. Feeling good, have time, want to do "the full thing."',
    items: [
      { id: "php-t4-1", label: "Pre-Shower (5 min):" },
      { id: "php-t4-2", label: "Full Shower (20 min):" },
      { id: "php-t4-3", label: "Post-Shower (10 min):" },
      { id: "php-t4-4", label: "Full Teeth Protocol (5 min):" },
    ],
  },
  {
    id: "php-frequency",
    title: "Frequency Guide",
    sourceDocument: "Personal Hygiene Protocol",
    description: 'Adjust based on your actual capacity, not "shoulds."',
    items: [
      { id: "php-freq-1", label: "Daily Minimum:" },
      { id: "php-freq-2", label: "Every 2-3 Days:" },
      { id: "php-freq-3", label: "Weekly:" },
    ],
  },
  {
    id: "php-troubleshoot",
    title: "Troubleshooting",
    sourceDocument: "Personal Hygiene Protocol",
    description: "",
    items: [
      { id: "php-ts-1", label: '"I haven\'t showered in a week":' },
      { id: "php-ts-2", label: '"Showers trigger anxiety":' },
      { id: "php-ts-3", label: '"I shower but then can\'t get dressed":' },
    ],
  },
  // SoloExecutionModeProtocol.tsx
  {
    id: "sem-daily",
    title: "Daily Schedule (Hourly Breakdown)",
    sourceDocument: "Solo Execution Mode Protocol",
    items: [
      { id: "sem-sched-1", label: "6:00 AM - Morning Protocols:" },
      { id: "sem-sched-2", label: "6:03 AM - 7:00 AM | Morning Routine:" },
      { id: "sem-sched-3", label: "7:00 AM - 8:00 AM | Planning & Filing:" },
      {
        id: "sem-sched-4",
        label: "8:00 AM - 12:00 PM | Core Work Block 1 (4 hours):",
      },
      { id: "sem-sched-5", label: "12:00 PM - 12:30 PM | Lunch & Reset:" },
      {
        id: "sem-sched-6",
        label: "12:30 PM - 3:30 PM | Core Work Block 2 (3 hours):",
      },
      { id: "sem-sched-7", label: "3:30 PM - 4:00 PM | Movement Protocol:" },
      { id: "sem-sched-8", label: "4:00 PM - 5:00 PM | Buffer & Admin:" },
      { id: "sem-sched-9", label: "5:00 PM - 6:00 PM | Dinner & Wind Down:" },
      { id: "sem-sched-10", label: "6:00 PM - 10:00 PM | Personal Time:" },
      {
        id: "sem-sched-11",
        label: "10:00 PM - 10:30 PM | Evening Protocols:",
        achievementAwardId: "solo-mode-week-complete",
      },
    ],
  },
  {
    id: "sem-monday",
    title: "Monday Special: Meal Prep Day",
    sourceDocument: "Solo Execution Mode Protocol",
    description:
      "7:00 AM - 8:00 AM | Meal Prep (Replaces Planning & Filing): Prepare 12-15 meals for the week (breakfast, lunch, dinner) and store in labeled, ready-to-grab containers. Planning & Filing block moves to 8:00 AM, Core Work starts at 9:00 AM.",
  },
  {
    id: "sem-weekly",
    title: "Weekly Schedule Template",
    sourceDocument: "Solo Execution Mode Protocol",
    description: "This is a visual representation of the schedule.",
    items: [
      {
        id: "sem-template-code",
        label: `MONDAY
7:00 AM  │ MEAL PREP (1 hr)
8:00 AM  │ Planning & Filing (1 hr)
9:00 AM  │ Core Work Block 1 (4 hrs)

TUESDAY - THURSDAY (Standard Days)
7:00 AM  │ Planning & Filing (1 hr)
8:00 AM  │ Core Work Block 1 (4 hrs)

FRIDAY (Transition Day)
...
3:30 PM  │ FULL ENVIRONMENT PREP (Family Mode Setup)
4:00 PM  │ MODE SWITCH → Family Structure Mode Begins`,
      },
    ],
  },
  {
    id: "sem-checklist",
    title: "Execution Checklist (Daily)",
    sourceDocument: "Solo Execution Mode Protocol",
    subSections: [
      {
        id: "sem-check-morning",
        title: "Morning",
        sourceDocument: "Solo Execution Mode Protocol",
        items: [
          { id: "sem-check-1", label: "6:00 AM: FDP (Water, Pills)" },
          { id: "sem-check-2", label: "7:00 AM: Planning & Filing" },
        ],
      },
      {
        id: "sem-check-work",
        title: "Work Blocks",
        sourceDocument: "Solo Execution Mode Protocol",
        items: [
          { id: "sem-check-3", label: "8:00 AM: Core Work Block 1" },
          { id: "sem-check-4", label: "12:00 PM: Lunch & Tidy" },
          { id: "sem-check-5", label: "12:30 PM: Core Work Block 2" },
        ],
      },
      {
        id: "sem-check-evening",
        title: "Afternoon/Evening",
        sourceDocument: "Solo Execution Mode Protocol",
        items: [
          { id: "sem-check-6", label: "3:30 PM: Movement Protocol" },
          { id: "sem-check-7", label: "5:00 PM: Dinner & Wind Down" },
          { id: "sem-check-8", label: "10:00 PM: FDP (Sleep Prep, etc.)" },
        ],
      },
    ],
  },
  {
    id: "sem-tools",
    title: "Tools Required",
    sourceDocument: "Solo Execution Mode Protocol",
    items: [
      {
        id: "sem-tool-1",
        label: "Soundcore Space One Headphones (Bubble Shield Profile 1.0)",
      },
      { id: "sem-tool-2", label: "VS Code (Command Center)" },
      { id: "sem-tool-3", label: "Google Tasks (3 critical tasks)" },
      {
        id: "sem-tool-4",
        label: "Google Keep & Soundcore AI Recorder (Capture processing)",
      },
      { id: "sem-tool-5", label: "NotebookLM (Permanent filing)" },
      { id: "sem-tool-6", label: "Pomodoro Timer (25/5 intervals)" },
    ],
  },
  // CommandCenterSetupSop.tsx
  {
    id: "ccs-space",
    title: "1.0 Space Requirements",
    sourceDocument: "Command Center Setup SOP",
    description:
      "Fixed spatial boundaries create predictability and reduce sensory overwhelm.",
    items: [
      { id: "ccs-space-1", label: "Desk Surface:" },
      { id: "ccs-space-2", label: "Clearance:" },
      { id: "ccs-space-3", label: "Height:" },
      { id: "ccs-space-4", label: "Optimal:" },
    ],
  },
  {
    id: "ccs-hardware",
    title: "2.0 Hardware: Tier System",
    sourceDocument: "Command Center Setup SOP",
    subSections: [
      {
        id: "ccs-hw-t1",
        title: "TIER 1: MUST HAVES (Non-Negotiable)",
        sourceDocument: "Command Center Setup SOP",
        items: [
          { id: "ccs-hw-t1-1", label: "Primary Computing:" },
          { id: "ccs-hw-t1-2", label: "Display System:" },
          { id: "ccs-hw-t1-3", label: "Input Devices:" },
          { id: "ccs-hw-t1-4", label: "Audio System:" },
          { id: "ccs-hw-t1-5", label: "Power Infrastructure:" },
        ],
      },
      {
        id: "ccs-hw-t2",
        title: "TIER 2: ESSENTIALS (Highly Recommended)",
        sourceDocument: "Command Center Setup SOP",
        items: [
          { id: "ccs-hw-t2-1", label: "Ergonomics:" },
          { id: "ccs-hw-t2-2", label: "Lighting:" },
          { id: "ccs-hw-t2-3", label: "Cable Management:" },
        ],
      },
    ],
  },
  {
    id: "ccs-software",
    title: "3.0 Software Stack",
    sourceDocument: "Command Center Setup SOP",
    items: [
      { id: "ccs-sw-1", label: "OS:" },
      { id: "ccs-sw-2", label: "Core Dev Environment:" },
      { id: "ccs-sw-3", label: "Google Workspace:" },
      { id: "ccs-sw-4", label: "Utilities:" },
    ],
  },
  {
    id: "ccs-setup",
    title: "5.0 Setup Procedure (Deployment Checklist)",
    sourceDocument: "Command Center Setup SOP",
    subSections: [
      {
        id: "ccs-setup-physical",
        title: "Phase 1 & 2: Physical & Hardware",
        sourceDocument: "Command Center Setup SOP",
        items: [
          { id: "ccs-setup-1", label: "Assemble and position desk." },
          { id: "ccs-setup-2", label: "Install cable management." },
          { id: "ccs-setup-3", label: "Connect monitor, keyboard, mouse." },
          { id: "ccs-setup-4", label: "Organize cables with velcro ties." },
        ],
      },
      {
        id: "ccs-setup-software",
        title: "Phase 3, 4, 5: Software & Calibration",
        sourceDocument: "Command Center Setup SOP",
        items: [
          { id: "ccs-setup-5", label: "Install all software and updates." },
          { id: "ccs-setup-6", label: "Configure VS Code, Git, and Chrome." },
          { id: "ccs-setup-7", label: "Adjust monitor height and lighting." },
          { id: "ccs-setup-8", label: "Run Protocol Integration Test." },
        ],
      },
    ],
  },
  {
    id: "ccs-budget",
    title: "7.0 Budget Summary",
    sourceDocument: "Command Center Setup SOP",
    items: [
      { id: "ccs-budget-1", label: "Tier 1: Must Haves:" },
      { id: "ccs-budget-2", label: "Tier 2: Essentials:" },
      { id: "ccs-budget-3", label: "Total Recommended (T1+T2):" },
    ],
  },
  // PixelFoldSetupSop.tsx
  {
    id: "pfs-rationale",
    title: "1.0 Device Rationale",
    sourceDocument: "Pixel Fold Setup SOP",
    description:
      "The Pixel Fold is a structured capture tool, not a distraction device. Every setting exists to support the dual-mode life structure.",
    items: [
      { id: "pfs-rat-1", label: "Native Google Workspace Integration:" },
      { id: "pfs-rat-2", label: "Dual Screen for Dual Mode:" },
      { id: "pfs-rat-3", label: "Android Ecosystem:" },
      { id: "pfs-rat-4", label: "Pixel-Exclusive Features:" },
    ],
  },
  {
    id: "pfs-initial-setup",
    title: "2.0 Initial Setup Procedure",
    sourceDocument: "Pixel Fold Setup SOP",
    items: [
      { id: "pfs-setup-1", label: "Unbox and inspect device." },
      {
        id: "pfs-setup-2",
        label:
          'Complete setup wizard, selecting "Don\'t copy" for a clean slate.',
      },
      {
        id: "pfs-setup-3",
        label: "Sign in with primary Google account and set up biometrics.",
      },
      {
        id: "pfs-setup-4",
        label: "Install all system updates until the device is current.",
      },
      {
        id: "pfs-setup-5",
        label:
          "Configure Display (Dark theme ON, 5 min timeout) and Sound (DND schedule set for work blocks).",
      },
    ],
  },
  {
    id: "pfs-gworkspace",
    title: "3.0 Google Workspace Integration",
    sourceDocument: "Pixel Fold Setup SOP",
    items: [
      { id: "pfs-gws-1", label: "Account Sync:" },
      { id: "pfs-gws-2", label: "Gmail:" },
      { id: "pfs-gws-3", label: "Calendar:" },
      { id: "pfs-gws-4", label: "Keep:" },
    ],
  },
  {
    id: "pfs-apps",
    title: "4.0 App Installation & Configuration",
    sourceDocument: "Pixel Fold Setup SOP",
    items: [
      { id: "pfs-apps-1", label: "Essential Apps:" },
      { id: "pfs-apps-2", label: "Productivity:" },
      { id: "pfs-apps-3", label: "Communication (Minimal):" },
    ],
  },
  {
    id: "pfs-focus-mode",
    title: "5.0 Focus Mode Configuration",
    sourceDocument: "Pixel Fold Setup SOP",
    items: [
      { id: "pfs-focus-1", label: "Solo Execution Mode:" },
      { id: "pfs-focus-2", label: "Family Time Mode:" },
    ],
  },
  {
    id: "pfs-home-screen",
    title: "6.0 Home Screen Optimization",
    sourceDocument: "Pixel Fold Setup SOP",
    items: [
      { id: "pfs-home-1", label: "Outer Screen (Quick Capture):" },
      { id: "pfs-home-2", label: "Inner Screen (Work Layout):" },
      { id: "pfs-home-3", label: "Wallpaper:" },
    ],
  },
  {
    id: "pfs-maintenance",
    title: "12.0 Maintenance Protocols",
    sourceDocument: "Pixel Fold Setup SOP",
    items: [
      { id: "pfs-maint-1", label: "Daily (2 min):" },
      { id: "pfs-maint-2", label: "Weekly (During WRP):" },
      { id: "pfs-maint-3", label: "Monthly:" },
    ],
  },
  {
    id: "pfs-budget",
    title: "16.0 Budget & Procurement",
    sourceDocument: "Pixel Fold Setup SOP",
    items: [
      { id: "pfs-budget-1", label: "Pixel 9 Pro Fold (Unlocked):" },
      { id: "pfs-budget-2", label: "Official Case:" },
      { id: "pfs-budget-3", label: "Portable Battery Pack (20,000mAh):" },
    ],
  },
  // AccessibilitySafetyProtocol.tsx
  {
    id: "asp-purpose",
    title: "Purpose",
    sourceDocument: "Accessibility & Safety Protocol",
    items: [
      {
        id: "asp-purpose-1",
        label:
          "Ensure the Wonky Sprout OS site is safe, stable, and usable for late-diagnosed and neurodivergent users.",
      },
      {
        id: "asp-purpose-2",
        label:
          "Provide a minimal, actionable checklist and developer workflow to prevent regressions that harm accessibility.",
      },
    ],
  },
  {
    id: "asp-why",
    title: "Why This Matters",
    sourceDocument: "Accessibility & Safety Protocol",
    description:
      'Many people were mis-labeled as "lazy" when their brains needed different supports. The site must not add friction. This protocol ensures the system itself does not become a source of chaos.',
  },
  {
    id: "asp-core",
    title: "Core Principles (Checklist)",
    sourceDocument: "Accessibility & Safety Protocol",
    items: [
      { id: "asp-core-1", label: "Reduce Cognitive Load:" },
      { id: "asp-core-2", label: "Ensure Keyboard Navigability:" },
      { id: "asp-core-3", label: "Provide Clear Structure:" },
      { id: "asp-core-4", label: "High Contrast as Default:" },
      { id: "asp-core-5", label: "No Ambiguity:" },
    ],
  },
  // BubbleShieldProtocol.tsx
  {
    id: "bsp-purpose",
    title: "Purpose",
    sourceDocument: "Bubble Shield Protocol",
    description:
      'To define and mandate the use of sensory mitigation tools as non-negotiable assistive technology. This hardware is required to maintain stable executive function and prevent sensory overload/burnout. Treating these items as "wants" is a non-conforming condition.',
  },
  {
    id: "bsp-audio",
    title: "1.0 AUDITORY FIX (THE 'SOUND FILTER')",
    sourceDocument: "Bubble Shield Protocol",
    description:
      "Non-Conforming Condition: Unpredictable, unpleasant noise (airplanes, voices, police sirens).",
    items: [
      { id: "bsp-audio-1", label: "Mandatory Hardware:" },
      { id: "bsp-audio-2", label: "Protocol:" },
      { id: "bsp-audio-3", label: "Function:" },
    ],
  },
  {
    id: "bsp-visual",
    title: "2.0 VISUAL FIX (THE 'LIGHT FILTER')",
    sourceDocument: "Bubble Shield Protocol",
    description:
      "Non-Conforming Condition: Overstimulation from harsh, bright, or flickering light sources (fluorescents, sunlight, screen glare).",
    items: [
      { id: "bsp-visual-1", label: "Mandatory Hardware:" },
      { id: "bsp-visual-2", label: "Protocol:" },
    ],
  },
  {
    id: "bsp-tactile",
    title: "3.0 TACTILE/MOTION FIX (THE 'GROUNDING SYSTEM')",
    sourceDocument: "Bubble Shield Protocol",
    description:
      "Non-Conforming Condition: Internal restlessness (ADHD/Vyvanse response) and difficulty transitioning focus.",
    items: [
      { id: "bsp-tactile-1", label: "Weighted Blanket/Vest:" },
      { id: "bsp-tactile-2", label: "Fidget Cube/Tool:" },
      { id: "bsp-tactile-3", label: "Ergonomic Chair/Standing Desk:" },
    ],
  },
  {
    id: "bsp-other",
    title: "4.0 Other Critical Sensory Items",
    sourceDocument: "Bubble Shield Protocol",
    description:
      'The underlying cause of many daily "non-conforming conditions" is sensory input mismatch. Other items that often transition from "want" to "need":',
    items: [
      { id: "bsp-other-1", label: "Non-Verbal Communication Aids:" },
      { id: "bsp-other-2", label: "Textured/Comfort Items:" },
      { id: "bsp-other-3", label: "Routine Visuals:" },
    ],
  },
  // Manifesto.tsx
  {
    id: "man-diagnosis",
    title: "I. THE DIAGNOSIS (WHAT'S BROKEN)",
    sourceDocument: "Manifesto",
    description: `<p>I am a 40-year-old man diagnosed with <strong>Autism Spectrum Disorder (ASD)</strong> and <strong>ADHD</strong> in 2024. For 15 years, I was a <strong>Navy Systems Diagnostician</strong>—my job was to find the root cause of system failures, not patch holes.</p><p class="mt-2">When I turned that diagnostic lens on my own life, the pattern became clear:</p>`,
    subSections: [
      {
        id: "man-diag-list",
        title: "Hidden",
        sourceDocument: "Manifesto",
        items: [
          { id: "man-diag-item-1", label: "The Problem:" },
          { id: "man-diag-item-2", label: 'The Typical "Solution":' },
          { id: "man-diag-item-3", label: "The Result:" },
        ],
      },
    ],
  },
  {
    id: "man-shift",
    title: "II. THE SHIFT (REFRAMING THE INPUT)",
    sourceDocument: "Manifesto",
    description: `<p>I became a father to two kids. I became a co-parent navigating custody schedules. The chaos increased exponentially.</p><p class="mt-2"><strong>The Realization:</strong> My brain is not broken. It's a <strong>high-performance engine</strong> optimized for pattern recognition, hyper-focus, and systems-level thinking. The chaos is not my fault—it's the <strong>external load</strong> the system must handle.</p><p class="mt-2"><strong>The Engineering Question:</strong> What if I stopped trying to "fix" my brain and instead <strong>built structure to absorb the chaos?</strong></p><p class="mt-2 font-semibold">This is the shift from <strong>self-blame to systems design</strong>.</p>`,
  },
  {
    id: "man-structure",
    title: "III. THE STRUCTURE (THE ENGINEERING SOLUTION)",
    sourceDocument: "Manifesto",
    subSections: [
      {
        id: "man-struct-dual",
        title: "The Dual-Mode Protocol",
        sourceDocument: "Manifesto",
        description: `<p>Life is not one continuous state. It alternates between two distinct operating modes:</p><div class="pl-4 border-l-4 border-gray-700 my-4 py-2"><h4 class="font-bold text-accent-blue mt-2">MODE 1: SOLO EXECUTION (Mon 6PM → Fri 4PM)</h4><ul class="list-disc list-inside ml-4"><li><strong>Purpose:</strong> Deep work, system building, high-output engineering</li><li><strong>Structure:</strong> 7-hour focus blocks, minimal distractions, Bubble Shield protocols</li></ul><h4 class="font-bold text-accent-blue mt-4">MODE 2: FAMILY STRUCTURE (Fri 4PM → Mon 6PM)</h4><ul class="list-disc list-inside ml-4"><li><strong>Purpose:</strong> High-vigilance parenting, structured family time</li><li><strong>Structure:</strong> Hourly schedules, visual timers, sensory breaks</li></ul></div><p><strong>The Fix:</strong> By separating these modes and designing protocols for each, the system can handle both without failure.</p>`,
      },
      {
        id: "man-struct-fdp",
        title: "The Foundational Daily Protocols (The Non-Negotiables)",
        sourceDocument: "Manifesto",
        description:
          "These 5 protocols run <strong>every single day</strong>, regardless of mode:",
        items: [
          { id: "man-fdp-1", label: "Water Protocol" },
          { id: "man-fdp-2", label: "Pill Protocol" },
          { id: "man-fdp-3", label: "Chaos Capture Protocol" },
          { id: "man-fdp-4", label: "Sleep Fence Protocol" },
          { id: "man-fdp-5", label: "Daily Dump Protocol" },
        ],
      },
    ],
  },
  {
    id: "man-bs",
    title: "VI. THE ANTI-BS COMMITMENT (THE VIBE)",
    sourceDocument: "Manifesto",
    description:
      'This brand operates under the <strong>"Anti-BS" framework</strong>:',
    subSections: [
      {
        id: "man-bs-do",
        title: "What I DO:",
        sourceDocument: "Manifesto",
        items: [
          { id: "man-bs-do-1", label: "Provide exact steps" },
          {
            id: "man-bs-do-2",
            label: "Acknowledge executive dysfunction openly",
          },
          {
            id: "man-bs-do-3",
            label: "Build systems that work when your brain doesn't",
          },
          { id: "man-bs-do-4", label: 'Use direct language ("This fixes X")' },
        ],
      },
      {
        id: "man-bs-dont",
        title: "What I DON'T DO:",
        sourceDocument: "Manifesto",
        items: [
          { id: "man-bs-dont-1", label: "Write motivational fluff" },
          { id: "man-bs-dont-2", label: "Use corporate jargon or buzzwords" },
          {
            id: "man-bs-dont-3",
            label: "Pretend systems don't require maintenance",
          },
          { id: "man-bs-dont-4", label: 'Create "inspiration" without action' },
        ],
      },
    ],
  },
  // HeadphoneControllerIpi.tsx
  {
    id: "hc-purpose",
    title: "1.0 PURPOSE",
    sourceDocument: "Headphone Controller IPI",
    description:
      'To "fix" the "chaos" of the mobile-only Soundcore app by reverse engineering its Bluetooth commands and building a "structured" desktop controller in VS Code.',
  },
  {
    id: "hc-phase1",
    title: '2.0 PHASE 1: CAPTURE THE "CHAOS" (Bluetooth Packet Sniffing)',
    sourceDocument: "Headphone Controller IPI",
    description: `This is the "classicwilly"<em class="text-text-light text-opacity-70 text-sm"> [cite: (file: CLASSICWILLY_SOP.md)]</em> / "Google fanboy"<em class="text-text-light text-opacity-70 text-sm"> [cite: (user instruction)]</em> solution. We will use your Pixel Fold to capture the "secret code."`,
    items: [
      { id: "hc-p1-1", label: "Enable Developer Options on your Pixel Fold" },
      { id: "hc-p1-2", label: "Enable Bluetooth HCI Snoop Log" },
      { id: "hc-p1-3", label: 'Generate the "Chaos" Data:' },
      { id: "hc-p1-4", label: "Turn Bluetooth HCI snoop log OFF." },
      { id: "hc-p1-5", label: 'Retrieve the "Card Catalog":' },
    ],
  },
  {
    id: "hc-phase2",
    title: '3.0 PHASE 2: DIAGNOSE THE "CARD CATALOG" (Find the "Fix")',
    sourceDocument: "Headphone Controller IPI",
    items: [
      { id: "hc-p2-1", label: 'Install the "Analyzer":' },
      { id: "hc-p2-2", label: 'Find the "Fix":' },
    ],
  },
  {
    id: "hc-phase3",
    title: '4.0 PHASE 3: BUILD THE "FIX" (The VS Code Prompt)',
    sourceDocument: "Headphone Controller IPI",
    description:
      'Now we build the app. We will use Electron (what VS Code is built on) and Node.js (for Bluetooth control).<br/><br/>Here is the 11/10-perfection "vibe coding" prompt for GitHub Copilot. Paste this into a new .js file in a new WONKY_SPROUT_CONTROLLER folder in VS Code.',
    subSections: [
      {
        id: "hc-prompt",
        title: 'Copilot Prompt (The "Vibe Code")',
        sourceDocument: "Headphone Controller IPI",
        description: `"Hey Copilot. I'm a Systems Diagnostician building an "anti-BS" desktop tool with Electron and Node.js to "fix" my workflow. I need to control my Bluetooth (BLE) headphones directly. I have already reverse-engineered the "chaos" and found the "fix" (the specific hex commands).

Set up a new, "structured" Electron.js project. Install the noble library.

Using noble, write the "anti-BS" async function to:
1. Scan for BLE devices.
2. Find my "Soundcore Space One" headphones.
3. Connect to the device.
4. Discover the specific "Service" and "Characteristic" (which I will provide).

Create three "fix-it" functions in the Electron main.js that I can call from my HTML button:
- setTransparencyLevel_1()
- setTransparencyLevel_3()
- setTransparencyLevel_5()

Each function must "fix" the "chaos" by writing the specific hex command to the correct Bluetooth characteristic.

Give me the complete "card catalog" for the main.js (the "structure") and index.html (the "anti-BS" UI) to execute this "fix.""`,
      },
    ],
  },
  // SystemIntegrationGuide.tsx
  {
    id: "sig-calendar",
    title: "1. Google Calendar: Structure Your Time",
    sourceDocument: "System Integration Guide",
    items: [
      {
        id: "sig-gc-1",
        label:
          'Map "Solo Execution Mode" blocks (Deep Work, Breaks, Nutrient Intake) directly to Calendar events.',
      },
      {
        id: "sig-gc-2",
        label:
          'Schedule "Foundational Daily Protocols" as recurring daily tasks to ensure non-negotiable compliance.',
      },
      {
        id: "sig-gc-3",
        label:
          "Color-code event types (e.g., Teal for Deep Work, Blue for Family Time) for immediate visual context.",
      },
    ],
  },
  {
    id: "sig-keep",
    title: "2. Google Keep: Capture & Prioritize Chaos",
    sourceDocument: "System Integration Guide",
    items: [
      {
        id: "sig-gk-1",
        label:
          'Utilize Keep for the "Capture" protocol: voice notes, rapid text inputs, images. Externalize all emergent data.',
      },
      {
        id: "sig-gk-2",
        label:
          'Create dedicated notes for "Daily Dump" sessions, archiving processed thoughts and verifying system state.',
      },
      {
        id: "sig-gk-3",
        label:
          "Employ labels (e.g., `#idea`, `#task`, `#research`) for efficient triage and retrieval.",
      },
    ],
  },
  {
    id: "sig-tasks",
    title: "3. Google Tasks: Actionable Item Management",
    sourceDocument: "System Integration Guide",
    items: [
      {
        id: "sig-gt-1",
        label:
          "Break down complex SOP steps into discrete, actionable tasks. Assign due dates to critical items.",
      },
      {
        id: "sig-gt-2",
        label:
          "Prioritize tasks according to the WS-OS Hierarchy (Sleep → Food → Water → Medicine → Children → House → Work → Play).",
      },
      {
        id: "sig-gt-3",
        label:
          "Integrate with Calendar to see tasks alongside scheduled events, providing a holistic view of commitments.",
      },
    ],
  },
  // CoParentingProtocol.tsx
  {
    id: "cpp-purpose",
    title: "Purpose",
    sourceDocument: "Co-Parenting Protocol",
    description:
      "To create a predictable, fact-based communication and logistics system that minimizes conflict, reduces decision fatigue, and ensures the children's needs are met consistently across both households.",
  },
  {
    id: "cpp-principles",
    title: "Core Principles",
    sourceDocument: "Co-Parenting Protocol",
    items: [
      { id: "cpp-prin-1", label: "Kids First, Always:" },
      { id: "cpp-prin-2", label: "Communicate Like Colleagues:" },
      { id: "cpp-prin-3", label: "Facts Over Feelings:" },
      { id: "cpp-prin-4", label: "Respect Boundaries and Time:" },
      { id: "cpp-prin-5", label: "Consistency is Key:" },
    ],
  },
  {
    id: "cpp-de-escalation",
    title: "Emergency De-escalation Checklist",
    sourceDocument: "Co-Parenting Protocol",
    description:
      "If a text exchange becomes emotionally charged, execute this IPI immediately.",
    items: [
      { id: "cpp-deesc-1", label: "Step 1: STOP." },
      { id: "cpp-deesc-2", label: "Step 2: Acknowledge & Defer." },
      { id: "cpp-deesc-3", label: "Step 3: Disengage." },
    ],
  },
  {
    id: "cpp-handoffs",
    title: "Handoff Protocol (Friday & Monday)",
    sourceDocument: "Co-Parenting Protocol",
    description:
      "Handoffs are brief, logistical transfers. They are not the time for big discussions.",
    subSections: [
      {
        id: "cpp-handoff-bag",
        title: "🎒 Bag Checklist (Both Ways)",
        sourceDocument: "Co-Parenting Protocol",
        items: [
          { id: "cpp-handoff-bag-1", label: "School Backpack (with homework)" },
          { id: "cpp-handoff-bag-2", label: "Any Necessary Medications" },
          {
            id: "cpp-handoff-bag-3",
            label: "Comfort Items (stuffed animals, etc.)",
          },
          {
            id: "cpp-handoff-bag-4",
            label: "Specific Clothing/Items for Weekend/Week",
          },
          { id: "cpp-handoff-bag-5", label: "Phone/Charger (for Sebastian)" },
        ],
      },
      {
        id: "cpp-handoff-verbal",
        title: "🗣️ Verbal Update (2-Minute Max)",
        sourceDocument: "Co-Parenting Protocol",
        items: [
          {
            id: "cpp-handoff-verb-1",
            label: '"Any health updates? Fevers, pains?"',
          },
          {
            id: "cpp-handoff-verb-2",
            label: '"Any behavioral notes, good or bad?"',
          },
          {
            id: "cpp-handoff-verb-3",
            label: '"Any important school notes/deadlines?"',
          },
          {
            id: "cpp-handoff-verb-4",
            label: '"Everything they need is in their bag."',
          },
        ],
      },
    ],
  },
  {
    id: "cpp-emergency",
    title: "Emergency Protocol",
    sourceDocument: "Co-Parenting Protocol",
    description: "For true medical emergencies or urgent school issues.",
    items: [
      { id: "cpp-emer-1", label: "Step 1: Call." },
      { id: "cpp-emer-2", label: "Step 2: Text." },
      { id: "cpp-emer-3", label: "Step 3: Update." },
    ],
  },
];
