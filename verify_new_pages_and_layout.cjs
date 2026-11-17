const { chromium } = require('C:/Users/002-020/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path = require('path');
const fs = require('fs');

async function testAll() {
  const outDir = path.join(__dirname, 'work', 'verification_v2');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

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

  const url = 'http://127.0.0.1:5173/';
  console.log('Navigating to', url);
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);

  // 1. Home Page Hero Top
  let res = await client.send('Page.captureScreenshot');
  fs.writeFileSync(path.join(outDir, '01-home-hero.png'), Buffer.from(res.data, 'base64'));
  console.log('Saved 01-home-hero.png');

  // 2. Flythrough Section 2: 3 Square Cards (TikTok, Instagram, Facebook)
  await page.evaluate(() => {
    window.scrollTo({ top: window.innerHeight * 2.8, behavior: 'instant' });
  });
  await page.waitForTimeout(2000);
  res = await client.send('Page.captureScreenshot');
  fs.writeFileSync(path.join(outDir, '02-section-2-three-square-cards.png'), Buffer.from(res.data, 'base64'));
  console.log('Saved 02-section-2-three-square-cards.png');

  // 3. Flythrough Section 3: Open Statistics (No Boxes, with Icons)
  await page.evaluate(() => {
    window.scrollTo({ top: window.innerHeight * 4.8, behavior: 'instant' });
  });
  await page.waitForTimeout(2000);
  res = await client.send('Page.captureScreenshot');
  fs.writeFileSync(path.join(outDir, '03-section-3-open-stats.png'), Buffer.from(res.data, 'base64'));
  console.log('Saved 03-section-3-open-stats.png');

  // 4. Section 01: Portfolio & Achievements (Balanced left-right, floating brand pills without box, open stats with eye icon)
  await page.evaluate(() => {
    const el = document.querySelector('#story');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(1000);
  res = await client.send('Page.captureScreenshot');
  fs.writeFileSync(path.join(outDir, '04-section-01-portfolio-balanced.png'), Buffer.from(res.data, 'base64'));
  console.log('Saved 04-section-01-portfolio-balanced.png');

  // 5. Test Navigation to Separate Page: "บริการ" (Services Page)
  await page.click('nav button:has-text("บริการ")');
  await page.waitForTimeout(1000);
  res = await client.send('Page.captureScreenshot');
  fs.writeFileSync(path.join(outDir, '05-services-page.png'), Buffer.from(res.data, 'base64'));
  console.log('Saved 05-services-page.png');

  // 6. Test Navigation to Separate Page: "บทความ" (Articles Page)
  await page.click('nav button:has-text("บทความ")');
  await page.waitForTimeout(1000);
  res = await client.send('Page.captureScreenshot');
  fs.writeFileSync(path.join(outDir, '06-articles-page.png'), Buffer.from(res.data, 'base64'));
  console.log('Saved 06-articles-page.png');

  // 7. Click to open an article modal
  await page.click('.article-card-item:first-child');
  await page.waitForTimeout(800);
  res = await client.send('Page.captureScreenshot');
  fs.writeFileSync(path.join(outDir, '07-article-reader-modal.png'), Buffer.from(res.data, 'base64'));
  console.log('Saved 07-article-reader-modal.png');

  // Close modal
  await page.click('.article-modal-window button');
  await page.waitForTimeout(400);

  // 8. Test Navigation to Separate Page: "ติดต่อเรา" (Contact Page)
  await page.click('nav button:has-text("ติดต่อเรา")');
  await page.waitForTimeout(1000);
  res = await client.send('Page.captureScreenshot');
  fs.writeFileSync(path.join(outDir, '08-contact-page.png'), Buffer.from(res.data, 'base64'));
  console.log('Saved 08-contact-page.png');

  // 9. Check footer on Contact page to confirm "กลับขึ้นด้านบน" is removed
  await page.evaluate(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
  });
  await page.waitForTimeout(600);
  res = await client.send('Page.captureScreenshot');
  fs.writeFileSync(path.join(outDir, '09-contact-page-footer.png'), Buffer.from(res.data, 'base64'));
  console.log('Saved 09-contact-page-footer.png');

  // 10. Test Mobile Navigation (390x844)
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const mobilePage = await mobileContext.newPage();
  const mobileClient = await mobilePage.context().newCDPSession(mobilePage);

  await mobilePage.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await mobilePage.waitForTimeout(1500);

  // Open mobile menu
  await mobilePage.click('button[aria-label="เปิดเมนู"]');
  await mobilePage.waitForTimeout(600);
  res = await mobileClient.send('Page.captureScreenshot');
  fs.writeFileSync(path.join(outDir, '10-mobile-menu-routes.png'), Buffer.from(res.data, 'base64'));
  console.log('Saved 10-mobile-menu-routes.png');

  // Click "บริการ" in mobile menu
  await mobilePage.click('.fixed button:has-text("บริการ")');
  await mobilePage.waitForTimeout(1000);
  res = await mobileClient.send('Page.captureScreenshot');
  fs.writeFileSync(path.join(outDir, '11-mobile-services-page.png'), Buffer.from(res.data, 'base64'));
  console.log('Saved 11-mobile-services-page.png');

  await page.close();
  await mobilePage.close();
  await context.close();
  await mobileContext.close();
  await browser.close();

  console.log('All verification captures completed successfully!');
}

testAll().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
