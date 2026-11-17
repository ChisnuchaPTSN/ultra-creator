const { chromium } = require('C:/Users/002-020/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path = require('path');
const fs = require('fs');

async function testAll() {
  const outDir = path.join(__dirname, 'work', 'verification');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--autoplay-policy=no-user-gesture-required'],
  });

  // 1. Desktop Tests (1440x900)
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  const client = await page.context().newCDPSession(page);

  const url = 'http://127.0.0.1:5173/';
  console.log('Navigating to', url);
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2500);

  // 1. Item 1 & 2: Top of Hero (New 4-link navbar + compact horizontal logo showcase replacing scroll down prompt)
  let res = await client.send('Page.captureScreenshot');
  fs.writeFileSync(path.join(outDir, '01-hero-compact-logos-and-navbar.png'), Buffer.from(res.data, 'base64'));
  console.log('Saved 01-hero-compact-logos-and-navbar.png');

  // 2. Item 7: Flythrough Section 1 (Headline: "คิด · ถ่าย · ตัดต่อ")
  await page.evaluate(() => {
    window.scrollTo({ top: window.innerHeight * 1.5, behavior: 'instant' });
  });
  await page.waitForTimeout(1000);
  res = await client.send('Page.captureScreenshot');
  fs.writeFileSync(path.join(outDir, '02-headline-think-shoot-edit.png'), Buffer.from(res.data, 'base64'));
  console.log('Saved 02-headline-think-shoot-edit.png');

  // 3. Item 8: Flythrough Section 3 (Animated Statistics: Over 200 Million Views & 2,000+ Videos)
  await page.evaluate(() => {
    window.scrollTo({ top: window.innerHeight * 4.8, behavior: 'instant' });
  });
  await page.waitForTimeout(2200); // wait for count up animation
  res = await client.send('Page.captureScreenshot');
  fs.writeFileSync(path.join(outDir, '03-animated-statistics.png'), Buffer.from(res.data, 'base64'));
  console.log('Saved 03-animated-statistics.png');

  // 4. Item 5: Section 01 (Growth & Portfolio Showcase - Two Column: Left static logos, Right 3 achievements)
  await page.evaluate(() => {
    const el = document.querySelector('#story');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(800);
  res = await client.send('Page.captureScreenshot');
  fs.writeFileSync(path.join(outDir, '04-section-01-portfolio-showcase.png'), Buffer.from(res.data, 'base64'));
  console.log('Saved 04-section-01-portfolio-showcase.png');

  // 5. Section 02 Desktop
  await page.evaluate(() => {
    const el = document.querySelector('#creators');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(800);
  res = await client.send('Page.captureScreenshot');
  fs.writeFileSync(path.join(outDir, '05-section-02-creators.png'), Buffer.from(res.data, 'base64'));
  console.log('Saved 05-section-02-creators.png');

  // 6. Item 3: Section 04 (Testimonials - Vertical layout, one-at-a-time carousel)
  await page.evaluate(() => {
    const el = document.querySelector('#work');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(800);
  res = await client.send('Page.captureScreenshot');
  fs.writeFileSync(path.join(outDir, '06-section-04-testimonials.png'), Buffer.from(res.data, 'base64'));
  console.log('Saved 06-section-04-testimonials.png');

  // 7. Click next button in testimonials to test interaction
  await page.click('#work .creator-controls button:last-child');
  await page.waitForTimeout(800);
  res = await client.send('Page.captureScreenshot');
  fs.writeFileSync(path.join(outDir, '07-section-04-testimonial-next.png'), Buffer.from(res.data, 'base64'));
  console.log('Saved 07-section-04-testimonial-next.png');

  // 8. Item 4 & 6: Section 05 & Footer (Workflow removed, TikTok/Instagram/Facebook on right side)
  await page.evaluate(() => {
    const el = document.querySelector('#collective');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(800);
  res = await client.send('Page.captureScreenshot');
  fs.writeFileSync(path.join(outDir, '08-section-05-and-footer.png'), Buffer.from(res.data, 'base64'));
  console.log('Saved 08-section-05-and-footer.png');

  await page.close();
  await context.close();

  // 9. Mobile Touch-Swipe Test (Item 9) - iPhone 14 Viewport with touch support
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const mobilePage = await mobileContext.newPage();
  const mobileClient = await mobilePage.context().newCDPSession(mobilePage);

  await mobilePage.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await mobilePage.waitForTimeout(2000);

  // Scroll to Section 02 on mobile
  await mobilePage.evaluate(() => {
    const el = document.querySelector('#creators');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await mobilePage.waitForTimeout(800);

  res = await mobileClient.send('Page.captureScreenshot');
  fs.writeFileSync(path.join(outDir, '09-mobile-creators-card-0.png'), Buffer.from(res.data, 'base64'));
  console.log('Saved 09-mobile-creators-card-0.png');

  // Simulate Touch Swipe Left (Drag from x:300 to x:60)
  const railBox = await mobilePage.locator('.creator-rail').boundingBox();
  const startX = railBox.x + railBox.width * 0.8;
  const startY = railBox.y + railBox.height * 0.5;
  const endX = railBox.x + railBox.width * 0.2;

  // Dispatch real touch events
  await mobilePage.touchscreen.tap(startX, startY);
  await mobilePage.evaluate(async ({ startX, startY, endX }) => {
    const target = document.querySelector('.creator-rail');
    const touchStart = new Touch({
      identifier: 1,
      target,
      clientX: startX,
      clientY: startY,
      pageX: startX,
      pageY: startY,
    });
    target.dispatchEvent(new TouchEvent('touchstart', { touches: [touchStart], changedTouches: [touchStart], bubbles: true, cancelable: true }));

    // Move
    for (let i = 1; i <= 10; i++) {
      const curX = startX + (endX - startX) * (i / 10);
      const touchMove = new Touch({
        identifier: 1,
        target,
        clientX: curX,
        clientY: startY,
        pageX: curX,
        pageY: startY,
      });
      target.dispatchEvent(new TouchEvent('touchmove', { touches: [touchMove], changedTouches: [touchMove], bubbles: true, cancelable: true }));
      await new Promise(r => setTimeout(r, 20));
    }

    const touchEnd = new Touch({
      identifier: 1,
      target,
      clientX: endX,
      clientY: startY,
      pageX: endX,
      pageY: startY,
    });
    target.dispatchEvent(new TouchEvent('touchend', { touches: [], changedTouches: [touchEnd], bubbles: true, cancelable: true }));
  }, { startX, startY, endX });

  await mobilePage.waitForTimeout(1000);

  res = await mobileClient.send('Page.captureScreenshot');
  fs.writeFileSync(path.join(outDir, '10-mobile-creators-after-swipe.png'), Buffer.from(res.data, 'base64'));
  console.log('Saved 10-mobile-creators-after-swipe.png');

  // Open mobile menu to verify 4 links
  await mobilePage.click('button[aria-label="เปิดเมนู"]');
  await mobilePage.waitForTimeout(600);
  res = await mobileClient.send('Page.captureScreenshot');
  fs.writeFileSync(path.join(outDir, '11-mobile-menu-links.png'), Buffer.from(res.data, 'base64'));
  console.log('Saved 11-mobile-menu-links.png');

  await browser.close();
  console.log('All verification captures completed successfully!');
}

testAll().catch(err => {
  console.error(err);
  process.exit(1);
});
