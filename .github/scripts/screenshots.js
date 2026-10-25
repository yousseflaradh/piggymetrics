// Takes full-page screenshots of the running tools for the internship report.
// Usage: node screenshots.js <output dir> <name>=<url>[@<wait seconds>] ...
// A name starting with "sonar" logs in to SonarQube first (SONAR_PASSWORD).
const { chromium } = require('playwright');

(async () => {
  const [outDir, ...shots] = process.argv.slice(2);
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  let sonarLoggedIn = false;

  for (const shot of shots) {
    const [name, rest] = shot.split(/=(.*)/s);
    const [url, wait] = rest.split('@');
    try {
      if (name.startsWith('sonar') && !sonarLoggedIn) {
        const base = new URL(url).origin;
        await page.goto(`${base}/sessions/new`, { waitUntil: 'networkidle' });
        await page.fill('input[name=login]', 'admin');
        await page.fill('input[name=password]', process.env.SONAR_PASSWORD);
        await page.click('button[type=submit]');
        await page.waitForLoadState('networkidle');
        sonarLoggedIn = true;
      }
      await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
      await page.waitForTimeout((Number(wait) || 3) * 1000);
      await page.screenshot({ path: `${outDir}/${name}.png`, fullPage: true });
      console.log(`ok ${name}`);
    } catch (e) {
      console.log(`failed ${name}: ${e.message}`);
    }
  }
  await browser.close();
})();
