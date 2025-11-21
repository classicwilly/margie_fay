/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: { dark: '#0f172a' },
        surface: { 800: '#1e293b', 700: '#334155' },
        primary: { 400: '#60a5fa' },
        accent: { teal: '#2dd4bf', red: '#f87171', blue: '#60a5fa' },
        text: { light: '#f1f5f9', muted: '#94a3b8' }
      }
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}", // Capture root components if any exist
  ],
  theme: {
    extend: {
      colors: {
        background: { dark: '#0f172a' }, // Ensure your custom colors exist
        surface: { 800: '#1e293b', 700: '#334155' },
        primary: { 400: '#60a5fa' },
        accent: { teal: '#2dd4bf', red: '#f87171', blue: '#60a5fa' },
        text: { light: '#f1f5f9', muted: '#94a3b8' }
      }
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
    },
    extend: {
        colors: {
            'sanctuary-bg': '#0a192f',
            'sanctuary-card': '#112240',
            'sanctuary-text-main': '#ccd6f6',
            'sanctuary-text-secondary': '#8892b0',
            'sanctuary-accent': '#64ffda',
            'sanctuary-focus': '#58a6ff',
            'sanctuary-warning': '#f39c12',
            'sanctuary-purple': '#9b59b6',
            'sanctuary-border': '#233554',

            // Legacy mapping for compatibility: map old token names to sanctuary tokens
            'background-dark': '#0a192f',
            'card-dark': '#112240',
            'text-light': '#ccd6f6',
            'accent-teal': '#64ffda',
            'accent-blue': '#58a6ff',
            'accent-green': '#64ffda',
            // Common aliases developers use in the app
            'sanctuary-text': '#ccd6f6',
            'text-text-light': '#ccd6f6',
            'text-background-dark': '#0a192f',
            'card-darker': '#0b1220'
        },
        // Custom properties for progress bar animation
        // The actual animation is handled in the component, this just allows arbitrary values.
        width: {
          'progress-width': 'var(--progress-width)',
        }
    }
  },
  plugins: [],
}
