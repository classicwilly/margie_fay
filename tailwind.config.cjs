/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'bg-background-dark', 'bg-card-dark', 'bg-surface-900', 'bg-surface-800', 'bg-surface-700',
    'text-light', 'text-muted', 'text-text-light', 'text-text-muted',
    'border-surface-700', 'border-gray-700', 'shadow-neon-sm', 'shadow-neon-md'
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
        'accent-teal': '#2dd4bf', // Primary Action/Success
        'accent-pink': '#ec4899', // Grounding Rose/Secondary Accent
        'text-light': '#f1f5f9',
        'text-muted': '#94a3b8',
        // Backwards-compat: some components incorrectly use text-text-* classes
        'text-text-light': '#f1f5f9',
        'text-text-muted': '#94a3b8',
        'alert-red': '#f87171',
        'alert-orange': '#fb923c',
      },
      // FINAL AESTHETIC: Custom shadows for depth and glow
      boxShadow: {
        // Inward shadow for depth (subtle)
        'inner-dark': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.4)',
        // Outward glow for focus and anchor
        'neon-sm': '0 0 8px rgba(45, 212, 191, 0.4)', // Subtle Teal Glow for hover
        'neon-md': '0 0 15px rgba(236, 72, 153, 0.6)', // Aggressive Pink Glow for anchor
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
