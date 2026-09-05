import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

// Verifies the RPUX-005 depth-sorting fix against real scenery: on w1-09 a
// tall tree decorates the wall at (2,0) (depth (2+0)*100+30 = 230). The
// witness path passes (1,0) (robot depth 150 → renders BEHIND the tree) and
// then (2,1)/(3,1) (robot depth 350/450 → renders IN FRONT of it). Asserts
// both orderings occur in the live scene and captures screenshots.
const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome',
  args: ['--no-sandbox', '--disable-gpu', '--enable-unsafe-swiftshader'],
});
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
mkdirSync('qa/screenshots', { recursive: true });

// Seed w1-01..w1-08 complete so w1-09 is unlocked.
const done = (id) => ({
  levelId: id, completed: true,
  awards: { completion: true, bonus: true, efficiency: true },
  bestBlocks: 3, bestActions: 3,
});
await page.addInitScript(() => {
  if (localStorage.getItem('robo_paths_progress_v1')) return;
  const ids = Array.from({ length: 8 }, (_, i) => `w1-${String(i + 1).padStart(2, '0')}`);
  localStorage.setItem('robo_paths_progress_v1', JSON.stringify({
    schemaVersion: 1,
    selectedRobotId: 'pip',
    completedLevels: ids,
    levels: Object.fromEntries(ids.map((id) => [id, {
      levelId: id, completed: true,
      awards: { completion: true, bonus: true, efficiency: true },
      bestBlocks: 3, bestActions: 3,
    }])),
    settings: { soundEnabled: false, musicEnabled: false, reducedMotion: false },
    unlockedAccents: [],
    tutorialSeen: ['forward', 'right-turn', 'left-turn', 'required-pickup', 'goal-prerequisites'],
  }));
});

await page.goto('http://localhost:8081', { waitUntil: 'networkidle' });
await page.waitForSelector('text=Robo Paths');
await page.click('button:has-text("Continue Adventure")');
await page.waitForSelector('text=Sunny Meadow');
await page.click('button[aria-label^="Level 9:"]');
await page.waitForSelector('text=Not that shortcut');
await page.waitForTimeout(1500);

const treeInfo = await page.evaluate(() => {
  const scene = window.__RP_SCENE__;
  const tree = scene?.worldObjects?.find((o) => o.texture?.key === 'rp-tree');
  return tree ? { depth: tree.depth, visible: tree.visible } : null;
});
console.log('tree:', treeInfo);

// Witness F R F L F F L F: (0,0)→(1,0)[behind tree] →(1,1)→(2,1)[front]
// →(3,1)→(3,0 goal).
const witness = ['forward', 'right', 'forward', 'left', 'forward', 'forward', 'left', 'forward'];
for (const op of witness) {
  await page.locator(`button[aria-label^="Add ${op} command"]`).click();
}
await page.click('button:has-text("Run Program")');

// Poll robot depth during playback; capture the two orderings.
const observed = new Set();
let behindShot = false;
let frontShot = false;
const deadline = Date.now() + 20000;
while (Date.now() < deadline && !(behindShot && frontShot)) {
  const depth = await page.evaluate(() => window.__RP_SCENE__?.robotContainer?.depth ?? null);
  if (depth !== null) observed.add(depth);
  if (depth === 150 && !behindShot) {
    // Robot sliding toward (1,0), the tile north-west of the tree.
    await page.waitForTimeout(320);
    await page.screenshot({ path: 'qa/screenshots/occlusion-behind.png' });
    behindShot = true;
  } else if (depth === 350 && !frontShot) {
    // Robot sliding toward (2,1), south-west of the tree.
    await page.waitForTimeout(320);
    await page.screenshot({ path: 'qa/screenshots/occlusion-front.png' });
    frontShot = true;
  }
  await page.waitForTimeout(40);
}

await page.waitForSelector('[aria-label="Level success celebration"]', { timeout: 10000 })
  .catch(() => {});
const successShown = await page.locator('[aria-label="Level success celebration"]').count() > 0;
if (successShown) {
  // Let the entrance spring + staggered star pop settle, then record it.
  await page.waitForTimeout(1100);
  await page.screenshot({ path: 'qa/screenshots/celebration-motion.png' });
}

await browser.close();

const errors = [];
if (!treeInfo) errors.push('no tree object found in scene');
else if (treeInfo.depth !== 230) errors.push(`tree depth ${treeInfo.depth}, expected 230`);
if (!observed.has(150)) errors.push(`robot never reached depth 150 (behind tree); saw: ${[...observed].join(',')}`);
if (!observed.has(350)) errors.push(`robot never reached depth 350 (in front); saw: ${[...observed].join(',')}`);
if (!behindShot) errors.push('behind screenshot not captured');
if (!frontShot) errors.push('front screenshot not captured');
if (!successShown) errors.push('witness run with trees did not end in success');

if (errors.length > 0) {
  console.error('FAIL:', errors.join('; '));
  process.exit(1);
}
console.log(`OCCLUSION VERIFIED: tree@230 sorts over robot@150 (behind) and under robot@350 (front); witness still succeeds`);
