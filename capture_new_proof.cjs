const { chromium } = require('C:/Users/002-020/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path = require('path');
const fs = require('fs');

async function capture() {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--autoplay-policy=no-user-gesture-required'],
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  const client = await page.context().newCDPSession(page);

  const outDir = path.join(__dirname, 'work');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const url = process.env.URL || 'http://127.0.0.1:5173/';
  console.log('Navigating to', url);
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2500);

  // 1. Top of Intro Hero
  let res = await client.send('Page.captureScreenshot');
  fs.writeFileSync(path.join(outDir, 'proof-01-top-hero.png'), Buffer.from(res.data, 'base64'));
  console.log('Captured proof-01-top-hero.png');

  // 2. Mid-scroll Intro (Transition midpoint: gentle push-in, text dissolved, ink pooling in-place with NO split line)
  await page.evaluate(() => {
    window.scrollTo({ top: window.innerHeight * 0.5, behavior: 'instant' });
  });
  await page.waitForTimeout(600);
  res = await client.send('Page.captureScreenshot');
  fs.writeFileSync(path.join(outDir, 'proof-02-transition-mid.png'), Buffer.from(res.data, 'base64'));
  console.log('Captured proof-02-transition-mid.png');

  // 3. Flythrough Section 1 (Prompt font, updated eyebrow)
  await page.evaluate(() => {
    window.scrollTo({ top: window.innerHeight * 1.5, behavior: 'instant' });
  });
  await page.waitForTimeout(800);
  res = await client.send('Page.captureScreenshot');
  fs.writeFileSync(path.join(outDir, 'proof-03-flythrough-prompt.png'), Buffer.from(res.data, 'base64'));
  console.log('Captured proof-03-flythrough-prompt.png');

  // 4. Test CTA button click ("ข้ามไปดูผลงานเลย") from top
  await page.evaluate(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await page.waitForTimeout(500);
  await page.click('.intro-cta');
  await page.waitForTimeout(1000);
  res = await client.send('Page.captureScreenshot');
  fs.writeFileSync(path.join(outDir, 'proof-04-after-cta-click.png'), Buffer.from(res.data, 'base64'));
  console.log('Captured proof-04-after-cta-click.png');

  // 5. Scroll to Story section (01 / เติบโตไปทีละขั้น, 01 - วิเคราะห์, mock image card)
  await page.evaluate(() => {
    const el = document.querySelector('#story');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(800);
  res = await client.send('Page.captureScreenshot');
  fs.writeFileSync(path.join(outDir, 'proof-05-story-steps.png'), Buffer.from(res.data, 'base64'));
  console.log('Captured proof-05-story-steps.png');

  // 6. Scroll in Story to activate next step
  await page.evaluate(() => {
    window.scrollBy({ top: window.innerHeight * 0.9, behavior: 'instant' });
  });
  await page.waitForTimeout(800);
  res = await client.send('Page.captureScreenshot');
  fs.writeFileSync(path.join(outDir, 'proof-06-story-step2.png'), Buffer.from(res.data, 'base64'));
  console.log('Captured proof-06-story-step2.png');

  // 7. Scroll to Creators section (02 / คนที่เราเล่าเรื่องไปด้วยกัน, enlarged portrait with bottom fade)
  await page.evaluate(() => {
    const el = document.querySelector('#creators');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(800);
  res = await client.send('Page.captureScreenshot');
  fs.writeFileSync(path.join(outDir, 'proof-07-creators-refined.png'), Buffer.from(res.data, 'base64'));
  console.log('Captured proof-07-creators-refined.png');

  // 8. Scroll to Client Logos (Full width, no pause on hover)
  await page.evaluate(() => {
    const el = document.querySelector('.client-logos');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(800);
  res = await client.send('Page.captureScreenshot');
  fs.writeFileSync(path.join(outDir, 'proof-08-client-logos.png'), Buffer.from(res.data, 'base64'));
  console.log('Captured proof-08-client-logos.png');

  // 9. Scroll to Shorts section (03 / คลิปสั้น เล่าได้มากกว่า)
  await page.evaluate(() => {
    const el = document.querySelector('#shorts');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(800);
  res = await client.send('Page.captureScreenshot');
  fs.writeFileSync(path.join(outDir, 'proof-09-shorts.png'), Buffer.from(res.data, 'base64'));
  console.log('Captured proof-09-shorts.png');

  // 10. Scroll to Work section (04 / ไอเดียที่เล่าเป็นภาพ)
  await page.evaluate(() => {
    const el = document.querySelector('#work');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(800);
  res = await client.send('Page.captureScreenshot');
  fs.writeFileSync(path.join(outDir, 'proof-10-work-reordered.png'), Buffer.from(res.data, 'base64'));
  console.log('Captured proof-10-work-reordered.png');

  await browser.close();
  console.log('Done all captures!');
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});
