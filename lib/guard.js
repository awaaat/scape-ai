// Shared abuse protection for the public demo endpoints that spend real API money.
const hits = globalThis.__demoHits || (globalThis.__demoHits = new Map());
export function limited(req, name = 'chat', perMin = 12, perHour = 120) {
  const ip = name + ':' + (req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'local').split(',')[0].trim();
  const now = Date.now(); const a = (hits.get(ip) || []).filter(t => now - t < 3600e3); a.push(now); hits.set(ip, a);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some(t => now - t < 3600e3)) hits.delete(k);
  return a.filter(t => now - t < 60e3).length > perMin || a.length > perHour;
}
export function foreignOrigin(req) { const o = req.headers.get('origin'), h = req.headers.get('host'); try { return !!(o && h && new URL(o).host !== h); } catch { return true; } }
export const API_BASE = () => (process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com').replace(/\/$/, '');
export const MODEL = () => process.env.ANTHROPIC_MODEL || 'claude-sonnet-5-5';
export const json = (o, status = 200) => Response.json(o, { status });
