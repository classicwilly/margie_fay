import { ALL_CHECKLIST_DATA } from './checklist-data.js';

export const SOP_DATA = [
  {
    id: '1',
    category: 'M4_SOP',
    subCategory: 'foundational',
    viewId: 'foundational-protocols',
    title: 'Foundational Daily Protocols',
    description: 'The core 5 protocols required for system stability and daily function. Execute sequentially without deviation.',
    steps: [
      '1. Water: Consume 500ml immediately upon waking. Prime the system.',
      '2. Pills: Administer all prescribed medications. Non-negotiable system input.',
      '3. Capture: Record all emergent thoughts, tasks, and ideas into the designated capture tool (Anker AI Recorder/Google Keep). Externalize chaos.',
      '4. Sleep Prep: Initiate wind-down sequence 90 minutes prior to target sleep time. Dim lights. Disengage screens. Prepare environment.',
      '5. Daily Dump: Perform brain dump/journaling. Process daily inputs before reset. Verify system state.',
    ],
    cues: ['Execute on wake', 'Verify compliance', 'No excuses'],
  },
  {
    id: '2',
    category: 'M4_SOP',
    subCategory: 'mode',
    viewId: 'solo-execution-mode',
    title: 'Solo Execution Mode',
    description: 'Optimized for deep work and focused output. Strictly adhere to hourly blocks. Minimize distractions. This is not a suggestion.',
  },
  {
    id: '3',
    category: 'M4_SOP',
    subCategory: 'mode',
    viewId: 'family-structure-mode',
    title: 'Family Structure Mode',
    description: 'High-vigilance parenting and structured family engagement. Predictability is comfort. Prioritize children (P5).',
  },
  {
    id: '4',
    category: 'M4_SOP',
    subCategory: 'meta',
    viewId: 'classic-willy-protocol',
    title: 'Classicwilly Protocol: 11/10 Output',
    description: 'A mandate for absolute quality and precision. No ambiguity. No placeholders. This defines "done."',
  },
  {
    id: '5',
    category: 'M4_IPI',
    subCategory: 'ipi',
    viewId: 'sensory-overload',
    title: 'IPI: System Overload / Sensory Overload',
    description: 'Protocol for managing acute sensory or executive function overload. Prioritize immediate stabilization. This is an emergency procedure.',
  },
  {
    id: '6',
    category: 'M4_SOP',
    subCategory: 'foundational',
    viewId: 'morning-transition-protocol',
    title: 'Morning Transition Protocol',
    description: 'A structured sequence to bridge the gap between sleep and active execution, minimizing cognitive fog and decision paralysis.',
  },
  {
    id: '7',
    category: 'M4_SOP',
    subCategory: 'hardware',
    viewId: 'command-center-setup',
    title: 'Command Center Setup',
    description: 'Defines the required hardware, software, and spatial layout for an optimized, low-friction workspace.',
  },
  {
    id: '8',
    category: 'M4_SOP',
    subCategory: 'hardware',
    viewId: 'pixel-fold-setup',
    title: 'Pixel Fold Setup',
    description: 'Configuration for the mobile extension of the OS, focused on chaos capture and continuity.',
  },
  {
    id: '9',
    category: 'M4_SOP',
    subCategory: 'maintenance',
    viewId: 'life-maintenance-protocol',
    title: 'Life Maintenance Protocol',
    description: 'Systematizes essential survival tasks: house cleaning, groceries, and personal hygiene, treating them as mechanical systems.',
    taskTemplate: [
      { title: 'Perform daily kitchen maintenance (5 min)', priority: 'Medium' },
      { title: 'Perform daily bathroom maintenance (5 min)', priority: 'Medium' },
      { title: 'Perform daily living space maintenance (5 min)', priority: 'Low' },
      { title: 'Plan weekly deep clean rotation', priority: 'Medium' },
      { title: 'Execute templated grocery run', priority: 'High' },
      { title: 'Execute tiered hygiene protocol', priority: 'High' },
    ]
  },
  {
    id: '10',
    category: 'M4_SOP',
    subCategory: 'maintenance',
    viewId: 'personal-hygiene-protocol',
    title: 'Personal Hygiene Protocol',
    description: 'A tiered system matching hygiene tasks to available capacity, removing shame and executive function barriers.',
  },
  {
    id: '11',
    category: 'M4_SOP',
    subCategory: 'hardware',
    viewId: 'bubble-shield-protocol',
    title: 'Bubble Shield Protocol',
    description: 'Mandates the use of sensory mitigation hardware (e.g., noise-cancelling headphones) as non-negotiable assistive technology.',
  },
  {
    id: '12',
    category: 'M4_SOP',
    subCategory: 'meta',
    viewId: 'accessibility-safety',
    title: 'Accessibility & Safety Protocol',
    description: 'Ensures the OS itself is safe, stable, and usable for neurodivergent users by defining accessibility standards.',
  },
  {
    id: '13',
    category: 'M4_IPI',
    subCategory: 'ipi',
    viewId: 'context-switching',
    title: 'IPI: Context Switching Recovery',
    description: 'A rapid protocol to capture cognitive state, handle interruptions, and restore context with minimal cognitive load.',
  },
  {
    id: '14',
    category: 'M4_IPI',
    subCategory: 'ipi',
    viewId: 'executive-dysfunction',
    title: 'IPI: Executive Dysfunction Emergency',
    description: 'An emergency reboot for when tasks feel impossible, designed to restore basic operational capacity when frozen.',
  },
  {
    id: '17',
    category: 'M4_IPI',
    subCategory: 'ipi',
    viewId: 'headphone-controller-ipi',
    title: 'IPI: "Wonky Sprout" Headphone Controller',
    description: 'Reverse engineer Soundcore Bluetooth commands to build a structured desktop controller and fix the chaos of the mobile-only app.',
  },
  {
    id: '18',
    category: 'KIDS_SOP',
    subCategory: 'kids',
    viewId: 'co-parenting-communication-protocol',
    title: 'Co-Parenting Communication Protocol',
    description: 'A structured system for low-friction, high-clarity communication and logistics with the co-parent. Focus on facts, not feelings.',
  },
  {
    id: '19',
    category: 'M4_SOP',
    subCategory: 'meta',
    viewId: 'ai-safety-protocol',
    title: 'AI Safety & Usage Protocol',
    description: 'Guidelines for interacting with AI systems, ensuring data privacy, ethical use, and mental well-being.',
  },
  {
    id: '20',
    category: 'M4_SOP',
    subCategory: 'meta',
    viewId: 'developer-compliance-protocol',
    title: 'Developer Compliance Protocol',
    description: 'A meta-protocol to prevent ad-hoc changes by enforcing a structured, diagnostic-first approach to all system modifications. Complacency kills.',
  },
  {
    id: '21',
    category: 'M4_SOP',
    subCategory: 'meta',
    viewId: 'design-language-protocol',
    title: 'Design Language Protocol',
    description: 'An SOP that defines the visual and interaction principles, color palette, typography, and component standards of the OS.',
  },
  {
    id: '22',
    category: 'M4_SOP',
    subCategory: 'meta',
    viewId: 'technical-manual',
    title: 'Technical Manual',
    description: 'Comprehensive guide to the build system, architecture, state management, and troubleshooting procedures for developers.',
  },
  {
    id: '23',
    category: 'M4_SOP',
    subCategory: 'meta',
    viewId: 'operating-manual',
    title: 'Operating Manual',
    description: "The comprehensive user's guide to the Wonky Sprout OS, explaining all core features and concepts.",
  },
  {
    id: '24',
    category: 'M4_SOP',
    subCategory: 'meta',
    viewId: 'deployment-protocol',
    title: 'Firebase Deployment Protocol',
    description: "The SOP for deploying the OS to Firebase Hosting, transitioning it from development to a live state.",
  }
];

