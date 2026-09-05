import { chromium } from 'playwright';

const BASE = 'http://localhost:8081';

const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome',
  args: ['--no-sandbox', '--disable-gpu', '--enable-unsafe-swiftshader'],
});

async function journey(viewport, tag) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForSelector('text=Robo Paths');
  await page.screenshot({ path: `qa/screenshots/polish-${tag}-welcome.png` });

  await page.click('text=Choose Another Robot');
  await page.waitForSelector('text=Choose Your Robot');
  await page.screenshot({ path: `qa/screenshots/polish-${tag}-picker.png` });
  await page.click("button:has-text(\"Let's Go!\")");

  await page.click('button:has-text("Start Playing!")');
  await page.waitForSelector('text=First steps');
  const t = await page.waitForSelector('button:has-text("Try It!")', { timeout: 8000 });
  await t.click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: `qa/screenshots/polish-${tag}-game.png` });

  await context.close();
}

await journey({ width: 390, height: 844 }, 'mobile');
await journey({ width: 1280, height: 800 }, 'desktop');
await browser.close();
console.log('polish screenshots captured');
