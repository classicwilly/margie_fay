export function toCodepointSequence(symbol: string): string {
  // Iterate over codepoints correctly (handles surrogate pairs and ZWJ sequences)
  const codepoints: string[] = [];
  for (const ch of Array.from(symbol)) {
    const cp = ch.codePointAt(0);
    if (typeof cp === 'number') {
      codepoints.push(cp.toString(16));
    }
  }
  return codepoints.map(cp => `u${cp}`).join('_');
}

export function getNotoEmojiUrl(symbol: string, size = 64): string {
  // Noto emoji images: png assets available at jsdelivr from googlefonts/noto-emoji
  const validSizes = [16, 24, 32, 48, 64, 128];
  const chosen = validSizes.includes(size) ? size : 64;
  const seq = toCodepointSequence(symbol);
  return `https://cdn.jsdelivr.net/gh/googlefonts/noto-emoji@main/png/${chosen}/emoji_${seq}.png`;
}

export default getNotoEmojiUrl;