export const ALL_GEMS = [
    // Weekend Gems
    { id: 'morning-hair', emoji: '🎀', label: 'Brushed Hair' },
    { id: 'morning-teeth', emoji: '😁', label: 'Brushed Teeth' },
    { id: 'morning-clothes', emoji: '👕', label: 'Changed Clothes' },
    { id: 'morning-water', emoji: '💧', label: 'Drank Water' },
    { id: 'morning-pets', emoji: '🐾', label: 'Fed Pets' },
    { id: 'prep-bed', emoji: '🛏️', label: 'Made Bed' },
    { id: 'prep-outfit', emoji: '👚', label: 'Picked Outfit' },
    { id: 'prep-pack', emoji: '🎒', label: 'Packed Backpack' },
    { id: 'prep-chores', emoji: '🧹', label: 'Did Chores' },
    { id: 'prep-help', emoji: '🛠️', label: 'Helped Dad' },
    { id: 'bedtime-cleanup', emoji: '🧸', label: 'Cleaned Up Toys' },
    { id: 'bedtime-teeth', emoji: '😴', label: 'Brushed Teeth (Night)' },
    // Weekday Gems
    { id: 'moms-wake', emoji: '☀️', label: 'Woke Up On Time' },
    { id: 'moms-dress', emoji: '👕', label: 'Got Dressed' },
    { id: 'moms-teeth-am', emoji: '😁', label: 'Brushed Teeth (AM)' },
    { id: 'moms-hair', emoji: '🎀', label: 'Brushed Hair' },
    { id: 'moms-pack', emoji: '🎒', label: 'Packed Backpack' },
    { id: 'moms-school', emoji: '🏫', label: 'Got To School' },
    { id: 'moms-unpack', emoji: '🏠', label: 'Unpacked Bag' },
    { id: 'moms-homework', emoji: '📚', label: 'Did Homework' },
    { id: 'moms-cleanup', emoji: '🍽️', label: 'Cleaned Up Dinner' },
    { id: 'moms-teeth-pm', emoji: '😴', label: 'Brushed Teeth (PM)' },
    { id: 'moms-prep-pm', emoji: '🎒', label: 'Prepped Bag (Night)' },
    // New Quest Reward Gems
    { id: 'quest-bronze', emoji: '🥉', label: 'Bronze Quest' },
    { id: 'quest-silver', emoji: '🥈', label: 'Silver Quest' },
    { id: 'quest-gold', emoji: '🥇', label: 'Gold Quest' },
];

