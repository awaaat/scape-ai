import { ImageResponse } from 'next/og';
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
