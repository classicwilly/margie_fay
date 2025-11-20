import { sanitizePrompt } from '../src/utils/promptSanitizer';

describe('sanitizePrompt', () => {
  it('removes emails and phone numbers', () => {
    const input = 'Contact me at bob@example.com or +1 (555) 555-5555. Also mention Willow.';
    const sanitized = sanitizePrompt(input);
    expect(sanitized).not.toContain('bob@example.com');
    expect(sanitized).not.toContain('+1 (555) 555-5555');
    expect(sanitized).toContain('[REDACTED_EMAIL]');
    expect(sanitized).toContain('[REDACTED_PHONE]');
    expect(sanitized).toContain('[REDACTED_NAME]');
  });
});
