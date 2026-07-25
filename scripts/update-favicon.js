import fs from 'fs';
import path from 'path';

const logoPath = path.join(process.cwd(), 'public', 'logo.jpg');
const faviconPath = path.join(process.cwd(), 'public', 'favicon.svg');

if (fs.existsSync(logoPath)) {
  const logoBuffer = fs.readFileSync(logoPath);
  const base64Logo = logoBuffer.toString('base64');
  
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <clipPath id="circleClip">
      <circle cx="256" cy="256" r="256" />
    </clipPath>
  </defs>
  <rect width="512" height="512" fill="#0B0B0B" rx="256" />
  <image href="data:image/jpeg;base64,${base64Logo}" width="512" height="512" clip-path="url(#circleClip)" />
</svg>`;

  fs.writeFileSync(faviconPath, svgContent, 'utf-8');
  console.log('[Favicon Generator] Successfully generated public/favicon.svg from logo.jpg!');
} else {
  console.error('logo.jpg not found in public directory');
}
