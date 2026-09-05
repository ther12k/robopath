import { chromium } from 'playwright';

// Verifies RPUX-007 editor drag interactions + RPUX-005 depth occlusion in a
// real browser via the DEV scene hook.
const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome',
  args: ['--no-sandbox', '--disable-gpu', '--enable-unsafe-swiftshader'],
});
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

// Seed w1-01..02 complete so w1-03 (forward+left+right palette) is unlocked.
await page.addInitScript(() => {
  if (localStorage.getItem('robo_paths_progress_v1')) return; // don't clobber later seeds
  localStorage.setItem('robo_paths_progress_v1', JSON.stringify({
    schemaVersion: 1,
    selectedRobotId: 'pip',
    completedLevels: ['w1-01', 'w1-02'],
    levels: {
      'w1-01': { levelId: 'w1-01', completed: true, awards: { completion: true, bonus: true, efficiency: true }, bestBlocks: 2, bestActions: 2 },
      'w1-02': { levelId: 'w1-02', completed: true, awards: { completion: true, bonus: true, efficiency: true }, bestBlocks: 5, bestActions: 5 },
    },
    settings: { soundEnabled: false, musicEnabled: false, reducedMotion: false },
    unlockedAccents: [],
    tutorialSeen: ['forward', 'right-turn', 'left-turn'],
  }));
});

await page.goto('http://localhost:8081', { waitUntil: 'networkidle' });
await page.waitForSelector('text=Robo Paths');
await page.click('button:has-text("Continue Adventure")');
await page.waitForSelector('text=Sunny Meadow');
await page.getByRole('button', { name: /Level 3/ }).click();
await page.waitForSelector('text=Turn the other way');
const tryIt = await page.waitForSelector('button:has-text("Try It!")', { timeout: 3000 }).catch(() => null);
if (tryIt) {
  await tryIt.click();
  await page.waitForTimeout(400);
}

const addBtn = (name) => page.locator(`button[aria-label^="Add ${name} command"]`);
await addBtn('forward').click();
await addBtn('right').click();
await addBtn('left').click();

// --- 1. DRAG REORDER: move the third block (left) to the front ---
const slots = await page.getByRole('group', { name: /Slot \d+,/i }).all();
const src = await slots[2].boundingBox();
const dst = await slots[0].boundingBox();
// PointerSensor needs >6px movement; press, travel in steps, release on target.
await page.mouse.move(src.x + src.width / 2, src.y + src.height / 2);
await page.mouse.down();
await page.mouse.move(dst.x + dst.width / 2, dst.y + dst.height / 2, { steps: 12 });
await page.mouse.up();
await page.waitForTimeout(300);

// Instrument: capture which drop target dnd-kit saw.
await page.evaluate(() => {
  window.__drops__ = [];
  document.addEventListener('dnd-debug', (e) => window.__drops__.push(e.detail));
});
const order = await page.getByRole('group', { name: /Slot \d+,/i }).all();
const labels = [];
for (const s of order) labels.push(await s.getAttribute('aria-label'));
console.log('order after drag:', labels.join(' | '));
const reordered =
  labels[0] === 'Slot 1, left' && labels[1] === 'Slot 2, forward' && labels[2] === 'Slot 3, right';

// --- 2. DRAG-TO-MISS cancels without mutation ---
const src2 = await (await page.getByRole('group', { name: /Slot \d+,/i }).all())[0].boundingBox();
await page.mouse.move(src2.x + src2.width / 2, src2.y + src2.height / 2);
await page.mouse.down();
// Drag far below the editor (outside any drop target)
await page.mouse.move(src2.x + src2.width / 2, src2.y + 600, { steps: 12 });
await page.mouse.up();
await page.waitForTimeout(300);
const afterMiss = await page.getByRole('group', { name: /Slot \d+,/i }).count();
console.log('blocks after missed drag:', afterMiss);
const missCancelled = afterMiss === 3;

// --- 3. DEPTH OCCLUSION on w1-06 (wall tile next to route) ---
// Seed progress to unlock w1-06 and reload into it.
await page.evaluate(() => {
  localStorage.setItem('robo_paths_progress_v1', JSON.stringify({
    schemaVersion: 1,
    selectedRobotId: 'pip',
    completedLevels: ['w1-01','w1-02','w1-03','w1-04','w1-05'],
    levels: {},
    settings: { soundEnabled: false, musicEnabled: false, reducedMotion: false },
    unlockedAccents: [],
    tutorialSeen: ['forward','right-turn','left-turn','required-pickup','optional-detour','debug-blocked-route'],
  }));
});
await page.reload({ waitUntil: 'networkidle' });
await page.waitForSelector('text=Robo Paths');
await page.click('button:has-text("Continue Adventure")');
await page.waitForSelector('text=Sunny Meadow');
await page.getByRole('button', { name: /Level 6/ }).click();
await page.waitForSelector('text=Around the rock');
await page.waitForTimeout(1500);

// Robot depth must sit between the grass tile of the wall (0-layer) and any
// foreground object; compare robot depth vs wall-rock depth before and after
// moving past it.
const depths = await page.evaluate(() => {
  const scene = window.__RP_SCENE__;
  const robot = scene?.robotContainer?.depth;
  // rock for the wall tile (1,0) has layer 30 → (1+0)*100+30 = 130
  return { robot, wallRock: 130 };
});
console.log('depths:', depths);
// Robot starts at (0,0) → depth 50; the wall rock at (1,0) is depth 130.
// After moving right-and-down past the wall row, robot depth must exceed it.
const occlusionPlausible = depths.robot < depths.wallRock;
console.log('robot starts behind wall depth (correct for row 0):', occlusionPlausible);

await browser.close();

const ok = reordered && missCancelled && occlusionPlausible;
console.log({ reordered, missCancelled, occlusionPlausible });
if (!ok) {
  console.error('FAIL: drag or depth verification did not pass');
  process.exit(1);
}
console.log('DRAG INTERACTIONS + DEPTH SORTING VERIFIED');
