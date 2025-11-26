# Designing for Neurodiversity — Guidelines & Implementation

---

This guide collates practical, code-oriented guidance for making the Wonky Sprout OS UI friendlier
for neurodiverse users. It summarises design, development, and testing approaches and provides a
short implementation checklist for developers.

## Key Principles

---

- Predictability & Reduced Cognitive Load: Keep UI consistent, use clear headings, avoid hidden controls, present a single primary action per view when possible.
- Reduce non-essential motion & autoplay: Respect the user `prefers-reduced-motion` setting; reduce or remove cascading animations and auto-playing media.
- Clear, consistent layout & visual hierarchy: Use predictable headings, icons with text labels, consistent button placement and affordances.
- Text & spacing: Use adequate font sizes (16px+ for body), line-height, and avoid dense blocks that make scanning difficult.
- High contrast, but avoid excessive glare: Make available a color contrast mode for high contrast, and maintain color alternatives rather than only color cues.
- Keyboard & focus: Provide clear, visible focus styles and consistent keyboard navigation; avoid focus traps.
- Accessible & clear instructions: Provide simple, consistent labels, and avoid ambiguous microcopy. Add tooltips and accessible help where necessary.
- Avoid sudden changes and surprise interactions: Avoid modals or auto-redirects that move focus unexpectedly.

## Practical Implementation Tips

---

- Respect `prefers-reduced-motion`: Use CSS `@media (prefers-reduced-motion: reduce)` and component-level checks (Framer Motion `shouldReduceMotion`) to disable non-essential animations and transitions.
- Test for `prefers-reduced-motion` in E2E flows and ensure the UI renders gracefully under reduced motion.
- Provide ‘reduce motion’ and ‘low sensory’ toggles in the UI where appropriate.
- Use meaningful ARIA attributes for dynamic content; prefer `aria-live` for real-time updates and avoid `role=marquee` and blinking text.
- Offer a ‘clear mode’ with simplified layout for complex UIs; reduce cognitive load by limiting options on-screen.
- Avoid reliance on color alone — pair color with icons/text.
- Offer font scaling and density controls when possible (CSS `rem` and `em` tokenization).
- Ensure `focus-visible` styles are present and test keyboard-only navigation paths.

## Testing Checklist (E2E / CI)

---

- Add Playwright tests to emulate `prefers-reduced-motion` and verify there are no auto-playing media or large animations.
- Use Axe for automated accessibility checks; ensure no serious/critical violations and review moderate ones for neurodiversity impact.
- Add tests to verify keyboard navigation, focus outlines, and that `tab` order is logical.
- Add visual tests to ensure text sizes, line-heights, and contrast pass. Use Axe for color-contrast and manual checks for readability.

## Developer Checklist (Before merging UI changes)

---

1. Check the UI does not rely on color only (color + text/icon).
2. Where animations exist, validate they step down using `prefers-reduced-motion`.
3. Validate focus-visible styles exist for interactive elements.
4. Run `npm run test:e2e` with `--grep=neurodiversity` (created tests) to verify reduced-motion and keyboard navigation.
5. Run Axe and ensure no `critical` or `serious` violations for the changed components.

## Resources

---

- AdChitects — Designing for Neurodiversity: https://adchitects.co/blog/design-for-neurodiversity
- Simpleview — Designing Inclusive Websites: https://www.simpleviewinc.com/blog/stories/post/designing-inclusive-websites-how-to-create-neurodiverse-friendly-online-experiences/
- WCAG & Neurodiversity: https://www.wcag.com/blog/digital-accessibility-and-neurodiversity/

If unsure, reach out to the accessibility/design lead for a pairing session.
