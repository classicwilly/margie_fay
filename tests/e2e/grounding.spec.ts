import { test, expect } from '@playwright/test';

test.describe('GroundingRose E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Inject Spy
    await page.addInitScript(() => {
      (window as any).hapticCalls = [];
      (window as any).consoleLogs = [];
      
      window.navigator.vibrate = (pattern: number | number[]) => {
        (window as any).hapticCalls.push(pattern);
        return true;
      };

      const captureLog = (...args: any[]) => {
        (window as any).consoleLogs.push(args.join(' '));
      };
      console.warn = captureLog;
      console.log = captureLog;
    });

    await page.goto('/?forceView=game-master-dashboard');
    await page.waitForLoadState('networkidle');
  });

  test('should trigger haptic feedback and visual ripple on activation', async ({ page }) => {
    const rose = page.getByTestId('grounding-rose-button');
    await expect(rose).toBeVisible();
    await rose.click();

    // Visual Ripple check
    await expect(page.locator('.animate-ping')).toBeVisible();

    // Haptic check
    const hapticCalls = await page.evaluate(() => (window as any).hapticCalls);
    expect(hapticCalls.length).toBeGreaterThan(0);
  });

  test('should be accessible via keyboard', async ({ page }) => {
    const rose = page.getByTestId('grounding-rose-button');
    await expect(rose).toBeVisible();
    
    // FIX: Explicitly focus the element before typing
    await rose.focus();
    await page.waitForTimeout(100); // stability wait
    
    // Try Enter
    await page.keyboard.press('Enter');
    
    // Check if it worked
    let calls = await page.evaluate(() => (window as any).hapticCalls);
    
    // If Enter didn't work, try Space (common button behavior)
    if (calls.length === 0) {
        await page.keyboard.press('Space');
        calls = await page.evaluate(() => (window as any).hapticCalls);
    }

    expect(calls.length).toBeGreaterThan(0);
  });

  test('should work without vibration support', async ({ page }) => {
    await page.addInitScript(() => {
        Object.defineProperty(window.navigator, 'vibrate', { value: undefined, writable: true });
    });
    await page.reload();
    
    const rose = page.getByTestId('grounding-rose-button');
    await rose.click();

    // Pass if log exists OR ripple exists
    const logs = await page.evaluate(() => (window as any).consoleLogs);
    const hasLog = logs.some((l: string) => /vibration|supported/i.test(l));
    const ripple = await page.locator('.animate-ping').isVisible();
    
    expect(hasLog || ripple).toBe(true);
  });
});