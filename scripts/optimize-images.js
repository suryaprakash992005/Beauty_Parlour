import { Jimp } from 'jimp';
import fs from 'fs';
import path from 'path';

async function optimize() {
  const publicDir = path.join(process.cwd(), 'public');
  const heroFiles = [
    'salon_green_theme_1.jpg',
    'salon_green_theme_2.jpg',
    'salon_green_theme_3.jpg',
    'salon_green_theme.jpg',
    'logo.jpg',
    'og-image.jpg'
  ];

  for (const file of heroFiles) {
    const inputPath = path.join(publicDir, file);
    if (!fs.existsSync(inputPath)) continue;

    try {
      const img = await Jimp.read(inputPath);
      const originalSize = fs.statSync(inputPath).size;

      // 1. Optimize Desktop Version (JPEG Quality 78)
      const desktopBuf = await img.getBuffer('image/jpeg', { quality: 78 });
      fs.writeFileSync(inputPath, desktopBuf);
      const desktopSize = fs.statSync(inputPath).size;
      console.log(`[Desktop] ${file}: ${(originalSize / 1024).toFixed(1)}KB -> ${(desktopSize / 1024).toFixed(1)}KB`);

      // 2. Generate Mobile Version (Width 640px, Quality 75)
      const ext = path.extname(file);
      const baseName = path.basename(file, ext);
      if (baseName.startsWith('salon_green_theme')) {
        const mobileImg = img.clone();
        mobileImg.resize({ w: 640 });
        const mobileBuf = await mobileImg.getBuffer('image/jpeg', { quality: 75 });
        const mobilePath = path.join(publicDir, `${baseName}_mobile${ext}`);
        fs.writeFileSync(mobilePath, mobileBuf);
        const mobileSize = fs.statSync(mobilePath).size;
        console.log(`[Mobile]  ${baseName}_mobile${ext}: ${(mobileSize / 1024).toFixed(1)}KB`);
      }
    } catch (err) {
      console.error(`Error processing ${file}:`, err);
    }
  }

  // Also compress src/assets/bridal_before.png and bridal_after.png
  const assetsDir = path.join(process.cwd(), 'src', 'assets');
  const bridalFiles = ['bridal_before.png', 'bridal_after.png'];
  for (const file of bridalFiles) {
    const inputPath = path.join(assetsDir, file);
    if (!fs.existsSync(inputPath)) continue;
    try {
      const img = await Jimp.read(inputPath);
      const originalSize = fs.statSync(inputPath).size;
      // Convert heavy 1MB PNGs to quality-optimized JPEGs/PNGs
      const buf = await img.getBuffer('image/png');
      fs.writeFileSync(inputPath, buf);
      const newSize = fs.statSync(inputPath).size;
      console.log(`[Asset] ${file}: ${(originalSize / 1024).toFixed(1)}KB -> ${(newSize / 1024).toFixed(1)}KB`);
    } catch (e) {
      console.error(`Error processing asset ${file}:`, e);
    }
  }
}

optimize();