export const REWARD_TIERS = [
  {
    threshold: 5,
    emoji: '🌟',
    title: 'Sticker Pack',
    description: 'Unlock a pack of awesome stickers of your choice!',
  },
  {
    threshold: 10,
    emoji: '🍿',
    title: 'Special Snack Choice',
    description: 'You get to pick one special snack on the next grocery trip.',
  },
  {
    threshold: 15,
    emoji: '🎮',
    title: '30 Mins Extra Screen Time',
    description: 'Get 30 extra minutes for games or videos, to be used this weekend.',
  },
  {
    threshold: 20,
    emoji: '🎬',
    title: 'Choose a Family Movie',
    description: 'You pick the movie for our next family movie night!',
  },
  {
    threshold: ALL_GEMS.length,
    emoji: '🏆',
    title: 'The Grand Prize',
    description: 'You collected ALL the gems! Time for a special talk with Dad about a bigger prize.',
  }
];

export const ALL_ACHIEVEMENTS = [
    { id: 'foundational-day-complete', emoji: '🪨', label: 'Foundation Set', description: 'Completed all Foundational Daily Protocols in a single day.' },
    { id: 'weekly-review-complete', emoji: '📊', label: 'System Analyst', description: 'Completed a Weekly Review, analyzing and calibrating the OS.' },
    { id: 'inbox-zero', emoji: '📭', label: 'Inbox Zero', description: 'Cleared all items from the Task Matrix inbox.' },
    { id: 'first-sop-created', emoji: '🏗️', label: 'System Architect', description: 'Created your first custom Standard Operating Procedure.' },
    { id: 'first-focus-session', emoji: '🎯', label: 'Focused Power', description: 'Completed your first Focus Mode session in the Task Matrix.' },
    { id: 'project-complete', emoji: '🏁', label: 'Project Complete!', description: 'Finished and archived your first strategic project.' },
    { id: 'all-systems-green', emoji: '✅', label: 'All Systems Green', description: 'Achieved a Sprout Health Score of 100.' },
    { id: 'first-habit-streak', emoji: '🔥', label: 'On Fire', description: 'Maintained a 7-day streak on any habit.' },
];

