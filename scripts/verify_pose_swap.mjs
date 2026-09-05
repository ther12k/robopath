import { chromium } from 'playwright';

// Verifies RPUX-002: turning swaps the robot's directional pose texture
// (not just the supplementary foot arrow) in the real browser.
const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome',
  args: ['--no-sandbox', '--disable-gpu', '--enable-unsafe-swiftshader'],
});
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

// Seed w1-01 complete so w1-02 (forward + right palette) is unlocked.
await page.addInitScript(() => {
  localStorage.setItem('robo_paths_progress_v1', JSON.stringify({
    schemaVersion: 1,
    selectedRobotId: 'pip',
    completedLevels: ['w1-01'],
    levels: {
      'w1-01': {
        levelId: 'w1-01', completed: true,
        awards: { completion: true, bonus: true, efficiency: true },
        bestBlocks: 2, bestActions: 2,
      },
    },
    settings: { soundEnabled: false, musicEnabled: false, reducedMotion: false },
    unlockedAccents: [],
    tutorialSeen: ['forward', 'right-turn', 'left-turn', 'required-pickup'],
  }));
});

await page.goto('http://localhost:8081', { waitUntil: 'networkidle' });
await page.waitForSelector('text=Robo Paths');
await page.click('button:has-text("Continue Adventure")');
await page.waitForSelector('text=World 1 · Sunny Meadow');
await page.click('button:has-text("Round the corner")');
await page.waitForSelector('text=Round the corner');
await page.waitForTimeout(1200);

const poseBefore = await page.evaluate(() => window.__RP_SCENE__?.robotBody?.texture?.key);
console.log('pose before turn:', poseBefore);

// Turn right, then try to move (blocked at the southern void) — the turn
// step must already have swapped the pose.
await page.getByRole('button', { name: 'Add right command' }).click();
await page.getByRole('button', { name: 'Add forward command' }).click();
await page.click('button:has-text("Run Program")');
await page.waitForSelector('text=Keep Exploring', { timeout: 8000 });
await page.waitForTimeout(300);

const poseAfter = await page.evaluate(() => window.__RP_SCENE__?.robotBody?.texture?.key);
console.log('pose after right turn:', poseAfter);

await browser.close();

const ok = poseBefore === 'rp-robot-pip-e' && poseAfter === 'rp-robot-pip-s';
if (!ok) {
  console.error('FAIL: directional pose did not swap as expected');
  process.exit(1);
}
console.log('DIRECTIONAL POSE SWAP VERIFIED');
