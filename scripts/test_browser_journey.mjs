import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

mkdirSync('qa/screenshots', { recursive: true });

async function run() {
  console.log('Starting preview server on port 4185...');
  const server = spawn('npx', ['vite', 'preview', '--port', '4185'], {
    stdio: 'ignore',
  });

  // Give server time to start
  await new Promise((r) => setTimeout(r, 2000));

  console.log('Launching Chrome browser...');
  const browser = await chromium.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-gpu', '--enable-unsafe-swiftshader'],
  });

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, // Mobile iPhone / portrait baseline
  });

  const page = await context.newPage();

  try {
    console.log('Navigating to game...');
    await page.goto('http://localhost:4185/', { waitUntil: 'networkidle' });

    // 1. Welcome Screen
    await page.waitForSelector('text=Robo Paths');
    await page.screenshot({ path: 'qa/screenshots/01-welcome.png' });
    console.log('Captured 01-welcome.png');

    // 2. Robot Selection
    await page.click('text=Choose Another Robot');
    await page.waitForSelector('text=Choose Your Robot');
    await page.screenshot({ path: 'qa/screenshots/02-robot-picker.png' });
    console.log('Captured 02-robot-picker.png');

    // Select Mochi and confirm
    await page.click('button:has-text("Mochi")');
    await page.click('button:has-text("Let\'s Go!")');

    // 3. Start Level 1
    await page.click('button:has-text("Start Playing!")');
    await page.waitForSelector('text=First steps');

    // Dismiss tutorial modal
    const tryItBtn = await page.waitForSelector('button:has-text("Try It!")');
    await tryItBtn.click();
    await page.waitForTimeout(500);

    await page.screenshot({ path: 'qa/screenshots/03-level-1-editing.png' });
    console.log('Captured 03-level-1-editing.png');

    // 4. Assemble program: Forward, Forward
    const forwardBtn = page.getByRole('button', { name: 'Add forward command' });
    await forwardBtn.click();
    await forwardBtn.click();
    await page.waitForTimeout(300);

    await page.screenshot({ path: 'qa/screenshots/04-program-assembled.png' });
    console.log('Captured 04-program-assembled.png');

    // 5. Run Program & Observe Execution
    await page.click('button:has-text("Run Program")');
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'qa/screenshots/05-gameplay-running.png' });
    console.log('Captured 05-gameplay-running.png');

    // Wait for success modal
    await page.waitForSelector('text=Awesome!', { timeout: 10000 });
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'qa/screenshots/06-success-dialog.png' });
    console.log('Captured 06-success-dialog.png');

    // 6. Navigate back to World Map
    await page.click('button:has-text("Back to Map")');
    await page.waitForSelector('text=World 1 · Sunny Meadow');
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'qa/screenshots/07-world-map.png' });
    console.log('Captured 07-world-map.png');

    // 7. Click Level 2 (Round the corner)
    await page.click('button:has-text("Round the corner")');
    await page.waitForSelector('text=Round the corner');

    // Dismiss Level 2 Tutorial (right-turn)
    const tryItBtn2 = await page.waitForSelector('button:has-text("Try It!")');
    await tryItBtn2.click();
    await page.waitForTimeout(300);

    // Open Accessible Board Explorer
    const explorerBtn = page.getByRole('button', { name: 'Open Board Explorer' });
    await explorerBtn.click();
    await page.waitForSelector('text=Accessible Board Explorer');
    await page.screenshot({ path: 'qa/screenshots/08-board-explorer.png' });
    console.log('Captured 08-board-explorer.png');

    console.log('ALL BROWSER JOURNEY CHECKS PASSED!');
  } finally {
    await browser.close();
    server.kill();
  }
}

run().catch((err) => {
  console.error('Browser journey error:', err);
  process.exit(1);
});
