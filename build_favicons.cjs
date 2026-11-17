const { chromium } = require('C:/Users/002-020/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path = require('path');
const fs = require('fs');

async function generateFavicons() {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
  });
  const page = await browser.newPage();

  const logoBuf = fs.readFileSync('public/brand/uc-logo-white.png');
  const logoB64 = logoBuf.toString('base64');

  await page.setContent(`
    <img id="logo" src="data:image/png;base64,${logoB64}" />
    <canvas id="cvs"></canvas>
  `);

  const generateSize = async (size, paddingRatio = 0.12) => {
    return await page.evaluate(({ size, paddingRatio }) => {
      const cvs = document.getElementById('cvs');
      cvs.width = size;
      cvs.height = size;
      const ctx = cvs.getContext('2d');
      ctx.clearRect(0, 0, size, size);

      // Draw rounded rectangle badge
      const radius = size * 0.22;
      ctx.beginPath();
      ctx.roundRect(0, 0, size, size, radius);
      ctx.clip();

      // Deep plum radial background gradient
      const grad = ctx.createRadialGradient(size * 0.5, size * 0.45, size * 0.05, size * 0.5, size * 0.5, size * 0.7);
      grad.addColorStop(0, '#3d1c3d');
      grad.addColorStop(0.55, '#220b25');
      grad.addColorStop(1, '#0c030e');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);

      // Draw the white UC logo
      const img = document.getElementById('logo');
      const pad = size * paddingRatio;
      const targetW = size - pad * 2;
      const aspect = img.naturalWidth / img.naturalHeight;
      let drawW, drawH;
      if (aspect > 1) {
        drawW = targetW;
        drawH = targetW / aspect;
      } else {
        drawH = targetW;
        drawW = targetW * aspect;
      }
      const x = (size - drawW) / 2;
      const y = (size - drawH) / 2;
      ctx.drawImage(img, x, y, drawW, drawH);

      return cvs.toDataURL('image/png').split(',')[1];
    }, { size, paddingRatio });
  };

  const png32 = await generateSize(32, 0.10);
  const png16 = await generateSize(16, 0.08);
  const png48 = await generateSize(48, 0.10);
  const png64 = await generateSize(64, 0.12);
  const png180 = await generateSize(180, 0.14);
  const png512 = await generateSize(512, 0.14);

  // Write PNG files
  fs.writeFileSync('public/favicon.png', Buffer.from(png32, 'base64'));
  fs.writeFileSync('public/favicon-32x32.png', Buffer.from(png32, 'base64'));
  fs.writeFileSync('public/favicon-16x16.png', Buffer.from(png16, 'base64'));
  fs.writeFileSync('public/apple-touch-icon.png', Buffer.from(png180, 'base64'));
  fs.writeFileSync('public/brand/uc-icon.png', Buffer.from(png512, 'base64'));

  // Also write an ICO file. A standard Windows ICO header wrapping 32x32 PNG payload:
  // Header: 2 bytes reserved (0), 2 bytes type (1 for ico), 2 bytes image count (1)
  // Entry: 1 byte width (32), 1 byte height (32), 1 byte colors (0), 1 byte reserved (0),
  //        2 bytes planes (1), 2 bytes bpp (32), 4 bytes size, 4 bytes offset (22)
  const png32Buf = Buffer.from(png32, 'base64');
  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0);
  icoHeader.writeUInt16LE(1, 2);
  icoHeader.writeUInt16LE(1, 4);

  const icoEntry = Buffer.alloc(16);
  icoEntry.writeUInt8(32, 0); // width
  icoEntry.writeUInt8(32, 1); // height
  icoEntry.writeUInt8(0, 2);  // color count
  icoEntry.writeUInt8(0, 3);  // reserved
  icoEntry.writeUInt16LE(1, 4); // color planes
  icoEntry.writeUInt16LE(32, 6); // bpp
  icoEntry.writeUInt32LE(png32Buf.length, 8); // image size
  icoEntry.writeUInt32LE(22, 12); // offset (6 + 16 = 22)

  const icoBuf = Buffer.concat([icoHeader, icoEntry, png32Buf]);
  fs.writeFileSync('public/favicon.ico', icoBuf);

  // Create crisp SVG favicon
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <defs>
    <radialGradient id="g" cx="50%" cy="45%" r="70%">
      <stop offset="0%" stop-color="#3d1c3d"/>
      <stop offset="60%" stop-color="#220b25"/>
      <stop offset="100%" stop-color="#0c030e"/>
    </radialGradient>
  </defs>
  <rect width="128" height="128" rx="28" fill="url(#g)"/>
  <image href="data:image/png;base64,${png180}" x="8" y="8" width="112" height="112" preserveAspectRatio="xMidYMid meet"/>
</svg>`;
  fs.writeFileSync('public/favicon.svg', svgContent);

  // Copy all to outputs/understory/public
  const files = ['favicon.png', 'favicon-32x32.png', 'favicon-16x16.png', 'favicon.ico', 'favicon.svg', 'apple-touch-icon.png'];
  files.forEach(f => {
    fs.copyFileSync(path.join('public', f), path.join('outputs', 'understory', 'public', f));
  });
  fs.copyFileSync('public/brand/uc-icon.png', 'outputs/understory/public/brand/uc-icon.png');

  console.log('Successfully generated all favicons and ico files!');
  await browser.close();
}

generateFavicons().catch(console.error);
