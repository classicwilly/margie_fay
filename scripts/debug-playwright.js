import { chromium } from "@playwright/test";

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on("console", (msg) => console.log("PAGE LOG", msg.type(), msg.text()));
  page.on("pageerror", (err) =>
    console.log("PAGE ERROR", err.message, err.stack),
  );
  try {
    // Try the default port first; fall back to 3001 if 3000 is unavailable.
    const urls = ["http://localhost:3000/", "http://localhost:3001/"];
    let success = false;
    for (const url of urls) {
      try {
        await page.goto(url);
        console.log("Loaded page on", url);
        success = true;
        break;
      } catch (e) {
        console.warn("Failed to load", url, e.message);
      }
    }
    if (!success) throw new Error("Could not reach dev server on 3000/3001");
    console.log("Loaded page");
    await page.waitForTimeout(5000);
  } catch (e) {
    console.error("Navigation failed", e);
  }
  await browser.close();
})();
