export function redactPII(text: string): {
  safePrompt: string;
  metadata: { hash: string; redactedTokensCount: number };
};
export function generateGuidance(
  prompt: string,
  opts?: any,
): Promise<string> | string;
export default any;
