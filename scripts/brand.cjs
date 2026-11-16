// Scape AI brand pass: your logo in the header/footer, favicons and share image built from it.
const fs = require('fs'), path = require('path'), sharp = require('sharp');
const w = (p, s) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); };
const edit = (p, fn) => { if (!fs.existsSync(p)) return; const a = fs.readFileSync(p, 'utf8'), b = fn(a); if (a !== b) { fs.writeFileSync(p, b); console.log('patched', p); } };

(async () => {
  const src = 'public/logo.webp', input = process.argv[2];
  if (input) {   // cut the logo out of your artwork: dark background becomes transparent, glow is kept
    const { data, info } = await sharp(input).removeAlpha().extract({ left: 250, top: 240, width: 910, height: 265 }).raw().toBuffer({ resolveWithObject: true });
    const n = info.width * info.height, px = Buffer.alloc(n * 4); let x0 = 1e9, y0 = 1e9, x1 = 0, y1 = 0;
    for (let i = 0; i < n; i++) {
      const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2], v = Math.max(r, g, b, 1);
      const a = Math.max(0, Math.min(1, (v - 100) / 85)), k = 255 / v;
      px[i * 4] = Math.min(255, r * k); px[i * 4 + 1] = Math.min(255, g * k); px[i * 4 + 2] = Math.min(255, b * k); px[i * 4 + 3] = Math.round(a * 255);
      if (a > 0.08) { const x = i % info.width, y = (i / info.width) | 0; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    }
    x0 = Math.max(0, x0 - 14); y0 = Math.max(0, y0 - 14); x1 = Math.min(info.width - 1, x1 + 14); y1 = Math.min(info.height - 1, y1 + 14);
    await sharp(px, { raw: { width: info.width, height: info.height, channels: 4 } }).extract({ left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 })
      .resize({ width: 480 }).webp({ quality: 75, alphaQuality: 90 }).toFile(src);
    console.log('logo cut from', input);
  }
  if (!fs.existsSync(src)) throw new Error('public/logo.webp missing. Pass the logo image path: node scripts/brand.cjs /path/to/logo.jpeg');
  await sharp(src).png().toFile('public/logo.png');
  const S = await sharp(src).extract({ left: 6, top: 50, width: 62, height: 62 }).toBuffer();   // the S of SCAPE
  const tile = async (size, { round = true, pad = 0.2 } = {}) => {
    const r = round ? Math.round(size * 0.22) : 0, inner = Math.round(size * (1 - 2 * pad)), sw = Math.max(1, Math.round(size * 0.03));
    const s = await sharp(S).resize({ width: inner, height: inner, fit: 'inside' }).toBuffer();
    const bg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0B1B45"/><stop offset="1" stop-color="#05070d"/></linearGradient></defs><rect x="${sw / 2}" y="${sw / 2}" width="${size - sw}" height="${size - sw}" rx="${r}" fill="url(#g)" stroke="#2F6BFF" stroke-opacity=".55" stroke-width="${sw}"/></svg>`);
    return sharp(bg).composite([{ input: s, gravity: 'centre' }]).png().toBuffer();
  };
  const out = { 'favicon-16.png': [16, { pad: 0.14 }], 'favicon-32.png': [32, { pad: 0.16 }], 'icon-192.png': [192], 'icon-512.png': [512], 'apple-touch-icon.png': [180, { round: false }], 'icon-512-maskable.png': [512, { round: false, pad: 0.28 }] };
  for (const [f, [n, o]] of Object.entries(out)) w('public/' + f, await tile(n, o));
  const fr = []; for (const n of [16, 32, 48]) fr.push([n, await tile(n, { pad: n < 32 ? 0.14 : 0.16 })]);
  let hd = Buffer.alloc(6); hd.writeUInt16LE(1, 2); hd.writeUInt16LE(fr.length, 4);
  let off = 6 + 16 * fr.length, dir = Buffer.alloc(0);
  for (const [n, png] of fr) { const d = Buffer.alloc(16); d[0] = n; d[1] = n; d.writeUInt16LE(1, 4); d.writeUInt16LE(32, 6); d.writeUInt32LE(png.length, 8); d.writeUInt32LE(off, 12); off += png.length; dir = Buffer.concat([dir, d]); }
  w('public/favicon.ico', Buffer.concat([hd, dir, ...fr.map(f => f[1])]));
  for (const f of ['favicon.svg', 'logo.svg', 'og-default.png']) fs.rmSync('public/' + f, { force: true });   // old gradient-S mark and the grid share image

  w('components/Logo.js', `// The Scape AI logo (public/logo.webp). Height is in px; width follows the artwork's ratio.
export default function Logo({ size = 40 }) {
  return (<img className="lg-img" src="/logo.webp" alt="Scape AI" height={size} width={Math.round(size * 480 / 141)} decoding="async" />);
}
`);

  w('app/opengraph-image.js', `import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
export const alt = 'Scape AI: AI systems for businesses, enterprises and individuals';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default async function Image() {
  const logo = 'data:image/png;base64,' + (await readFile(join(process.cwd(), 'public', 'logo.png'))).toString('base64');
  return new ImageResponse(
    (<div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 84, background: 'linear-gradient(135deg,#05070d 0%,#0B1B45 100%)', color: '#fff' }}>
      <img src={logo} width={480} height={141} />
      <div style={{ display: 'flex', marginTop: 36, fontSize: 74, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, maxWidth: 980 }}>AI systems that actually run in production.</div>
      <div style={{ display: 'flex', marginTop: 28, fontSize: 30, color: '#9DBBFF' }}>Strategy · Agents · Evaluation · Data · Managed AI</div>
    </div>), size);
}
`);
  fs.copyFileSync('app/opengraph-image.js', 'app/twitter-image.js');

  edit('components/Chrome.js', s => s.replace('<Logo size={34} />', '<Logo size={46} />').replace('<Logo />', '<Logo size={38} />'));
  const ICONS = "  icons: { icon: [{ url: '/favicon.ico?v=4', sizes: 'any' }, { url: '/favicon-32.png?v=4', type: 'image/png', sizes: '32x32' }, { url: '/favicon-16.png?v=4', type: 'image/png', sizes: '16x16' }, { url: '/icon-192.png?v=4', type: 'image/png', sizes: '192x192' }], apple: [{ url: '/apple-touch-icon.png?v=4', sizes: '180x180' }] },";
  edit('app/layout.js', s => s.replace(/^  icons: .*$/m, () => ICONS));
  edit('app/globals.css', s => s.includes('v13: logo') ? s : s + `
/* v13: logo image */
.hb .logo{display:flex;align-items:center}
.lg-img{display:block;height:auto;max-width:100%}
.fg .logo{display:block;margin-bottom:4px}
`);
  console.log('brand ok: public/logo.webp, logo.png, favicon.ico, favicon-16/32, icon-192/512, apple-touch-icon');
})().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
