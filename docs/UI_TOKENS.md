# UI Tokens & Design System

This project uses a small set of color and spacing tokens to ensure consistent visual design. These tokens are declared in `tailwind.config.js` and used via Tailwind utility classes.

Primary tokens
- `sanctuary-bg`: page background color
- `sanctuary-card`: card surface background
- `sanctuary-text-main`: primary text color
- `sanctuary-text-secondary`: secondary text color
- `sanctuary-accent`: accent color used for highlights
- `sanctuary-focus`: primary call-to-action
- `sanctuary-border`: border color for cards
- `sanctuary-warning`: used for warnings and alerts

Legacy aliases
- `card-dark` and `background-dark` map to `sanctuary-card` and `sanctuary-bg`. These aliases exist for backward compatibility.
- `text-text-light` maps to `sanctuary-text-main`.

Button & Scale
- Buttons use `btn-primary`, `btn-secondary`, and `btn-danger` CSS vars in `src/index.css` for easy theming.
- Global spacing and radii are standardized; see `src/index.css` variables for button radii and spacing.

Migration & Best Practices
- Use `sanctuary-*` tokens when adding new UI.
- Prefer `bg-sanctuary-card` over `bg-card-dark` for new components.
- Avoid duplicating tokens; create a new token in `tailwind.config.js` if needed.

Typography
- Primary font: Inter
- Monospace: JetBrains Mono
- `largerText` preference uses `useNeuroPrefs` and applies a larger heading scale.

Accessibility & Animations
- `reduceAnimations` in `useNeuroPrefs` can be used to disable CSS animations.