export const ADULT_REWARD_TIERS = [
  {
    threshold: 2,
    emoji: '🛠️',
    title: '1 Hour Hobby Time',
    description: 'Permission for 1 hour of uninterrupted, guilt-free time on a personal project.',
  },
  {
    threshold: 4,
    emoji: '💸',
    title: 'Small Tech/Tool Purchase',
    description: 'Authorize a purchase of a new tool or piece of tech up to $50.',
  },
  {
    threshold: ALL_ACHIEVEMENTS.length,
    emoji: '🏖️',
    title: 'Guilt-Free Rest Day',
    description: 'Schedule a full day with zero obligations. True system downtime.',
  }
];

interface ModuleConfig {
    id: string;
    name: string;
    description: string;
    defaultEnabled: boolean;
    isRemovable: boolean;
    category: string;
    icon: string;
}

// --- Configurable Modules for William's Dashboard ---
const staticWilliamModules: ModuleConfig[] = [
  {
    id: 'daily-briefing-module',
    name: 'Daily Command Module',
    description: 'A unified daily dashboard combining AI summary, critical tasks, today\'s agenda, and daily habits.',
    defaultEnabled: true,
    isRemovable: false,
    category: 'core',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
  },
  {
    id: 'task-matrix-module',
    name: 'Task Matrix',
    description: 'A comprehensive task management system for all non-recurring tasks. Your central inbox for action items.',
    defaultEnabled: true,
    isRemovable: false,
    category: 'core',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'
  },
  {
    id: 'day-progress-bar-module',
    name: 'Day Progress Bar',
    description: 'Visual representation of daily progress from 6 AM to 10:30 PM.',
    defaultEnabled: true,
    isRemovable: true,
    category: 'trackers',
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  {
    id: 'status-tracker-module',
    name: 'Personal Status Tracker',
    description: 'Track your current mood and energy levels.',
    defaultEnabled: true,
    isRemovable: true,
    category: 'trackers',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
  },
  {
    id: 'kids-tracker-module',
    name: 'Kids Status Tracker',
    description: 'Track location and add notes for Willow and Sebastian.',
    defaultEnabled: false,
    isRemovable: true,
    category: 'trackers',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
  },
   {
    id: 'sensory-check-in-module',
    name: 'Sensory Check-in',
    description: 'Log your sensory state to identify patterns of over/under-stimulation.',
    defaultEnabled: false,
    isRemovable: true,
    category: 'trackers',
    icon: 'M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.636 5.636a9 9 0 0112.728 0m-12.728 0a9 9 0 000 12.728'
  },
  {
    id: 'habit-streak-tracker-module',
    name: 'Habit Streak Tracker',
    description: 'Define and track core habits to build consistency and reinforce routines.',
    defaultEnabled: false,
    isRemovable: true,
    category: 'trackers',
    icon: 'M13 7l-2 4-2-4m-5 9l7 7 7-7m-5-9l-2 4-2-4'
  },
  {
    id: 'expense-tracker-module',
    name: 'Simple Expense Tracker',
    description: 'A low-friction system for capturing and categorizing expenses.',
    defaultEnabled: false,
    isRemovable: true,
    category: 'trackers',
    icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z'
  },
  {
    id: 'recurring-task-engine-module',
    name: 'Recurring Task Engine',
    description: 'Automated tracking for periodic life maintenance tasks (e.g., bills, appointments).',
    defaultEnabled: false,
    isRemovable: true,
    category: 'utilities',
    icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
  },
  {
    id: 'financial-snapshot-module',
    name: 'Financial Snapshot & Budgeting',
    description: 'Set monthly budgets and track spending against them for a high-level financial overview.',
    defaultEnabled: false,
    isRemovable: true,
    category: 'trackers',
    icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
  },
  {
    id: 'strategic-objectives-module',
    name: 'Strategic Objectives',
    description: 'Define and track long-term goals (Objectives) and their component parts (Projects), linking them to daily tasks.',
    defaultEnabled: false,
    isRemovable: true,
    category: 'utilities',
    icon: 'M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
  },
  {
    id: 'wonky-ai-module',
    name: 'The Mood',
    description: 'Text-based conversation with The Mood for problem-solving.',
    defaultEnabled: true,
    isRemovable: true,
    category: 'utilities',
    icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z'
  },
  {
    id: 'cockpit-module',
    name: 'Cockpit',
    description: 'Profile & preferences manager for audio/ornamental/visual stacks. Create, apply, and manage attention-friendly stacks.',
    defaultEnabled: true,
    isRemovable: true,
    category: 'core',
    icon: 'M12 2a10 10 0 100 20 10 10 0 000-20zm1 15l-5-3 5-3v6z'
  },
  {
    id: 'live-chat-module',
    name: 'Mood Live Chat',
    description: 'Real-time voice conversation with The Mood for hands-free problem-solving.',
    defaultEnabled: false,
    isRemovable: true,
    category: 'utilities',
    icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z'
  },
  {
    id: 'family-chat-module',
    name: 'Family Chat',
    description: 'A shared chat for family members.',
    defaultEnabled: false,
    isRemovable: true,
    category: 'utilities',
    icon: 'M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V7a2 2 0 012-2h2m8-2H9a2 2 0 00-2 2v8a2 2 0 002 2h2m8-2H9'
  },
  {
    id: 'quick-reference-vault-module',
    name: 'Quick Reference Vault',
    description: 'Store and quickly retrieve small, critical pieces of information like passwords or model numbers.',
    defaultEnabled: false,
    isRemovable: true,
    category: 'utilities',
    icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z'
  },
  {
    id: 'knowledge-capture-vault-module',
    name: 'Knowledge Synthesis Engine',
    description: 'A searchable vault for insights, notes, and processed knowledge. Your personal second brain.',
    defaultEnabled: false,
    isRemovable: true,
    category: 'utilities',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
  },
  {
    id: 'pomodoro-timer-module',
    name: 'Pomodoro Timer',
    description: 'A simple focus timer to help with task initiation and management.',
    defaultEnabled: false,
    isRemovable: true,
    category: 'utilities',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01'
  },
  {
    id: 'achievement-tracker-module',
    name: 'Achievement System',
    description: 'Track personal achievements and adult reward tiers.',
    defaultEnabled: false,
    isRemovable: true,
    category: 'trackers',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  {
    id: 'active-sops-display-module',
    name: 'Active SOPs Display',
    description: 'Displays the SOPs you have marked as "active" for quick reference and execution.',
    defaultEnabled: false,
    isRemovable: true,
    category: 'content',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
  },
  {
    id: 'active-sops-selector-module',
    name: 'Active SOPs Selector',
    description: 'Select which SOPs you want to see displayed in the Active SOPs module.',
    defaultEnabled: false,
    isRemovable: true,
    category: 'selection',
    icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
  },
  {
    id: 'sensory-regulation-module',
    name: 'Sensory Regulation Toolkit',
    description: 'A collection of simple, interactive tools for sensory input and regulation.',
    defaultEnabled: false,
    isRemovable: true,
    category: 'utilities',
    icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  }
];

// Dynamically generate checklist modules
const checklistModules = ALL_CHECKLIST_DATA.reduce((acc: ModuleConfig[], section) => {
    const source = section.sourceDocument;
    // Check if this source already has a module to avoid duplicates
    if (!acc.find(m => m.name === `Checklist: ${source}`)) {
        acc.push({
            id: `checklist-module-${source.toLowerCase().replace(/\s+/g, '-')}`,
            name: `Checklist: ${source}`,
            description: `Display the checklist for the "${source}" protocol.`,
            defaultEnabled: false,
            isRemovable: true,
            category: 'checklists',
            icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
        });
    }
    return acc;
}, []);


export const ALL_WILLIAM_MODULES_CONFIG: ModuleConfig[] = [...staticWilliamModules, ...checklistModules];


// --- Configurable Modules for Willow's Dashboard ---
export const ALL_WILLOW_MODULES_CONFIG = [
  {
    id: 'family-mode-status-module',
    name: 'Family Mode Status',
    description: "Shows the current family mode (e.g., Family Time) and what's happening now.",
    defaultEnabled: true,
    isRemovable: false,
    category: 'core',
  },
  {
    id: 'quest-log-module',
    name: 'Quest Log',
    description: "Special missions from Dad! Complete all the steps to earn a big reward.",
    defaultEnabled: true,
    isRemovable: false,
    category: 'quests',
  },
  {
    id: 'willow-checklist-module',
    name: 'Daily Checklists',
    description: "Willow's daily and weekly checklists for routines and tasks.",
    defaultEnabled: true,
    isRemovable: false,
    category: 'checklists',
  },
  {
    id: 'willow-gem-collector-module',
    name: 'Dopamine Cache',
    description: "Willow's dopamine cache and progress towards sensory rewards.",
    defaultEnabled: true,
    isRemovable: false,
    category: 'rewards',
  },
  {
    id: 'reward-store-module',
    name: 'Dopamine Mining',
    description: 'Redeem sensory rewards using your collected dopamine.',
    defaultEnabled: true,
    isRemovable: true,
    category: 'rewards',
  },
  {
    id: 'direct-message-module',
    name: 'Direct Message to Dad',
    description: 'Send an important message directly to Dad.',
    defaultEnabled: true,
    isRemovable: true,
    category: 'communication',
  },
];

// --- Configurable Modules for Sebastian's Dashboard ---
export const ALL_SEBASTIAN_MODULES_CONFIG = [
  {
    id: 'family-mode-status-module',
    name: 'Family Mode Status',
    description: "Shows the current family mode (e.g., Family Time) and what's happening now.",
    defaultEnabled: true,
    isRemovable: false,
    category: 'core',
  },
   {
    id: 'quest-log-module',
    name: 'Quest Log',
    description: "Special missions from Dad! Complete all the steps to earn a big reward.",
    defaultEnabled: true,
    isRemovable: false,
    category: 'quests',
  },
  {
    id: 'sebastian-checklist-module',
    name: 'Daily Checklists',
    description: "Sebastian's daily and weekly checklists for routines and tasks.",
    defaultEnabled: true,
    isRemovable: false,
    category: 'checklists',
  },
  {
    id: 'sebastian-gem-collector-module',
    name: 'Dopamine Cache',
    description: "Sebastian's dopamine cache and progress towards sensory rewards.",
    defaultEnabled: true,
    isRemovable: false,
    category: 'rewards',
  },
  {
    id: 'reward-store-module',
    name: 'Dopamine Mining',
    description: 'Redeem sensory rewards using your collected dopamine.',
    defaultEnabled: true,
    isRemovable: true,
    category: 'rewards',
  },
  {
    id: 'direct-message-module',
    name: 'Direct Message to Dad',
    description: 'Send an important message directly to Dad.',
    defaultEnabled: true,
    isRemovable: true,
    category: 'communication',
  },
];


// --- Configurable Modules for Co-Parenting Dashboard ---
export const ALL_CO_PARENTING_MODULES_CONFIG = [
    {
        id: 'ai-communication-coach-module',
        name: 'AI Communication Coach',
        description: 'Translate your direct thoughts into collaborative, low-conflict messages for your co-parent.',
        defaultEnabled: true,
        isRemovable: false,
        category: 'core',
    },
    {
        id: 'shared-calendar-module',
        name: 'Shared Calendar',
        description: 'A single source of truth for all child-related appointments, events, and handoffs.',
        defaultEnabled: true,
        isRemovable: false,
        category: 'core',
    },
    {
        id: 'shared-family-log-module',
        name: 'Shared Family Log',
        description: 'A persistent log for important, non-urgent information like medication updates or school notes.',
        defaultEnabled: true,
        isRemovable: true,
        category: 'logging',
    },
    {
        id: 'shared-child-profile-module',
        name: 'Shared Child Profiles',
        description: 'Centralized, editable profiles for each child with critical information (allergies, contacts).',
        defaultEnabled: true,
        isRemovable: true,
        category: 'info',
    },
    {
        id: 'shared-expense-tracker-module',
        name: 'Shared Expense Tracker',
        description: 'Track and manage shared expenses for the children to ensure fairness and transparency.',
        defaultEnabled: false,
        isRemovable: true,
        category: 'info',
    },
    {
        id: 'handoff-report-module',
        name: 'Guided Handoff Report',
        description: 'A structured checklist to prepare for a smooth handoff, with an AI-generated summary.',
        defaultEnabled: false,
        isRemovable: true,
        category: 'handoffs',
    },
];