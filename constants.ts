import { Sop } from './types';

export const SOP_DATA: Sop[] = [
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
    viewId: 'co-parenting-protocol',
    title: 'Co-Parenting Communication Protocol',
    description: 'A structured system for low-friction, high-clarity communication and logistics with the co-parent. Focus on facts, not feelings.',
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
];

export interface RewardTier {
  threshold: number;
  title: string;
  description: string;
  emoji: string;
}

export const REWARD_TIERS: RewardTier[] = [
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
    { id: 'inbox-zero', emoji: '📭', label: 'Inbox Zero' },
    { id: 'life-maintenance-weekly', emoji: '🧹', label: 'Weekly Deep Clean' },
    { id: 'solo-mode-week-complete', emoji: '🏗️', label: 'Solo Week Executed' },
    { id: 'foundational-day-complete', emoji: '🪨', label: 'Daily Foundation Set' },
    { id: 'weekly-review-complete', emoji: '📊', label: 'Weekly Review Done' },
    { id: 'all-systems-green', emoji: '✅', label: 'All Systems Green' },
];

export const ADULT_REWARD_TIERS: RewardTier[] = [
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