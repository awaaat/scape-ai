const clip = (v, n = 2000) => String(v ?? '').slice(0, n);
export async function POST(req) {
  let d; try { d = await req.json(); } catch { return Response.json({ ok: false }, { status: 400 }); }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email || '')) return Response.json({ ok: false, error: 'email' }, { status: 400 });
  const lead = { email: clip(d.email, 200), audience: clip(d.aud, 40), interests: (Array.isArray(d.opts) ? d.opts : []).map(o => clip(o, 80)).join(', '), name: clip(d.name, 120), company: clip(d.company, 160), timeline: clip(d.time, 60), message: clip(d.msg), source: clip(d.source, 200), submitted: new Date().toISOString() };
  const id = process.env.FORMSPREE_ID;
  if (id) { const r = await fetch(`https://formspree.io/f/${id}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(lead) }); if (!r.ok) return Response.json({ ok: false }, { status: 502 }); }
  else console.log('New lead:', lead);
  return Response.json({ ok: true });
}
