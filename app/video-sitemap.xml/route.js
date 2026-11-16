import { BASE } from '@/lib/data';
import { media } from '@/lib/media';

export const dynamic = 'force-static';
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const TITLES = { city: 'Global operations', handshake: 'Partnership', globe: 'Worldwide delivery', hud: 'Live AI telemetry', ado1: 'AI systems in motion', hyper1: 'Data in flight', hyper2: 'Models learning', safin: 'Engineering in focus', suren: 'Build and iterate', work2: 'Team delivery' };

export function GET() {
  const items = Object.entries(media).map(([n, v]) => `<video:video><video:thumbnail_loc>${BASE}${v.poster}</video:thumbnail_loc><video:title>${esc(`Scape AI: ${TITLES[n] || 'AI in practice'}`)}</video:title><video:description>${esc('Scape AI builds, evaluates and operates AI systems for enterprises, businesses and individuals.')}</video:description><video:content_loc>${BASE}${v.src}</video:content_loc><video:family_friendly>yes</video:family_friendly></video:video>`).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"><url><loc>${BASE}/</loc>${items}</url></urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=86400' } });
}
