/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // Neon backgrounds
    'bg-neon-green', 'bg-neon-pink', 'bg-neon-blue', 'bg-neon-yellow', 'bg-neon-orange', 'bg-neon-purple',
    // Neon text
    'text-neon-green', 'text-neon-pink', 'text-neon-blue', 'text-neon-yellow', 'text-neon-orange', 'text-neon-purple',
    // Neon borders
    'border-neon-green', 'border-neon-pink', 'border-neon-blue', 'border-neon-yellow', 'border-neon-orange', 'border-neon-purple',
    // Neon gradients
    'from-neon-green', 'via-neon-pink', 'to-neon-blue', 'from-neon-yellow', 'via-neon-orange', 'to-neon-purple',
    // Neon shadows and glows
    'shadow-neon', 'glow-neon', 'shadow-neon-green', 'shadow-neon-pink', 'shadow-neon-blue', 'shadow-neon-yellow', 'shadow-neon-orange', 'shadow-neon-purple',
    // Neon ring and outline
    'ring-neon-green', 'ring-neon-pink', 'ring-neon-blue', 'ring-neon-yellow', 'ring-neon-orange', 'ring-neon-purple',
    // Neon button and input states
    'hover:bg-neon-green', 'hover:bg-neon-pink', 'hover:bg-neon-blue', 'hover:bg-neon-yellow', 'hover:bg-neon-orange', 'hover:bg-neon-purple',
    'focus:ring-neon-green', 'focus:ring-neon-pink', 'focus:ring-neon-blue', 'focus:ring-neon-yellow', 'focus:ring-neon-orange', 'focus:ring-neon-purple',
    // Neon gradients for backgrounds
    'bg-gradient-to-r', 'bg-gradient-to-l', 'bg-gradient-to-t', 'bg-gradient-to-b',
    // Animated neon effects
    'animate-neon', 'animate-glow',
    // Dynamic variants commonly used in the codebase (with transparency)
    'bg-neon-blue/10', 'bg-neon-blue/20', 'bg-neon-green/10', 'bg-neon-pink/10', 'bg-sour-accent/10', 'bg-sour-accent/20', 'bg-sour-accent/50',
    'hover:bg-sour-accent', 'hover:bg-sour-accent/20', 'placeholder-sour-accent/50',
    'text-sour-accent', 'border-sour-accent', 'shadow-neon-sour', 'ring-neon-blue', 'ring-neon-blue/20',
    // Sour mode (legacy) support
    'bg-sour-accent', 'text-sour-accent', 'border-sour-accent', 'shadow-neon-sour', 'hover:bg-sour-accent', 'placeholder-sour-accent/50',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Use monospace font for terminal aesthetic in select areas
        sans: ['"Inter"', ...defaultTheme.fontFamily.sans],
        mono: ['"Dank Mono"', '"Fira Code"', ...defaultTheme.fontFamily.mono],
      },
      colors: {
        // Deep, rich base colors for high contrast (The Void)
        'background-dark': '#0f172a', 
        // Backwards-compatible alias tokens used across components
        'card-dark': '#161b22',
        'sanctuary-card': '#161b22',
        'surface-900': '#10152B',
        'surface-800': '#1C2442', // Standard Card Background
        'surface-700': '#334155', // Card Border/Separator
        
        // High-contrast accents (The Dopamine Hits)
        'accent-teal': 'var(--color-accent-teal)', // Primary Action/Success
        'accent-pink': 'var(--color-accent-pink)', // Grounding Rose/Secondary Accent
        'text-light': '#f1f5f9',
        'text-muted': '#94a3b8',
        // Backwards-compat: some components incorrectly use text-text-* classes
        'text-text-light': '#f1f5f9',
        'text-text-muted': '#94a3b8',
        'alert-red': '#f87171',
        'alert-orange': '#fb923c',
        // Neon / Sour mode
        'neon-green': 'var(--neon-green)',
        'neon-pink': 'var(--neon-pink)',
        'neon-blue': 'var(--neon-blue)',
        'neon-yellow': 'var(--neon-yellow)',
        'neon-orange': 'var(--neon-orange)',
        'neon-purple': 'var(--neon-purple)',
        // Legacy sour-mode accent
        'sour-accent': 'var(--sour-accent)',
      },
      // FINAL AESTHETIC: Custom shadows for depth and glow
      boxShadow: {
        // Inward shadow for depth (subtle)
        'inner-dark': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.4)',
        // Outward glow for focus and anchor
        'neon-sm': '0 0 8px rgba(45, 212, 191, 0.4)', // Subtle Teal Glow for hover
        'neon-md': '0 0 15px rgba(236, 72, 153, 0.6)', // Aggressive Pink Glow for anchor
        'neon-pink': '0 0 15px rgba(236, 72, 153, 0.6)',
        'neon-sour': '0 0 15px rgba(204, 255, 0, 0.35)',
      },
      backgroundImage: {
        'neon-sunset': 'linear-gradient(135deg, rgba(236,72,153,0.12) 0%, rgba(45,212,191,0.12) 100%)',
        'grid-pattern': 'linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(180deg, rgba(255,255,255,0.02) 1px, transparent 1px)'
      },
      container: { center: true, padding: '2rem' },
      keyframes: {
        // CRT Flicker Effect (Low-stim visual feedback) (From attached config)
        flicker: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.98 },
        },
        // Subtle pulse for interactive elements (From attached config)
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        },
      },
      animation: {
        flicker: 'flicker 4s ease-in-out infinite',
        pulse: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}