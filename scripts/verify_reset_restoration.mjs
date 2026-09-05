import { chromium } from 'playwright';

// Verifies RPUX-005 reset restoration in a real browser:
// seed progress to unlock w1-04 (battery on route), run a partial program
// that collects the battery, reset, and confirm the pickup reappears;
// then complete the level to prove a full rerun works.
const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome',
  args: ['--no-sandbox', '--disable-gpu', '--enable-unsafe-swiftshader'],
});
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

// Seed storage before any app script runs so the returning-player path loads.
await page.addInitScript(() => {
  const done = (id) => ({
    levelId: id,
    completed: true,
    awards: { completion: true, bonus: true, efficiency: true },
    bestBlocks: 2,
    bestActions: 2,
  });
  localStorage.setItem('robo_paths_progress_v1', JSON.stringify({
    schemaVersion: 1,
    selectedRobotId: 'pip',
    completedLevels: ['w1-01', 'w1-02', 'w1-03'],
    levels: { 'w1-01': done('w1-01'), 'w1-02': done('w1-02'), 'w1-03': done('w1-03') },
    settings: { soundEnabled: false, musicEnabled: false, reducedMotion: false },
    unlockedAccents: [],
    tutorialSeen: ['forward', 'right-turn', 'left-turn', 'required-pickup'],
  }));
});

await page.goto('http://localhost:8081', { waitUntil: 'networkidle' });
await page.waitForSelector('text=Robo Paths');

// Returning-player fast path: Continue → map.
await page.click('button:has-text("Continue Adventure")');
await page.waitForSelector('text=Sunny Meadow');
await page.click('button[aria-label^="Level 4:"]');
await page.waitForSelector('text=Battery delivery');

// Run a partial program: Forward, Forward collects the battery at (1,0)
// and stops mid-route (incomplete → retry panel).
const forward = page.locator('button[aria-label^="Add forward command"]');
await forward.click();
await forward.click();
await page.click('button:has-text("Run Program")');
await page.waitForSelector('text=Keep Exploring', { timeout: 8000 });
await page.waitForTimeout(400);

// Reset via the retry panel (keeps the draft).
await page.click('button:has-text("Edit & Try Again")');
await page.waitForTimeout(600);
await page.screenshot({ path: 'qa/screenshots/reset-verification-restored.png' });

// The battery must be fully restored: query the live scene object state
// (visible, alpha, scale) through the DEV-only inspection hook.
const battery = await page.evaluate(() => {
  const scene = window.__RP_SCENE__;
  const sprite = scene?.collectibleObjects?.get('item-1');
  if (!sprite) return null;
  return { visible: sprite.visible, alpha: sprite.alpha, scaleX: sprite.scaleX, scaleY: sprite.scaleY };
});
console.log('battery state after reset:', battery);
const batteryRestored =
  battery !== null &&
  battery.visible === true &&
  Math.abs(battery.alpha - 1) < 0.01 &&
  Math.abs(battery.scaleX - 1) < 0.01 &&
  Math.abs(battery.scaleY - 1) < 0.01;

// Complete the level afterwards to prove a clean rerun.
await forward.click(); // draft kept: F,F + one more = F,F,F
await page.click('button:has-text("Run Program")');
await page.waitForSelector('text=Awesome!', { timeout: 8000 });
console.log('rerun to success: OK');
await page.screenshot({ path: 'qa/screenshots/reset-verification-success.png' });

await browser.close();
if (!batteryRestored) {
  console.error("FAIL: battery not restored after reset:", battery);
  process.exit(1);
}
console.log('RESET RESTORATION VERIFIED');
