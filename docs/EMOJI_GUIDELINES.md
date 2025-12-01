# Emoji Guidelines — Google/Noto Style (Project-Wide)

This project uses the Google "Noto" emoji set (rendered via CDN-hosted PNGs) to ensure consistent emoji appearance across platforms.


Key points:
- Use the `GoogleEmoji` component for any emoji displayed in the UI (toasts, rewards/gems, trackers, protocol headers, etc.).
- Example: <GoogleEmoji symbol={'🎉'} size={20} alt="celebration" />
- The `GoogleEmoji` component falls back to the native text emoji if the image fails to load.
- The canonical emoji string values are kept in `src/constants.ts` (e.g., `{ emoji: '🎀' }`) and are passed to components. Use these strings as the source for the `GoogleEmoji` symbol prop.


Why this approach:

- Ensures consistent visual language regardless of the user's OS/device emoji font.
- Avoids visual mismatches between platforms (Android vs iOS vs Windows) and keeps the app's style coherent.


Implementation notes:

- The Noto emoji PNGs are loaded from jsDelivr CDN: jsDelivr references `googlefonts/noto-emoji` repository.
- We use codepoint sequence file names (e.g., emoji_u1f600.png) – the code to compute the file name lives in `src/utils/emoji.ts`.
- If you'd rather serve these assets locally (for offline or privacy reasons), you can harvest the PNGs from the repo and store them under `public/emojis/noto/` and update `getNotoEmojiUrl` to point to the local path.


Maintenance:

- If you need to add or remove emoji in components, favor reusing the values in `src/constants.ts`.
- If a component needs a special event or alt text, pass it via the `alt` attribute on `GoogleEmoji`.
