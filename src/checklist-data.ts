import type { ChecklistSectionData } from './types.js';

export const ALL_CHECKLIST_DATA: ChecklistSectionData[] = [
  // EssentialsTracker (from CommandCenter)
  {
    id: 'essentials-tracker',
    title: 'Daily Essentials',
    sourceDocument: 'The Cockpit',
    subSections: [
        {
            id: 'essentials-meds-section',
            title: '💊 Medicine',
            sourceDocument: 'Command Center',
            items: [
                { id: 'essentials-meds-am', label: 'Morning' },
                { id: 'essentials-meds-noon', label: 'Noon' },
                { id: 'essentials-meds-pm', label: 'Night' },
            ]
        },
        {
            id: 'essentials-hydration-section',
            title: '💧 Hydration',
            sourceDocument: 'Command Center',
            items: [
                { id: 'essentials-water-1', label: 'Cup 1' },
                { id: 'essentials-water-2', label: 'Cup 2' },
                { id: 'essentials-water-3', label: 'Cup 3' },
                { id: 'essentials-water-4', label: 'Cup 4' },
            ]
        },
        {
            id: 'essentials-nutrition-section',
            title: '🍎 Nutrition',
            sourceDocument: 'Command Center',
            items: [
                { id: 'essentials-food-1', label: 'Breakfast' },
                { id: 'essentials-food-2', label: 'Lunch' },
                { id: 'essentials-food-3', label: 'Dinner' },
            ]
        },
    ]
  },
  // Willow's Corner
  {
    id: 'wc-weekend',
    title: '📋 Weekend with Dad Checklist',
    sourceDocument: "Willow's Corner",
    subSections: [
        {
            id: 'wc-weekend-morning',
            title: "Morning",
            sourceDocument: "Willow's Corner",
            items: [
              { id: 'kwp-willow-daily-morning-1', label: 'Brush hair', gemAwardId: 'morning-hair', gemRecipient: 'willow', large: true },
              { id: 'kwp-willow-daily-morning-2', label: 'Brush teeth', gemAwardId: 'morning-teeth', gemRecipient: 'willow', large: true },
              { id: 'kwp-willow-daily-morning-3', label: 'Change clothes', gemAwardId: 'morning-clothes', gemRecipient: 'willow', large: true },
              { id: 'kwp-willow-daily-morning-5', label: 'Water', gemAwardId: 'morning-water', gemRecipient: 'willow', large: true },
              { id: 'kwp-willow-daily-morning-6', label: 'Feed Pets', gemAwardId: 'morning-pets', gemRecipient: 'willow', large: true },
            ]
        },
        {
            id: 'wc-weekend-prep',
            title: "Sunday Prep",
            sourceDocument: "Willow's Corner",
            items: [
                { id: 'kwp-willow-sunprep-1', label: 'Make your bed', gemAwardId: 'prep-bed', gemRecipient: 'willow', large: true },
                { id: 'kwp-willow-sunprep-2', label: 'Pick Monday school outfit', gemAwardId: 'prep-outfit', gemRecipient: 'willow', large: true },
                { id: 'kwp-willow-sunprep-3', label: 'Pack school backpack', gemAwardId: 'prep-pack', gemRecipient: 'willow', large: true },
                { id: 'kwp-willow-sunprep-4', label: 'Do your chores', gemAwardId: 'prep-chores', gemRecipient: 'willow', large: true },
                { id: 'kwp-willow-sunprep-5', label: 'Help Dad with house prep', gemAwardId: 'prep-help', gemRecipient: 'willow', large: true },
            ]
        },
    ]
  },
  {
    id: 'wc-weekday',
    title: "📋 Weekdays at Mom's Checklist",
    sourceDocument: "Willow's Corner",
    subSections: [
        {
            id: 'wc-weekday-morning',
            title: "Morning",
            sourceDocument: "Willow's Corner",
            items: [
                { id: 'kwp-willow-moms-morning-1', label: 'Wake up on time', gemAwardId: 'moms-wake', gemRecipient: 'willow', large: true },
                { id: 'kwp-willow-moms-morning-2', label: 'Get dressed', gemAwardId: 'moms-dress', gemRecipient: 'willow', large: true },
                { id: 'kwp-willow-moms-morning-4', label: 'Brush teeth', gemAwardId: 'moms-teeth-am', gemRecipient: 'willow', large: true },
                { id: 'kwp-willow-moms-morning-5', label: 'Brush hair', gemAwardId: 'moms-hair', gemRecipient: 'willow', large: true },
                { id: 'kwp-willow-moms-morning-6', label: 'Pack backpack', gemAwardId: 'moms-pack', gemRecipient: 'willow', large: true },
                { id: 'kwp-willow-moms-morning-7', label: 'Get to school ⭐', gemAwardId: 'moms-school', gemRecipient: 'willow', large: true },
            ]
        },
        {
            id: 'wc-weekday-evening',
            title: "Evening",
            sourceDocument: "Willow's Corner",
            items: [
                { id: 'kwp-willow-moms-afternoon-2', label: 'Put backpack away', gemAwardId: 'moms-unpack', gemRecipient: 'willow', large: true },
                { id: 'kwp-willow-moms-afternoon-5', label: 'Do homework', gemAwardId: 'moms-homework', gemRecipient: 'willow', large: true },
                { id: 'kwp-willow-moms-evening-2', label: 'Clean up spot', gemAwardId: 'moms-cleanup', gemRecipient: 'willow', large: true },
                { id: 'kwp-willow-moms-evening-5', label: 'Brush teeth', gemAwardId: 'moms-teeth-pm', gemRecipient: 'willow', large: true },
                { id: 'kwp-willow-moms-evening-6', label: 'Get bag ready', gemAwardId: 'moms-prep-pm', gemRecipient: 'willow', large: true },
            ]
        }
    ]
  },
  // Bash's Corner
  {
    id: 'bc-weekend',
    title: '📋 Weekend with Dad Checklist',
    sourceDocument: "Bash's Corner",
    subSections: [
        {
            id: 'bc-weekend-morning',
            title: "Morning",
            sourceDocument: "Bash's Corner",
            items: [
              { id: 'kwp-sebastian-daily-morning-1', label: 'Brush hair', gemAwardId: 'morning-hair', gemRecipient: 'sebastian', large: true },
              { id: 'kwp-sebastian-daily-morning-2', label: 'Brush teeth', gemAwardId: 'morning-teeth', gemRecipient: 'sebastian', large: true },
              { id: 'kwp-sebastian-daily-morning-3', label: 'Change clothes', gemAwardId: 'morning-clothes', gemRecipient: 'sebastian', large: true },
              { id: 'kwp-sebastian-daily-morning-5', label: 'Water', gemAwardId: 'morning-water', gemRecipient: 'sebastian', large: true },
              { id: 'kwp-sebastian-daily-morning-6', label: 'Feed Pets', gemAwardId: 'morning-pets', gemRecipient: 'sebastian', large: true },
            ]
        },
        {
            id: 'bc-weekend-prep',
            title: "Sunday Prep",
            sourceDocument: "Bash's Corner",
            items: [
                { id: 'kwp-sebastian-sunprep-1', label: 'Make your bed', gemAwardId: 'prep-bed', gemRecipient: 'sebastian', large: true },
                { id: 'kwp-sebastian-sunprep-2', label: 'Pick Monday school outfit', gemAwardId: 'prep-outfit', gemRecipient: 'sebastian', large: true },
                { id: 'kwp-sebastian-sunprep-3', label: 'Pack school backpack', gemAwardId: 'prep-pack', gemRecipient: 'sebastian', large: true },
                { id: 'kwp-sebastian-sunprep-4', label: 'Do your chores', gemAwardId: 'prep-chores', gemRecipient: 'sebastian', large: true },
                { id: 'kwp-sebastian-sunprep-5', label: 'Help Dad with house prep', gemAwardId: 'prep-help', gemRecipient: 'sebastian', large: true },
            ]
        }
    ]
  },
  {
    id: 'bc-weekday',
    title: "📋 Weekdays at Mom's Checklist",
    sourceDocument: "Bash's Corner",
    subSections: [
        {
            id: 'bc-weekday-morning',
            title: "Morning",
            sourceDocument: "Bash's Corner",
            items: [
                { id: 'kwp-sebastian-moms-morning-1', label: 'Wake up on time', gemAwardId: 'moms-wake', gemRecipient: 'sebastian', large: true },
                { id: 'kwp-sebastian-moms-morning-2', label: 'Get dressed', gemAwardId: 'moms-dress', gemRecipient: 'sebastian', large: true },
                { id: 'kwp-sebastian-moms-morning-4', label: 'Brush teeth', gemAwardId: 'moms-teeth-am', gemRecipient: 'sebastian', large: true },
                { id: 'kwp-sebastian-moms-morning-5', label: 'Brush hair', gemAwardId: 'moms-hair', gemRecipient: 'sebastian', large: true },
                { id: 'kwp-sebastian-moms-morning-6', label: 'Pack backpack', gemAwardId: 'moms-pack', gemRecipient: 'sebastian', large: true },
                { id: 'kwp-sebastian-moms-morning-7', label: 'Get to school ⭐', gemAwardId: 'moms-school', gemRecipient: 'sebastian', large: true },
            ]
        },
        {
            id: 'bc-weekday-evening',
            title: "Evening",
            sourceDocument: "Bash's Corner",
            items: [
               { id: 'kwp-sebastian-moms-afternoon-2', label: 'Put backpack away', gemAwardId: 'moms-unpack', gemRecipient: 'sebastian', large: true },
               { id: 'kwp-sebastian-moms-afternoon-5', label: 'Do homework', gemAwardId: 'moms-homework', gemRecipient: 'sebastian', large: true },
               { id: 'kwp-sebastian-moms-evening-2', label: 'Clean up spot', gemAwardId: 'moms-cleanup', gemRecipient: 'sebastian', large: true },
               { id: 'kwp-sebastian-moms-evening-5', label: 'Brush teeth', gemAwardId: 'moms-teeth-pm', gemRecipient: 'sebastian', large: true },
               { id: 'kwp-sebastian-moms-evening-6', label: 'Get bag ready', gemAwardId: 'moms-prep-pm', gemRecipient: 'sebastian', large: true },
            ]
        }
    ]
  },
  // FoundationalProtocols.tsx
  {
    id: 'fp-checklist',
    title: 'Execution Checklist',
    sourceDocument: 'Foundational Protocols',
    subSections: [
        {
            id: 'fp-checklist-morning',
            title: "Morning",
            sourceDocument: 'Foundational Protocols',
            items: [
              { id: 'fdp-check-1', label: 'Wake at 6:00 AM' },
              { id: 'fdp-check-2', label: 'Drink 16 oz water immediately' },
              { id: 'fdp-check-3', label: 'Take all pills from organizer' },
            ]
        },
        {
            id: 'fp-checklist-allday',
            title: "All Day",
            sourceDocument: 'Foundational Protocols',
            items: [
              { id: 'fdp-check-4', label: 'Capture Protocol active' },
              { id: 'fdp-check-5', label: 'Process nothing—only capture' },
            ]
        },
        {
            id: 'fp-checklist-evening',
            title: "Evening",
            sourceDocument: 'Foundational Protocols',
            items: [
              { id: 'fdp-check-6', label: '10:00 PM - Begin wind down' },
              { id: 'fdp-check-7', label: '10:25 PM - Write 3 critical tasks' },
              { id: 'fdp-check-8', label: '10:30 PM - In bed, lights out', achievementAwardId: 'foundational-day-complete' },
            ]
        }
    ]
  },
  {
    id: 'fp-failure',
    title: 'Failure Protocol',
    sourceDocument: 'Foundational Protocols',
    description: "If you miss a protocol:",
    items: [
      { id: 'fdp-fail-1', label: 'Water/Pill Missed:' },
      { id: 'fdp-fail-2', label: 'Capture Missed:' },
      { id: 'fdp-fail-3', label: 'Sleep Anchor Missed:' },
    ]
  },
  // ContextSwitchingProtocol.tsx
  {
    id: 'csp-recognition',
    title: 'RECOGNITION SIGNALS',
    sourceDocument: 'Airlock Protocol',
    description: 'Execute this protocol when:',
    items: [
      { id: 'cs-recog-1', label: 'Someone interrupts you during deep work (knock, call, "quick question").' },
      { id: 'cs-recog-2', label: 'An emergency requires immediate attention (child hurt, system alert).' },
      { id: 'cs-recog-3', label: 'You must switch between Solo and Family modes mid-task.' },
      { id: 'cs-recog-4', label: 'A meeting starts while you\'re mid-flow.' },
      { id: 'cs-recog-5', label: 'Technical failure forces you to abandon the current task.' },
    ]
  },
  {
    id: 'csp-phase1',
    title: 'PHASE 1: IMMEDIATE CAPTURE (30-90 Seconds)',
    sourceDocument: 'Context Switching Protocol',
    items: [
      { id: 'cs-p1-1', label: 'Step 1: STOP and Freeze (5 seconds)' },
      { id: 'cs-p1-2', label: 'Step 2: Active Task Capture (20 seconds)' },
      { id: 'cs-p1-3', label: 'Screen State Capture (10 seconds)' },
      { id: 'cs-p1-4', label: 'Step 4: Save All Work (10 seconds)' },
    ]
  },
  {
    id: 'csp-phase2',
    title: 'PHASE 2: INTERRUPT HANDLING',
    sourceDocument: 'Context Switching Protocol',
    items: [
      { id: 'cs-p2-1', label: 'Step 5: Interrupt Triage (10 seconds)' },
      { id: 'cs-p2-2', label: 'Step 6: Handle or Defer' },
    ]
  },
  {
    id: 'csp-phase3',
    title: 'PHASE 3: CONTEXT RELOAD (2-5 Minutes)',
    sourceDocument: 'Context Switching Protocol',
    items: [
      { id: 'cs-p3-1', label: 'Step 7: Transition Buffer (60 seconds)' },
      { id: 'cs-p3-2', label: 'Step 8: Read Your Capture (30 seconds)' },
      { id: 'cs-p3-3', label: 'Step 9: Visual Context Reload (30 seconds)' },
      { id: 'cs-p3-4', label: 'Step 10: Micro-Restart (30 seconds)' },
      { id: 'cs-p3-5', label: 'Step 11: Timer + Re-Engage' },
    ]
  },
    // ExecutiveDysfunctionProtocol.tsx
  {
    id: 'edp-recognition',
    title: 'RECOGNITION SIGNALS',
    sourceDocument: 'Executive Dysfunction Protocol',
    description: 'If 3 or more signals are present: STOP EVERYTHING. Execute this protocol immediately.',
    items: [
      { id: 'ed-recog-1', label: 'You\'ve been staring at your task list for 10+ minutes without starting anything.' },
      { id: 'ed-recog-2', label: 'Simple tasks feel overwhelming (making coffee, opening a file).' },
      { id: 'ed-recog-3', label: 'You\'re scrolling but not actually reading or enjoying it.' },
      { id: 'ed-recog-4', label: 'You feel physically heavy or stuck in your chair.' },
      { id: 'ed-recog-5', label: 'Time is passing but you\'re not doing anything productive or restful.' },
      { id: 'ed-recog-6', label: 'You\'re thinking "I should just..." but your body won\'t move.' },
      { id: 'ed-recog-7', label: 'You feel guilt/shame about not working but still can\'t start.' },
    ]
  },
  {
    id: 'edp-phase1',
    title: 'PHASE 1: BODY RESET (5 Minutes)',
    sourceDocument: 'Executive Dysfunction Protocol',
    items: [
      { id: 'ed-p1-1', label: 'Step 1: Water Fix (60 seconds)' },
      { id: 'ed-p1-2', label: 'Step 2: Food Check (60 seconds)' },
      { id: 'ed-p1-3', label: 'Step 3: Medication Check (30 seconds)' },
      { id: 'ed-p1-4', label: 'Step 4: Movement Protocol (3 minutes)' },
    ]
  },
  {
    id: 'edp-phase2',
    title: 'PHASE 2: ENVIRONMENT RESET (3 Minutes)',
    sourceDocument: 'Executive Dysfunction Protocol',
    items: [
      { id: 'ed-p2-1', label: 'Step 5: Bubble Shield Deployment (60 seconds)' },
      { id: 'ed-p2-2', label: 'Step 6: Visual Chaos Reduction (90 seconds)' },
    ]
  },
  {
    id: 'edp-phase3',
    title: 'PHASE 3: TASK RESET (3 Minutes)',
    sourceDocument: 'Executive Dysfunction Protocol',
    items: [
      { id: 'ed-p3-1', label: 'Step 7: Task Selection (30 seconds)' },
      { id: 'ed-p3-2', label: 'Step 8: Micro-Action Extraction (60 seconds)' },
      { id: 'ed-p3-3', label: 'Step 9: Timer + Execute' },
    ]
  },
  {
    id: 'edp-success',
    title: 'SUCCESS METRICS',
    sourceDocument: 'Executive Dysfunction Protocol',
    description: 'You have succeeded when you have completed at least one 10-minute task block, addressed a physical root cause, and broken the scroll/stare paralysis cycle.',
  },
    // SensoryOverloadProtocol.tsx
  {
    id: 'sop-recognition',
    title: 'RECOGNITION SIGNALS',
    sourceDocument: 'Sensory Overload Protocol',
    description: 'If 3 or more signals are present: Execute this protocol immediately. Do not wait.',
    subSections: [
      {
        id: 'sop-recog-aud',
        title: 'Auditory Overload',
        sourceDocument: 'Sensory Overload Protocol',
        items: [
          { id: 'so-recog-aud-1', label: 'Normal conversation volume feels like shouting.' },
          { id: 'so-recog-aud-2', label: 'Background noise is physically painful.' },
          { id: 'so-recog-aud-3', label: 'Multiple sound sources are happening and you can\'t filter them.' },
        ]
      },
      {
        id: 'sop-recog-vis',
        title: 'Visual Overload',
        sourceDocument: 'Sensory Overload Protocol',
        items: [
          { id: 'so-recog-vis-1', label: 'Lights feel too bright, even normal indoor lighting.' },
          { id: 'so-recog-vis-2', label: 'Movement in your peripheral vision is deeply distracting.' },
          { id: 'so-recog-vis-3', label: 'You want to close your eyes or seek darkness.' },
        ]
      },
      {
        id: 'sop-recog-tac',
        title: 'Tactile Overload',
        sourceDocument: 'Sensory Overload Protocol',
        items: [
          { id: 'so-recog-tac-1', label: 'Your clothing feels wrong (tags, seams, tightness).' },
          { id: 'so-recog-tac-2', label: 'Touch from others is irritating or painful.' },
          { id: 'so-recog-tac-3', label: 'Your skin feels hypersensitive to air or fabric.' },
        ]
      },
      {
        id: 'sop-recog-sys',
        title: 'Systemic Overload',
        sourceDocument: 'Sensory Overload Protocol',
        items: [
          { id: 'so-recog-sys-1', label: 'You feel trapped, cornered, or claustrophobic.' },
          { id: 'so-recog-sys-2', label: 'Your fight-or-flight response is activated (heart racing, shallow breath).' },
          { id: 'so-recog-sys-3', label: 'You need everyone to stop talking, moving, and existing near you.' },
        ]
      }
    ]
  },
  {
    id: 'sop-phase1',
    title: 'PHASE 1: IMMEDIATE SENSORY REDUCTION (30-60 Seconds)',
    sourceDocument: 'Sensory Overload Protocol',
    items: [
      { id: 'so-p1-1', label: 'Step 1: Bubble Shield Emergency Deployment (10s)' },
      { id: 'so-p1-2', label: 'Step 2: Visual Reduction (15s)' },
      { id: 'so-p1-3', label: 'Step 3: Verbal Signal (5s)' },
      { id: 'so-p1-4', label: 'Step 4: Immediate Escape (30s)' },
    ]
  },
  {
    id: 'sop-phase2',
    title: 'PHASE 2: ENVIRONMENT RESET (2-5 Minutes)',
    sourceDocument: 'Sensory Overload Protocol',
    items: [
      { id: 'so-p2-1', label: 'Step 5: Location Security (30s)' },
      { id: 'so-p2-2', label: 'Step 6: Proprioceptive Input (60s)' },
      { id: 'so-p2-3', label: 'Step 7: Breathing Reset (90s)' },
    ]
  },
  {
    id: 'sop-phase3',
    title: 'PHASE 3: REGULATION & RECOVERY (10-30 Minutes)',
    sourceDocument: 'Sensory Overload Protocol',
    items: [
      { id: 'so-p3-1', label: 'Step 8: Water Protocol (30s)' },
      { id: 'so-p3-2', label: 'Step 9: Passive Regulation Activities' },
      { id: 'so-p3-3', label: 'Step 10: Gentle Re-Entry' },
    ]
  },
  {
    id: 'sop-phase4',
    title: 'PHASE 4: POST-OVERLOAD MANAGEMENT',
    sourceDocument: 'Sensory Overload Protocol',
    description: 'Action: Accept that your capacity is reduced for the rest of the day. Cancel non-essential tasks, reduce expectations, and maintain a low-sensory environment. Your sensory threshold is lowered.'
  },
   // ClassicWillyProtocol.tsx
  {
    id: 'cwp-purpose',
    title: '1.0 PURPOSE',
    sourceDocument: 'Classicwilly Protocol',
    description: `This Standard Operating Procedure (SOP) defines the operational mode for "classicwilly." This protocol is engaged when a "non-conforming condition" has been identified and 11/10-perfection "structure" is required.<p class="text-lg text-text-light text-opacity-90 mt-2 italic">"Wonky Sprout" is the system. "classicwilly" is the fixer.</p>`,
  },
  {
    id: 'cwp-scope',
    title: '2.0 SCOPE',
    sourceDocument: 'Classicwilly Protocol',
    description: 'This protocol applies when procedural, physical, or informational "chaos" must be diagnosed and fixed. It is the "anti-BS" filter for all operations.',
  },
  {
    id: 'cwp-core',
    title: '3.0 CORE PRINCIPLES (THE "classicwilly" VIBE)',
    sourceDocument: 'Classicwilly Protocol',
    items: [
      { id: 'cwp-principle-1', label: '11/10 PERFECTION IS THE STANDARD.' },
      { id: 'cwp-principle-2', label: 'OUTPUT OVER OPTICS.' },
      { id: 'cwp-principle-3', label: 'DIAGNOSE BEFORE FIXING.' },
      { id: 'cwp-principle-4', label: 'BE THE "STRUCTURE."' },
    ]
  },
  {
    id: 'cwp-procedure',
    title: '4.0 PROCEDURE (THE "I FIX STUFF" LOOP)',
    sourceDocument: 'Classicwilly Protocol',
    description: 'When this protocol is active, execute the following five-step loop.',
    items: [
      { id: 'cwp-loop-1', label: 'IDENTIFY THE "CHAOS."' },
      { id: 'cwp-loop-2', label: 'DIAGNOSE THE ROOT CAUSE.' },
      { id: 'cwp-loop-3', label: 'BUILD THE "CARD CATALOG."' },
      { id: 'cwp-loop-4', label: 'EXECUTE THE "FIX."' },
      { id: 'cwp-loop-5', label: 'VERIFY THE "FIX."' },
    ]
  },
    // FamilyStructureModeProtocol.tsx
  {
    id: 'fsm-friday',
    title: 'Friday Transition (4:00 PM - 6:00 PM)',
    sourceDocument: 'Family Structure Mode Protocol',
    items: [
      { id: 'fsm-fri-1', label: 'Final Solo Prep', time: '3:30-4:00 PM', startHour: 15.5, endHour: 16 },
      { id: 'fsm-fri-2', label: 'Environment Preparation', time: '4:00-5:00 PM', startHour: 16, endHour: 17 },
      { id: 'fsm-fri-3', label: 'Arrival & Orientation', time: '5:00-6:00 PM', startHour: 17, endHour: 18 },
    ]
  },
  {
    id: 'fsm-saturday',
    title: 'Saturday Schedule (Full Day)',
    sourceDocument: 'Family Structure Mode Protocol',
    items: [
      { id: 'fsm-sat-1', label: "Dad's Solo FDP & Prep", time: '6-7 AM', startHour: 6, endHour: 7 },
      { id: 'fsm-sat-2', label: 'Kids Wake, FDP & Breakfast', time: '7-9 AM', startHour: 7, endHour: 9 },
      { id: 'fsm-sat-3', label: 'Shared Chore Block', time: '9-10 AM', startHour: 9, endHour: 10 },
      { id: 'fsm-sat-4', label: 'Structured Activity Block (e.g., Park, Museum)', time: '10 AM-12 PM', startHour: 10, endHour: 12 },
      { id: 'fsm-sat-5', label: 'Lunch', time: '12-1 PM', startHour: 12, endHour: 13 },
      { id: 'fsm-sat-6', label: 'Quiet Time Protocol (Mandatory)', time: '1-3 PM', startHour: 13, endHour: 15 },
      { id: 'fsm-sat-7', label: 'Structured Interest Block (Legos, Art)', time: '3-5 PM', startHour: 15, endHour: 17 },
      { id: 'fsm-sat-8', label: 'Dinner Prep & Dinner', time: '5-7 PM', startHour: 17, endHour: 19 },
      { id: 'fsm-sat-9', label: 'Wind Down & Bedtime Routine', time: '7-8:30 PM', startHour: 19, endHour: 20.5 },
      { id: 'fsm-sat-10', label: "Dad's Decompression", time: '8:30-9:30 PM', startHour: 20.5, endHour: 21.5 },
      { id: 'fsm-sat-11', label: "Dad's Sleep Prep", time: '10-10:30 PM', startHour: 22, endHour: 22.5 },
    ]
  },
  {
    id: 'fsm-sunday',
    title: 'Sunday Schedule (Grandma\'s House Day)',
    sourceDocument: 'Family Structure Mode Protocol',
    items: [
        { id: 'fsm-sun-1', label: "Dad's Solo FDP & Prep", time: '6-7 AM', startHour: 6, endHour: 7 },
        { id: 'fsm-sun-2', label: 'Kids Wake, FDP & Breakfast', time: '7-9 AM', startHour: 7, endHour: 9 },
        { id: 'fsm-sun-3', label: 'Sunday Prep Protocol: Kids Prep', time: '9-10:30 AM', startHour: 9, endHour: 10.5 },
        { id: 'fsm-sun-4', label: 'Sunday Prep Protocol: House Prep', time: '10:30-11:15 AM', startHour: 10.5, endHour: 11.25 },
        { id: 'fsm-sun-5', label: 'Sunday Prep Protocol: Personal & Vehicle', time: '11:15-12 PM', startHour: 11.25, endHour: 12 },
        { id: 'fsm-sun-6', label: 'Lunch', time: '12-1 PM', startHour: 12, endHour: 13 },
        { id: 'fsm-sun-7', label: 'Free Play / Pack Up', time: '1-2 PM', startHour: 13, endHour: 14 },
        { id: 'fsm-sun-8', label: "Depart for Grandma's House", time: '2 PM', startHour: 14, endHour: 14.5 },
        { id: 'fsm-sun-9', label: "Grandma's House", time: '2:30-7 PM', startHour: 14.5, endHour: 19 },
        { id: 'fsm-sun-10', label: 'Return Home & Wind Down', time: '7-8:30 PM', startHour: 19, endHour: 20.5 },
        { id: 'fsm-sun-11', label: "Dad's Decompression & Reset", time: '8:30-10:30 PM', startHour: 20.5, endHour: 22.5 },
    ]
  },
  {
    id: 'fsm-monday',
    title: 'Monday Morning Departure & Recovery',
    sourceDocument: 'Family Structure Mode Protocol',
    items: [
        { id: 'fsm-mon-1', label: "Dad's Solo FDP", time: '6-7 AM', startHour: 6, endHour: 7 },
        { id: 'fsm-mon-2', label: 'Kids Wake, FDP & Breakfast', time: '7-8 AM', startHour: 7, endHour: 8 },
        { id: 'fsm-mon-3', label: 'School Prep & Departure', time: '8-8:30 AM', startHour: 8, endHour: 8.5 },
        { id: 'fsm-mon-4', label: "Dad's Recovery & Transition Protocol", time: '8:30 AM - 6 PM', startHour: 8.5, endHour: 18 },
    ]
  },
  {
    id: 'fsm-checklist',
    title: 'Execution Checklist (Daily)',
    sourceDocument: 'Family Structure Mode Protocol',
    items: [
      { id: 'fsm-check-1', label: 'Morning: Adhere to morning routine for kids. No deviations.' },
      { id: 'fsm-check-2', label: 'Core Blocks: Execute structured activities as planned. Use timers.' },
      { id: 'fsm-check-3', label: 'Evening: Initiate wind-down on schedule. Enforce bedtime protocol.' },
    ]
  },
  {
    id: 'fsm-tools',
    title: 'Tools Required',
    sourceDocument: 'Family Structure Mode Protocol',
    items: [
      { id: 'fsm-tool-1', label: 'Soundcore Space One Headphones (Bubble Shield Profile 2.0)' },
      { id: 'fsm-tool-2', label: 'Large Whiteboard (Visual schedule for children)' },
      { id: 'fsm-tool-3', label: 'Google Tasks (Weekend structure planning)' },
      { id: 'fsm-tool-4', label: 'Fixed Meal Schedule (Eliminates decision fatigue)' },
    ]
  },
  // Co-Parenting Communication Protocol
  {
    id: 'cpp-principles',
    title: 'Core Principles',
    sourceDocument: 'Co-Parenting Communication Protocol',
    description: 'This protocol governs all non-emergency communication. The goal is to reduce friction and maintain focus on the children\'s well-being. All communication must be: Fact-based, Child-focused, and Actionable.',
    items: [
        { id: 'cpp-prin-1', label: 'No emotional language. No blame. No sarcasm.' },
        { id: 'cpp-prin-2', label: 'All discussions must directly relate to the children\'s logistics or needs.' },
        { id: 'cpp-prin-3', label: 'Every message should have a clear purpose or requested action.' },
    ]
  },
  {
    id: 'cpp-pre-comm',
    title: 'Pre-Communication Checklist',
    sourceDocument: 'Co-Parenting Communication Protocol',
    description: 'Execute before sending any message.',
    items: [
        { id: 'cpp-pre-1', label: 'Is this information necessary to share right now?' },
        { id: 'cpp-pre-2', label: 'Is this a logistical issue or an emotional reaction?' },
        { id: 'cpp-pre-3', label: 'Can this wait for a scheduled communication time?' },
        { id: 'cpp-pre-4', label: 'Have I gathered all the necessary facts (dates, times, locations)?' },
        { id: 'cpp-pre-5', label: 'Have I used the AI Communication Coach to translate this message into a low-conflict format?' },
    ]
  },
  {
    id: 'cpp-channels',
    title: 'Communication Channels',
    sourceDocument: 'Co-Parenting Communication Protocol',
    description: 'The designated channels for specific types of information.',
    subSections: [
        {
            id: 'cpp-chan-urgent',
            title: 'Urgent/Emergency',
            sourceDocument: 'Co-Parenting Communication Protocol',
            items: [{ id: 'cpp-chan-urgent-1', label: 'Phone Call or Text Message (e.g., child is sick, change of plans within 24 hours).' }],
        },
        {
            id: 'cpp-chan-logistics',
            title: 'Standard Logistics',
            sourceDocument: 'Co-Parenting Communication Protocol',
            items: [{ id: 'cpp-chan-logistics-1', label: 'Shared Calendar (Appointments, school events, holidays).' }],
        },
        {
            id: 'cpp-chan-info',
            title: 'Non-Urgent Information',
            sourceDocument: 'Co-Parenting Communication Protocol',
            items: [{ id: 'cpp-chan-info-1', label: 'Shared Family Log (e.g., medication updates, school feedback, behavioral notes).' }],
        }
    ]
  },
  {
    id: 'cpp-response',
    title: 'Responding to Incoming Communication',
    sourceDocument: 'Co-Parenting Communication Protocol',
    description: 'A protocol for processing and responding to messages from the co-parent to minimize emotional reactivity.',
    items: [
        { id: 'cpp-resp-1', label: 'Acknowledge receipt if time-sensitive (e.g., "Got it," "Confirmed").' },
        { id: 'cpp-resp-2', label: 'Use the AI Communication Coach to analyze the incoming message for facts vs. emotion.' },
        { id: 'cpp-resp-3', label: 'Draft a reply that ONLY addresses the factual/logistical components.' },
        { id: 'cpp-resp-4', label: 'Adhere to a 24-hour response time for non-urgent matters.' },
    ]
  },
  // Developer Compliance Protocol
  {
    id: 'dcp-purpose',
    title: '1.0 Purpose & Scope',
    sourceDocument: 'Developer Compliance Protocol',
    description: 'This meta-protocol is engaged when any non-conforming condition (bug, error, instability) is detected in the Wonky Sprout OS. Its purpose is to enforce a structured, diagnostic-first approach to all system modifications and prevent "shooting from the hip." Complacency kills system integrity.',
  },
  {
    id: 'dcp-principles',
    title: '2.0 Core Principles',
    sourceDocument: 'Developer Compliance Protocol',
    items: [
      { id: 'dcp-prin-1', label: '**DIAGNOSE ROOT CAUSE:** Do not treat symptoms. A syntax error is a symptom; the lack of a build step is the root cause. Identify the true source of failure before implementing a fix.' },
      { id: 'dcp-prin-2', label: '**PROCEDURE OVER HASTE:** Follow the established procedure. Ad-hoc fixes introduce instability. The protocol is the only path to a stable system.' },
      { id: 'dcp-prin-3', label: '**CODIFY THE FIX:** If a new class of failure is discovered, a new protocol must be written to prevent its recurrence. This is non-negotiable.' },
      { id: 'dcp-prin-4', label: '**VERIFY COMPLIANCE:** After a corrective action is implemented, perform a full system diagnostic to ensure the fix has not introduced new non-conforming conditions.' },
    ]
  },
  {
    id: 'dcp-procedure',
    title: '3.0 Corrective Action Procedure',
    sourceDocument: 'Developer Compliance Protocol',
    items: [
      { id: 'dcp-proc-1', label: '**Step 1: Identify Non-Conforming Condition.** Acknowledge the bug report or system alert. State the observed symptom clearly.' },
      { id: 'dcp-proc-2', label: '**Step 2: Conduct Root Cause Analysis (RCA).** Investigate beyond the surface-level error. Ask "Why?" until the foundational failure is identified.' },
      { id: 'dcp-proc-3', label: '**Step 3: Formulate Corrective Action Plan (CAP).** Define the precise engineering solution that addresses the root cause. Reject shallow patches.' },
      { id: 'dcp-proc-4', label: '**Step 4: Execute & Verify.** Implement the CAP. Run a full suite of tests to verify that the fix is effective and has not created new regressions.' },
      { id: 'dcp-proc-5', label: '**Step 5: Update System Documentation.** Codify the lesson by creating or updating the relevant SOP. This closes the loop and hardens the system against future failure.' },
    ]
  },
  // Life Maintenance Protocol
  {
    id: 'lmp-overview',
    title: 'SECTION 1: CORE PRINCIPLES',
    sourceDocument: 'Life Maintenance Protocol',
    description: 'These tasks are not a reflection of your worth. They are mechanical systems required for survival. This SOP removes shame by providing a tiered, capacity-based execution plan.',
    items: [
      { id: 'lmp-prin-1', label: 'Actionable steps must be small and concrete (e.g., "Wipe one counter," not "Clean kitchen").' },
      { id: 'lmp-prin-2', label: 'Tiered execution allows for graceful degradation. Doing Tier 1 is a success.' },
      { id: 'lmp-prin-3', label: 'Automate where possible (e.g., recurring grocery list, scheduled cleaning blocks).' },
    ]
  },
  {
    id: 'lmp-house',
    title: 'SECTION 2: HOUSE CLEANING',
    sourceDocument: 'Life Maintenance Protocol',
    description: 'A rotational, zone-based system to prevent overwhelming buildup.',
    subSections: [
        {
            id: 'lmp-house-daily',
            title: 'Daily Maintenance (15 min)',
            sourceDocument: 'Life Maintenance Protocol',
            items: [
                { id: 'actionable:lmp-daily-1', label: 'Kitchen Reset (5 min): Wipe counters, load/run dishwasher.' },
                { id: 'actionable:lmp-daily-2', label: 'Bathroom Reset (5 min): Wipe sink, spray shower, check toilet.' },
                { id: 'actionable:lmp-daily-3', label: 'Living Space Reset (5 min): Clear floor, fold one blanket, reset one surface.' },
            ]
        },
        {
            id: 'lmp-house-weekly',
            title: 'Weekly Deep Clean (1 Zone per week)',
            sourceDocument: 'Life Maintenance Protocol',
            items: [
                { id: 'actionable:lmp-weekly-1', label: 'Week 1: Kitchen Deep Clean (Stove, microwave, floors).' },
                { id: 'actionable:lmp-weekly-2', label: 'Week 2: Bathroom Deep Clean (Scrub shower, toilet, floors).' },
                { id: 'actionable:lmp-weekly-3', label: 'Week 3: Bedroom Deep Clean (Change sheets, dust, vacuum).' },
                { id: 'actionable:lmp-weekly-4', label: 'Week 4: Living Area Deep Clean (Vacuum, dust all surfaces).' },
            ]
        }
    ]
  },
  {
    id: 'lmp-groceries',
    title: 'SECTION 3: GROCERIES',
    sourceDocument: 'Life Maintenance Protocol',
    description: 'A templated, list-driven approach to eliminate decision fatigue.',
    subSections: [
      {
        id: 'lmp-grocery-template',
        title: 'Templated Grocery List',
        sourceDocument: 'Life Maintenance Protocol',
        description: 'This is the master list. Add items for specific meals as needed.',
        subSections: [
          // FIX: Added missing 'sourceDocument' property to conform to ChecklistSectionData type.
          { id: 'lmp-grocery-produce', title: 'Produce', sourceDocument: 'Life Maintenance Protocol', items: [{id: 'gl-1', label: 'Apples'}, {id: 'gl-2', label: 'Bananas'}, {id: 'gl-3', label: 'Spinach'}, {id: 'gl-4', label: 'Onions'}, {id: 'gl-5', label: 'Garlic'}] },
          // FIX: Added missing 'sourceDocument' property to conform to ChecklistSectionData type.
          { id: 'lmp-grocery-protein', title: 'Protein', sourceDocument: 'Life Maintenance Protocol', items: [{id: 'gl-6', label: 'Chicken Breast'}, {id: 'gl-7', label: 'Ground Turkey'}, {id: 'gl-8', label: 'Eggs'}, {id: 'gl-9', label: 'Tofu'}] },
          // FIX: Added missing 'sourceDocument' property to conform to ChecklistSectionData type.
          { id: 'lmp-grocery-dairy', title: 'Dairy/Alt', sourceDocument: 'Life Maintenance Protocol', items: [{id: 'gl-10', label: 'Milk (Oat)'}, {id: 'gl-11', label: 'Yogurt'}, {id: 'gl-12', label: 'Cheese'}] },
          // FIX: Added missing 'sourceDocument' property to conform to ChecklistSectionData type.
          { id: 'lmp-grocery-pantry', title: 'Pantry', sourceDocument: 'Life Maintenance Protocol', items: [{id: 'gl-13', label: 'Rice'}, {id: 'gl-14', label: 'Pasta'}, {id: 'gl-15', label: 'Canned Tomatoes'}, {id: 'gl-16', label: 'Beans'}] },
          // FIX: Added missing 'sourceDocument' property to conform to ChecklistSectionData type.
          { id: 'lmp-grocery-household', title: 'Household', sourceDocument: 'Life Maintenance Protocol', items: [{id: 'gl-17', label: 'Paper Towels'}, {id: 'gl-18', label: 'Trash Bags'}, {id: 'gl-19', label: 'Dish Soap'}] },
          // FIX: Added missing 'sourceDocument' property to conform to ChecklistSectionData type.
          { id: 'lmp-grocery-kids', title: 'Kids\' Specifics', sourceDocument: 'Life Maintenance Protocol', items: [{id: 'gl-20', label: 'Goldfish'}, {id: 'gl-21', label: 'Applesauce Pouches'}, {id: 'gl-22', label: 'Mac & Cheese'}] },
        ]
      }
    ]
  },
  // MorningTransitionProtocol.tsx
  {
    id: 'mtp-phase1',
    title: 'PHASE 1: PHYSICAL SYSTEM BOOT (0-15 Minutes Post-Wake)',
    sourceDocument: 'Morning Transition Protocol',
    items: [
      { id: 'mtp-p1-1', label: 'Step 1: Foundational Protocol 1 (Water)' },
      { id: 'mtp-p1-2', label: 'Step 2: Foundational Protocol 2 (Pills)' },
      { id: 'mtp-p1-3', label: 'Step 3: Light Exposure (10 min)' },
      { id: 'mtp-p1-4', label: 'Step 4: Mobility Protocol (5 min)' },
    ]
  },
  {
    id: 'mtp-phase2',
    title: 'PHASE 2: MENTAL SYSTEM BOOT (15-30 Minutes Post-Wake)',
    sourceDocument: 'Morning Transition Protocol',
    items: [
      { id: 'mtp-p2-1', label: 'Step 5: Foundational Protocol 3 (Capture)' },
      { id: 'mtp-p2-2', label: 'Step 6: Review Daily Briefing (5 min)' },
      { id: 'mtp-p2-3', label: 'Step 7: Single Task Selection (2 min)' },
    ]
  },
  {
    id: 'mtp-phase3',
    title: 'PHASE 3: ENVIRONMENT BOOT (30-45 Minutes Post-Wake)',
    sourceDocument: 'Morning Transition Protocol',
    items: [
      { id: 'mtp-p3-1', label: 'Step 8: Make Bed (2 min)' },
      { id: 'mtp-p3-2', label: 'Step 9: Tidy One Surface (3 min)' },
      { id: 'mtp-p3-3', label: 'Step 10: Launch First Task' },
    ]
  },
    // PersonalHygieneProtocol.tsx
  {
    id: 'php-tier1',
    title: 'TIER 1: SURVIVAL MODE (5 Minutes, Lowest Capacity)',
    sourceDocument: 'Personal Hygiene Protocol',
    description: 'Goal: Prevent immediate health issues. This is a complete success when capacity is low.',
    items: [
      { id: 'php-t1-1', label: 'Brush teeth (2 min).' },
      { id: 'php-t1-2', label: 'Use face wipe or rinse face with water (30s).' },
      { id: 'php-t1-3', label: 'Apply deodorant (30s).' },
      { id: 'php-t1-4', label: 'Change into fresh clothes (even if it\'s just clean pajamas) (2 min).' },
    ]
  },
  {
    id: 'php-tier2',
    title: 'TIER 2: MAINTENANCE MODE (15 Minutes, Medium Capacity)',
    sourceDocument: 'Personal Hygiene Protocol',
    description: 'Goal: Maintain a baseline of cleanliness and comfort.',
    items: [
      { id: 'php-t2-1', label: '**All Tier 1 tasks PLUS:**' },
      { id: 'php-t2-2', label: 'Quick shower (5-10 min). Soap key areas only.' },
      { id: 'php-t2-3', label: 'Basic skincare (e.g., moisturizer).' },
      { id: 'php-t2-4', label: 'Brush hair.' },
    ]
  },
  {
    id: 'php-tier3',
    title: 'TIER 3: FULL SYSTEM REFRESH (30+ Minutes, High Capacity)',
    sourceDocument: 'Personal Hygiene Protocol',
    description: 'Goal: A full reset. Do not attempt this if capacity is not high, as it can lead to burnout.',
    items: [
      { id: 'php-t3-1', label: '**All Tier 2 tasks PLUS:**' },
      { id: 'php-t3-2', label: 'Full, thorough shower (shampoo, condition, etc.).' },
      { id: 'php-t3-3', label: 'Full skincare routine.' },
      { id: 'php-t3-4', label: 'Shaving / other grooming tasks.' },
      { id: 'php-t3-5', label: 'Flossing.' },
    ]
  },
  // SoloExecutionModeProtocol.tsx
  {
    id: 'sem-overview',
    title: 'Overview & Principles',
    sourceDocument: 'Solo Execution Mode Protocol',
    items: [
      { id: 'sem-prin-1', label: 'Principle 1: The Schedule is Law.' },
      { id: 'sem-prin-2', label: 'Principle 2: Protect Your Focus Blocks.' },
      { id: 'sem-prin-3', label: 'Principle 3: Capture, Don\'t Process.' },
    ]
  },
  {
    id: 'sem-schedule',
    title: 'Daily Schedule Template (Mon-Fri)',
    sourceDocument: 'Solo Execution Mode Protocol',
    subSections: [
        {
            id: 'sem-sched-morning',
            title: 'Morning Block (6 AM - 12 PM)',
            sourceDocument: 'Solo Execution Mode Protocol',
            items: [
              { id: 'sem-item-1', label: '6:00 - 7:00: Morning Transition Protocol' },
              { id: 'sem-item-2', label: '7:00 - 8:30: Deep Work Block 1 (High Priority)' },
              { id: 'sem-item-3', label: '8:30 - 9:00: Buffer / Admin / Comms' },
              { id: 'sem-item-4', label: '9:00 - 11:00: Deep Work Block 2 (Scheduled Meetings or Creative Work)' },
              { id: 'sem-item-5', label: '11:00 - 12:00: Shallow Work / Task Triage' },
            ]
        },
         {
            id: 'sem-sched-afternoon',
            title: 'Afternoon Block (12 PM - 6 PM)',
            sourceDocument: 'Solo Execution Mode Protocol',
            items: [
              { id: 'sem-item-6', label: '12:00 - 1:00: Lunch & Decompression (NO SCREENS)' },
              { id: 'sem-item-7', label: '1:00 - 3:00: Deep Work Block 3 (Project Work)' },
              { id: 'sem-item-8', label: '3:00 - 4:00: Buffer / Admin / Comms' },
              { id: 'sem-item-9', label: '4:00 - 6:00: Kids Handoff & Family Mode Transition' },
            ]
        }
    ]
  },
  {
    id: 'sem-checklist',
    title: 'Daily Execution Checklist',
    sourceDocument: 'Solo Execution Mode Protocol',
    items: [
      { id: 'sem-check-1', label: 'Morning: MTP executed successfully.', achievementAwardId: 'first-focus-session' },
      { id: 'sem-check-2', label: 'Mid-Day: Lunch decompression protocol followed (no screens).' },
      { id: 'sem-check-3', label: 'End of Day: Task Matrix inbox is at zero.' },
      { id: 'sem-check-4', label: 'All Day: Bubble Shield Protocol active during all deep work blocks.' },
    ]
  },
  // CommandCenterSetupSop.tsx
  {
    id: 'ccs-principles',
    title: 'Core Principles',
    sourceDocument: 'Cockpit Setup Protocol',
    items: [
      { id: 'ccs-prin-1', label: 'Friction Reduction is Paramount' },
      { id: 'ccs-prin-2', label: 'Ergonomics are Non-Negotiable' },
      { id: 'ccs-prin-3', label: 'Everything Has a Home' },
      { id: 'ccs-prin-4', label: 'Digital and Physical Spaces Must Be Integrated' },
    ]
  },
  {
    id: 'ccs-equipment',
    title: 'Equipment List',
    sourceDocument: 'Cockpit Setup Protocol',
    subSections: [
      { id: 'ccs-equip-core', title: 'Core Computing', sourceDocument: 'Cockpit Setup Protocol', items: [
        {id: 'ccs-eq-c-1', label: 'M4 MacBook Pro 16" (Primary)'},
        {id: 'ccs-eq-c-2', label: 'Dell 32" 4K Monitor (Primary Display)'},
        {id: 'ccs-eq-c-3', label: 'LG 27" 4K Monitor (Secondary, Vertical)'},
        {id: 'ccs-eq-c-4', label: 'Caldigit TS4 Thunderbolt Dock'},
      ]},
      { id: 'ccs-equip-periph', title: 'Peripherals', sourceDocument: 'Cockpit Setup Protocol', items: [
        {id: 'ccs-eq-p-1', label: 'Logitech MX Master 3S Mouse'},
        {id: 'ccs-eq-p-2', label: 'Logitech MX Mechanical Keyboard'},
        {id: 'ccs-eq-p-3', label: 'Logitech Brio 4K Webcam'},
        {id: 'ccs-eq-p-4', label: 'Elgato Stream Deck'},
      ]},
      { id: 'ccs-equip-audio', title: 'Audio & Sensory', sourceDocument: 'Cockpit Setup Protocol', items: [
        {id: 'ccs-eq-a-1', label: 'Soundcore Space One Headphones (Bubble Shield)'},
        {id: 'ccs-eq-a-2', label: 'AnkerWork M650 Wireless Mic'},
        {id: 'ccs-eq-a-3', label: 'Anker PowerCast M300 USB Mic'},
        {id: 'ccs-eq-a-4', label: 'Anker AI Voice Recorder'},
      ]},
      { id: 'ccs-equip-space', title: 'Workspace', sourceDocument: 'Cockpit Setup Protocol', items: [
        {id: 'ccs-eq-s-1', label: 'Standing Desk (min 60" width)'},
        {id: 'ccs-eq-s-2', label: 'Ergonomic Chair (Herman Miller Aeron)'},
        {id: 'ccs-eq-s-3', label: 'Monitor Arms (x2)'},
        {id: 'ccs-eq-s-4', label: 'Under-desk cable management tray'},
      ]},
    ]
  },
  {
    id: 'ccs-setup',
    title: 'Setup & Configuration',
    sourceDocument: 'Command Center Setup SOP',
    subSections: [
      { id: 'ccs-setup-layout', title: 'Physical Layout', sourceDocument: 'Command Center Setup SOP', items: [
        {id: 'ccs-sl-1', label: 'Primary monitor centered at eye level.'},
        {id: 'ccs-sl-2', label: 'Secondary monitor to the right, in vertical orientation.'},
        {id: 'ccs-sl-3', label: 'MacBook to the left, on a stand, screen active.'},
        {id: 'ccs-sl-4', label: 'All cables routed through dock and managed under desk.'},
      ]},
       { id: 'ccs-setup-software', title: 'Software Configuration', sourceDocument: 'Command Center Setup SOP', items: [
        {id: 'ccs-ss-1', label: 'Rectangle Pro for window management.'},
        {id: 'ccs-ss-2', label: 'Alfred for quick launch.'},
        {id: 'ccs-ss-3', label: 'VS Code with "classicwilly" profile active.'},
        {id: 'ccs-ss-4', label: 'Stream Deck configured for app launching and meeting controls.'},
      ]},
    ]
  },
  // PixelFoldSetupSop.tsx
  {
    id: 'pfs-principles',
    title: 'Core Principles',
    sourceDocument: 'Pixel Fold Setup SOP',
    items: [
      { id: 'pfs-prin-1', label: 'Capture, Don\'t Process.' },
      { id: 'pfs-prin-2', label: 'Minimize Notifications.' },
      { id: 'pfs-prin-3', label: 'Optimize for One-Handed Use.' },
      { id: 'pfs-prin-4', label: 'Continuity with Command Center is Key.' },
    ]
  },
  {
    id: 'pfs-homescreen',
    title: 'Homescreen Configuration',
    sourceDocument: 'Pixel Fold Setup SOP',
    items: [
      { id: 'pfs-hs-1', label: 'Outer Screen: Phone, Messages, Camera, Google Keep.' },
      { id: 'pfs-hs-2', label: 'Inner Screen: At a Glance widget, Google Calendar, Google Tasks, Wonky Sprout OS (as PWA).' },
      { id: 'pfs-hs-3', label: 'No social media apps on any homescreen.' },
      { id: 'pfs-hs-4', label: 'Wallpaper set to solid black.' },
    ]
  },
  {
    id: 'pfs-notifications',
    title: 'Notification Settings',
    sourceDocument: 'Pixel Fold Setup SOP',
    items: [
      { id: 'pfs-notif-1', label: 'All social media notifications: OFF.' },
      { id: 'pfs-notif-2', label: 'Email notifications: OFF.' },
      { id: 'pfs-notif-3', label: 'Allowed notifications: Phone calls, Text messages (from contacts only), Calendar events.' },
      { id: 'pfs-notif-4', label: 'Set up "Focus Mode" on Android to block all notifications during deep work blocks.' },
    ]
  },
  {
    id: 'pfs-apps',
    title: 'Core Application Suite',
    sourceDocument: 'Pixel Fold Setup SOP',
    items: [
      { id: 'pfs-app-1', label: 'Google Keep (Primary capture tool).' },
      { id: 'pfs-app-2', label: 'Google Calendar (Time blocking).' },
      { id: 'pfs-app-3', label: 'Google Tasks (Mirrors Task Matrix).' },
      { id: 'pfs-app-4', label: 'Anker Soundcore App (Bubble Shield control).' },
      { id: 'pfs-app-5', label: 'Wonky Sprout OS (as Progressive Web App).' },
    ]
  },
   // AccessibilitySafetyProtocol.tsx
  {
    id: 'asp-design',
    title: 'Design Principles',
    sourceDocument: 'Accessibility & Safety Protocol',
    items: [
      { id: 'asp-des-1', label: 'High Contrast is Mandatory: Use WCAG AA minimum contrast ratios for all text.' },
      { id: 'asp-des-2', label: 'Clarity Over Aesthetics: UI must be unambiguous. If it\'s clever but confusing, it\'s a failure.' },
      { id: 'asp-des-3', label: 'Reduce Motion: Use animations sparingly and provide options to disable them.' },
      { id: 'asp-des-4', label: 'Consistent Layout: Navigation and core controls must remain in predictable locations.' },
    ]
  },
  {
    id: 'asp-interaction',
    title: 'Interaction Principles',
    sourceDocument: 'Accessibility & Safety Protocol',
    items: [
      { id: 'asp-int-1', label: 'Forgiving Inputs: The system must handle errors gracefully and provide clear recovery paths.' },
      { id: 'asp-int-2', label: 'No "Out of Sight, Out of Mind": Critical information must remain visible or be easily accessible.' },
      { id: 'asp-int-3', label: 'Minimize Clicks: Reduce the number of steps required to complete core actions.' },
    ]
  },
    // BubbleShieldProtocol.tsx
  {
    id: 'bsp-purpose',
    title: '1.0 Purpose',
    sourceDocument: 'Bubble Shield Protocol',
    description: 'To mandate the use of sensory mitigation hardware (noise-cancelling headphones) as a non-negotiable tool for maintaining executive function, especially during Solo Execution Mode.',
  },
  {
    id: 'bsp-hardware',
    title: '2.0 Approved Hardware',
    sourceDocument: 'Bubble Shield Protocol',
    items: [
      { id: 'bsp-hw-1', label: 'Primary: Soundcore Space One (over-ear)' },
      { id: 'bsp-hw-2', label: 'Secondary (Mobile): Soundcore Liberty 4 NC (in-ear)' },
    ]
  },
  {
    id: 'bsp-profiles',
    title: '3.0 Configuration Profiles (Soundcore App)',
    sourceDocument: 'Bubble Shield Protocol',
    items: [
      { id: 'bsp-prof-1', label: '**Profile 1.0 (Deep Work):** ANC Level Max, Wind Noise Reduction ON, Normal Mode (No EQ).' },
      { id: 'bsp-prof-2', label: '**Profile 2.0 (Family Mode):** Transparency Mode ON (Vocal Mode), ANC Level Low.' },
      { id: 'bsp-prof-3', label: '**Profile 3.0 (Travel):** ANC Level Max, Wind Noise Reduction ON, Transport Mode.' },
    ]
  },
  {
    id: 'bsp-procedure',
    title: '4.0 Usage Procedure',
    sourceDocument: 'Bubble Shield Protocol',
    items: [
      { id: 'bsp-proc-1', label: 'Step 1: Upon entering Solo Execution Mode, immediately don headphones and activate Profile 1.0.' },
      { id: 'bsp-proc-2', label: 'Step 2: Upon entering Family Structure Mode, switch to Profile 2.0 to maintain situational awareness.' },
      { id: 'bsp-proc-3', label: 'Step 3: At the end of each day, place headphones on charging stand. A dead battery is a system failure.' },
    ]
  },
    // Manifesto.tsx
  {
    id: 'man-intro',
    title: 'INTRODUCTION: THE NON-CONFORMING CONDITION',
    sourceDocument: 'Manifesto',
    description: `The default state of the world is **chaos**. For a neurodivergent brain, this chaos is not a minor inconvenience; it is a **non-conforming condition** that leads to system failure.
      - Executive dysfunction is a **systems failure**.
      - Sensory overload is a **systems failure**.
      - Decision paralysis is a **systems failure**.
      This is not a personal or moral failing. It is an engineering problem. The Wonky Sprout OS is the engineering solution.`,
    subSections: [{
      id: 'man-intro-hidden', title: 'Hidden', sourceDocument: 'Manifesto', description: '**Our mission is to build the "card catalog" for the chaotic library of a neurodivergent life.**'
    }]
  },
  {
    id: 'man-principles',
    title: 'CORE PRINCIPLES',
    sourceDocument: 'Manifesto',
    subSections: [
        { id: 'man-p1', title: 'Hidden', sourceDocument: 'Manifesto', description: '## PRINCIPLE 1: EXTERNALIZE EVERYTHING' },
        { id: 'man-p2', title: 'Hidden', sourceDocument: 'Manifesto', description: '## PRINCIPLE 2: STRUCTURE IS FREEDOM' },
        { id: 'man-p3', title: 'Hidden', sourceDocument: 'Manifesto', description: '## PRINCIPLE 3: ELIMINATE THE "SHOULDS"' },
        { id: 'man-p4', title: 'Hidden', sourceDocument: 'Manifesto', description: '## PRINCIPLE 4: AUTOMATE COMPLIANCE' },
        { id: 'man-p5', title: 'Hidden', sourceDocument: 'Manifesto', description: '## PRINCIPLE 5: COMPLACENCY KILLS' },
    ]
  },
  // HeadphoneControllerIpi.tsx
  {
    id: 'hc-ipi-objective',
    title: '1.0 OBJECTIVE',
    sourceDocument: 'Headphone Controller IPI',
    description: 'To reverse engineer the Bluetooth Low Energy (BLE) commands sent by the Anker Soundcore mobile app to the Soundcore Space One headphones. The ultimate goal is to build a structured desktop controller (web or native) to manage headphone settings without relying on the chaotic, mobile-only app.'
  },
  {
    id: 'hc-ipi-tools',
    title: '2.0 TOOLS REQUIRED',
    sourceDocument: 'Headphone Controller IPI',
    items: [
        { id: 'hc-tool-1', label: 'Android Phone with Soundcore App installed.' },
        { id: 'hc-tool-2', label: 'macOS with Bluetooth development tools.' },
        { id: 'hc-tool-3', label: 'Wireshark with BLE sniffing capabilities, or equivalent.' },
        { id: 'hc-tool-4', label: 'A method to capture `btsnoop_hci.log` from the Android device.' },
    ]
  },
  {
    id: 'hc-ipi-procedure',
    title: '3.0 PROCEDURE',
    sourceDocument: 'Headphone Controller IPI',
    description: '**Phase 1: Packet Capture**',
    items: [
        { id: 'hc-proc-1', label: 'Enable Bluetooth HCI snoop log in Android Developer Options.' },
        { id: 'hc-proc-2', label: 'Toggle Bluetooth off and on to start a clean log.' },
        { id: 'hc-proc-3', label: 'Connect the Soundcore Space One headphones.' },
        { id: 'hc-proc-4', label: 'Open the Soundcore app. Systematically perform one action at a time, and only one. For example: Change ANC from "Normal" to "Transport". Wait 10 seconds.' },
        { id: 'hc-proc-5', label: 'Repeat for every single function in the app (ANC modes, LDAC toggle, Easy Chat, etc.).' },
        { id: 'hc-proc-6', label: 'Retrieve the `btsnoop_hci.log` file from the device.' },
    ]
  },
  {
    id: 'hc-ipi-phase2',
    title: 'Phase 2: Analysis in Wireshark',
    sourceDocument: 'Headphone Controller IPI',
    items: [
        { id: 'hc-proc-7', label: 'Load the HCI log into Wireshark.' },
        { id: 'hc-proc-8', label: 'Filter for Attribute Protocol (ATT) packets (`btatt`).' },
        { id: 'hc-proc-9', label: 'Identify the "Write Command" packets sent from the phone to the headphones.' },
        { id: 'hc-proc-10', label: 'Correlate the timestamp of each "Write Command" with the action you performed in the app.' },
        { id: 'hc-proc-11', label: 'Document the handle and the value (hex payload) for each command.' },
    ]
  },
  {
    id: 'hc-ipi-payload',
    title: 'Phase 3: Payload Deconstruction',
    sourceDocument: 'Headphone Controller IPI',
    description: 'This is the hard part. The hex payloads are not simple flags. They are structured commands.',
    items: [
        { id: 'hc-proc-12', label: 'Isolate the payloads for similar functions (e.g., all ANC mode changes).' },
        { id: 'hc-proc-13', label: 'Identify the common header/prefix for all commands.' },
        { id: 'hc-proc-14', label: 'Identify the byte(s) that change for each specific action.' },
        { id: 'hc-proc-15', label: 'The payload likely includes a command ID, payload length, the payload itself, and a checksum.' },
    ]
  },
    // SystemIntegrationGuide.tsx
  {
    id: 'sig-gcal',
    title: 'Google Calendar: Time Blocking & Mode Switching',
    sourceDocument: 'System Integration Guide',
    items: [
        { id: 'sig-gcal-1', label: 'Create two recurring, all-day events: "Solo Execution Mode" (Mon-Fri) and "Family Structure Mode" (Fri-Mon).' },
        { id: 'sig-gcal-2', label: 'Schedule all appointments, meetings, and hard commitments directly in Google Calendar.' },
        { id: 'sig-gcal-3', label: 'At the start of each day, block out time for your Top 3 Critical tasks as "Focus Time" events.' },
        { id: 'sig-gcal-4', label: 'Use the "Appointment Slots" feature to create structured office hours, preventing ad-hoc interruptions.' },
    ]
  },
  {
    id: 'sig-gtasks',
    title: 'Google Tasks: Daily Execution & Inbox',
    sourceDocument: 'System Integration Guide',
    items: [
        { id: 'sig-gtasks-1', label: 'Create a "Master Task List" in Google Tasks.' },
        { id: 'sig-gtasks-2', label: 'Use the Google Tasks mobile widget as your primary inbox for capturing tasks on the go.' },
        { id: 'sig-gtasks-3', label: 'During your Daily Debrief, migrate all tasks from Google Tasks into the Wonky Sprout Task Matrix for triage and prioritization.' },
        { id: 'sig-gtasks-4', label: 'Use the "Add to Tasks" feature in Gmail to convert actionable emails directly into your inbox.' },
    ]
  },
  {
    id: 'sig-gkeep',
    title: 'Google Keep: Chaos Capture & Brain Dumps',
    sourceDocument: 'System Integration Guide',
    items: [
        { id: 'sig-gkeep-1', label: 'Use the Google Keep widget for instant, one-tap access to a new note.' },
        { id: 'sig-gkeep-2', label: 'Enable "Ok Google, take a note" for hands-free voice capture.' },
        { id: 'sig-gkeep-3', label: 'Periodically (daily or weekly), copy/paste all content from Google Keep into the Wonky Sprout Brain Dump module for AI processing.' },
    ]
  },
  // AI Safety Protocol
  {
    id: 'aisp-data',
    title: 'Data Privacy & PII',
    sourceDocument: 'AI Safety Protocol',
    description: 'The AI is a public tool. Assume anything you send can be seen by a human reviewer. This is non-negotiable.',
    items: [
      { id: 'aisp-data-1', label: '**NEVER** input Personally Identifiable Information (PII): Full names, addresses, phone numbers, email addresses, social security numbers, financial details.' },
      { id: 'aisp-data-2', label: 'Use placeholders or generic terms (e.g., "my co-parent," "Project X," "my child").' },
      { id: 'aisp-data-3', label: 'For sensitive topics, generalize the problem. Instead of "I\'m fighting with [Name] about...", use "How can I de-escalate a conflict with a co-parent about..."' },
      { id: 'aisp-data-4', label: 'Trust the built-in PII scanner, but always perform a manual review before sending.' },
    ]
  },
  {
    id: 'aisp-mental',
    title: 'Mental & Emotional Health',
    sourceDocument: 'AI Safety Protocol',
    description: 'The AI is a tool, not a therapist. It cannot provide genuine empathy or emotional support.',
    items: [
      { id: 'aisp-mental-1', label: 'Do not use the AI as your primary source for emotional regulation.' },
      { id: 'aisp-mental-2', label: 'If the AI\'s responses are increasing anxiety or distress, disengage immediately and activate a relevant IPI (e.g., Sensory Overload, Executive Dysfunction).' },
      { id: 'aisp-mental-3', label: 'Fact-check any advice that relates to health, finance, or critical decisions. The AI can be wrong.' },
    ]
  },
  // --- NEW: Operating Manual ---
  {
    id: 'om-intro',
    title: '1.0 Core Concepts',
    sourceDocument: 'Operating Manual',
    description: 'This manual explains **how** to use the Wonky Sprout OS. The "Why" is covered in the **Manifesto**. This OS is not an app; it is an engineering solution to externalize executive function and manage chaos.',
    items: [
      { id: 'om-con-1', label: '**Protocols & SOPs:** These are your pre-compiled solutions to recurring problems. Find them in the Flight Protocol Vault. Execute them without deviation.' },
      { id: 'om-con-2', label: '**Modules:** Your dashboard is built from modules. These are your tools. Customize your dashboard in "Mod Mode" to build the interface you need.' },
      { id: 'om-con-3', label: '**The Garden:** This is a real-time diagnostic of your system\'s health. A low score is a non-conforming condition that requires investigation.' },
    ]
  },
  {
    id: 'om-ops-control',
    title: '2.0 The "Operations Control" Dashboard',
    sourceDocument: 'Operating Manual',
    description: 'Your central command interface. It is designed for zero scrolling and immediate access to critical systems.',
    subSections: [
      {
        id: 'om-ops-vitals',
        title: 'System Vitals',
        sourceDocument: 'Operating Manual',
        description: 'An at-a-glance summary of your Sprout Health, Mood, and Energy. This is your first checkpoint of the day.'
      },
      {
        id: 'om-ops-daily',
        title: 'Daily Command',
        sourceDocument: 'Operating Manual',
        description: 'A tabbed interface for daily execution. It includes your AI Briefing, Critical Tasks, Agenda, and Habit checklists.'
      },
      {
        id: 'om-ops-launcher',
        title: 'Module Launcher',
        sourceDocument: 'Operating Manual',
        description: 'A grid of icons for one-click access to all other enabled modules. Each module opens in a dedicated, full-screen view to minimize distraction.'
      }
    ]
  },
  {
    id: 'om-key-modules',
    title: '3.0 Key Modules Explained',
    sourceDocument: 'Operating Manual',
    subSections: [
       {
        id: 'om-mod-matrix',
        title: 'Task Matrix',
        sourceDocument: 'Operating Manual',
        description: 'Your central inbox for all non-recurring tasks. Use the "Inbox" tab for unscheduled items and the "Today" tab for your daily agenda. Engage **Focus Mode** to work through today\'s tasks sequentially, or **Triage Mode** to process your inbox.'
      },
      {
        id: 'om-mod-habit',
        title: 'Habit Streak Tracker',
        sourceDocument: 'Operating Manual',
        description: 'Define and track core habits. Check them off daily to build streaks. Click on any habit to see a detailed calendar and AI-powered analysis of your compliance.'
      },
      {
        id: 'om-mod-knowledge',
        title: 'Knowledge Synthesis Engine',
        sourceDocument: 'Operating Manual',
        description: 'Your personal "second brain." Capture insights, notes, and ideas. The AI can find related notes, helping you synthesize new connections from your existing knowledge.'
      },
    ]
  },
  {
    id: 'om-gm-hub',
    title: '4.0 The Game Master Hub',
    sourceDocument: 'Operating Manual',
    description: 'This is the administrative backend for the gamification system for the children.',
    items: [
      { id: 'om-gm-1', label: '**Quest Board:** Create multi-step quests for the children with gem rewards.' },
      { id: 'om-gm-2', label: '**Redemption Hub:** Review and approve reward redemptions that the children have submitted from their dashboards.' },
      { id: 'om-gm-3', label: '**Gem Administration:** Manually award or revoke individual gems for each child.' },
    ]
  },
  {
    id: 'om-ai-tools',
    title: '5.0 Using the AI Tools',
    sourceDocument: 'Operating Manual',
    description: 'The OS integrates AI as a tool to reduce cognitive load.',
    items: [
      { id: 'om-ai-1', label: '**Live Chat (Voice):** Use voice commands to control the OS. Examples: "Add \'Buy milk\' to my tasks," "Open the Life Maintenance Protocol," "What are my tasks for today?"' },
      { id: 'om-ai-2', label: '**SOP Diagnostician & Generator:** In the Flight Protocol Vault, describe a problem to the AI. It can either recommend an existing protocol or generate a draft of a new one for you.' },
      { id: 'om-ai-3', label: '**AI Insights:** The System Insights dashboard and various modules contain AI-powered analysis to help you find patterns in your habits, finances, and daily performance.' },
    ]
  },
  {
    id: 'om-sys-mgmt',
    title: '6.0 System Management',
    sourceDocument: 'Operating Manual',
    description: 'Maintain and configure your OS.',
    items: [
      { id: 'om-sys-1', label: '**Mod Mode:** Toggle the switch in the header to enter "Mod Mode." This allows you to customize the modules on any dashboard.' },
      { id: 'om-sys-2', label: '**Data Management:** Access "System Management" from the "System" dropdown to Export a full backup of your OS or Import a backup to restore your data. **This is critical.**' },
    ]
  },
  // --- NEW: Firebase Deployment Protocol ---
  {
    id: 'deploy-proto-purpose',
    title: '1.0 Purpose',
    sourceDocument: 'Firebase Deployment Protocol',
    description: 'This SOP defines the procedure for deploying the Wonky Sprout OS to Firebase Hosting, transitioning it from a development environment to a live, production-ready state.',
  },
  {
    id: 'deploy-prereqs',
    title: '2.0 Prerequisites',
    sourceDocument: 'Firebase Deployment Protocol',
    items: [
      { id: 'dep-pre-1', label: '**Node.js & npm:** A current LTS version of Node.js must be installed on the deployment machine.' },
      { id: 'dep-pre-2', label: '**Firebase CLI:** The Firebase Command Line Interface must be installed globally. Execute `npm install -g firebase-tools` if not already present.' },
      { id: 'dep-pre-3', label: '**Firebase Project:** The "wonky-sprout-os" Firebase project must be created and configured with Hosting enabled.' },
    ]
  },
  {
    id: 'deploy-auth',
    title: '3.0 Authentication & Initialization',
    sourceDocument: 'Firebase Deployment Protocol',
    items: [
        { id: 'dep-auth-1', label: '**Step 1: Login.** Authenticate with Firebase by running `firebase login` in your terminal and following the prompts.' },
        { id: 'dep-auth-2', label: '**Step 2: Initialize Project.** In the root directory of the OS, run `firebase init hosting`. ' },
        { id: 'dep-auth-3', label: '**Step 3: Configure.** When prompted: Select "Use an existing project" and choose "wonky-sprout-os". For the public directory, specify `.` (a single period). Configure as a single-page app by answering "Yes" to "rewrite all URLs to /index.html". Do NOT overwrite `index.html`.' },
    ]
  },
  {
    id: 'deploy-build',
    title: '4.0 Build Step (CRITICAL)',
    sourceDocument: 'Firebase Deployment Protocol',
    description: 'The current in-browser Babel transpilation is for development ONLY. A production deployment requires a pre-compiled build.',
    items: [
        { id: 'dep-build-1', label: '**Future State (V2.0):** With a Vite build system, the command would be `npm run build`. This would generate an optimized `dist` folder. The public directory in `firebase.json` would then be set to `dist`.' },
        { id: 'dep-build-2', label: '**Current State (V1.1):** As we are deploying the development environment, there is no build step. The public directory is `.` to serve the existing files directly. This is a non-conforming condition for a true production environment but is the required procedure for this version.' },
    ]
  },
  {
    id: 'deploy-deploy',
    title: '5.0 Deployment Execution',
    sourceDocument: 'Firebase Deployment Protocol',
    items: [
        { id: 'dep-deploy-1', label: '**Execute Deployment:** From the project root, run the command `firebase deploy --only hosting`.' },
        { id: 'dep-deploy-2', label: '**Verify:** Upon completion, the CLI will provide a Hosting URL. Access this URL to verify that the deployment was successful and the OS is operational.' },
    ]
  },
];