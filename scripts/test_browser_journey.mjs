import { chromium, firefox, webkit } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';

mkdirSync('qa/screenshots', { recursive: true });

const PORT = 4185;

async function runJourney(engine, browserFactory, screenshotPrefix) {
  console.log(`--- ${engine} ---`);
  const browser = await browserFactory();
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, // Mobile portrait baseline
  });
  const page = await context.newPage();

  try {
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });

    // 1. Welcome Screen
    await page.waitForSelector('text=Robo Paths');
    await page.screenshot({ path: `qa/screenshots/${screenshotPrefix}-welcome.png` });

    // 2. Robot Selection
    await page.click('text=Choose Another Robot');
    await page.waitForSelector('text=Choose Your Robot');
    await page.screenshot({ path: `qa/screenshots/${screenshotPrefix}-robot-picker.png` });
    await page.click('button:has-text("Mochi")');
    await page.click("button:has-text(\"Let's Go!\")");

    // 3. Start Level 1 and dismiss tutorial
    await page.click('button:has-text("Start Playing!")');
    await page.waitForSelector('text=First steps');
    const tryItBtn = await page.waitForSelector('button:has-text("Try It!")', { timeout: 8000 });
    await tryItBtn.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: `qa/screenshots/${screenshotPrefix}-level-editing.png` });

    // 4. Assemble program: Forward, Forward
    const forwardBtn = page.getByRole('button', { name: 'Add forward command' });
    await forwardBtn.click();
    await forwardBtn.click();
    await page.waitForTimeout(250);

    // 5. Run and observe execution
    await page.click('button:has-text("Run Program")');
    await page.waitForTimeout(350);
    await page.screenshot({ path: `qa/screenshots/${screenshotPrefix}-running.png` });

    // 6. Success modal with 3 stars
    await page.waitForSelector('text=Awesome!', { timeout: 10000 });
    await page.waitForTimeout(250);
    await page.screenshot({ path: `qa/screenshots/${screenshotPrefix}-success.png` });

    // 7. Back to world map
    await page.click('button:has-text("Back to Map")');
    await page.waitForSelector('text=World 1 · Sunny Meadow');
    await page.waitForTimeout(250);
    await page.screenshot({ path: `qa/screenshots/${screenshotPrefix}-world-map.png` });

    console.log(`${engine}: journey PASSED`);
  } finally {
    await browser.close();
  }
}

async function main() {
  console.log('Starting preview server...');
  const server = spawn('npx', ['vite', 'preview', '--port', String(PORT)], {
    stdio: 'ignore',
  });
  await new Promise((r) => setTimeout(r, 2000));

  const engines = [
    ['chromium', () => chromium.launch({
      executablePath: '/usr/bin/google-chrome',
      args: ['--no-sandbox', '--disable-gpu', '--enable-unsafe-swiftshader'],
    })],
    ['firefox', () => firefox.launch()],
    ['webkit', () => webkit.launch()],
  ];

  const failures = [];
  try {
    for (const [name, factory] of engines) {
      try {
        await runJourney(name, factory, name);
      } catch (err) {
        failures.push({ engine: name, error: String(err).split('\n')[0] });
        console.error(`${name}: journey FAILED — ${err}`);
      }
    }
  } finally {
    server.kill();
  }

  if (failures.length > 0) {
    console.error('FAILED ENGINES:', failures.map((f) => f.engine).join(', '));
    process.exit(1);
  }
  console.log('ALL BROWSER JOURNEYS PASSED on chromium, firefox and webkit!');
}

main().catch((err) => {
  console.error('Browser journey error:', err);
  process.exit(1);
});
