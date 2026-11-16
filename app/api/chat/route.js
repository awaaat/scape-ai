import { KBS } from '@/lib/kb';
import { limited, foreignOrigin, API_BASE, MODEL, json } from '@/lib/guard';
export const runtime = 'nodejs'; export const dynamic = 'force-dynamic';

const RULES = `Rules:
1. Use the KNOWLEDGE BASE for every company-specific fact and cite it inline as [n] using the numbers shown. State policies accurately.
2. Answer EVERY message helpfully and completely. For general questions beyond the knowledge base, answer from general knowledge and make clear it is general guidance rather than company policy. Never reply with "I don't know", "I can't help", "I'm unable" or a bare refusal for an ordinary request.
3. Never invent company-specific facts (prices, dates, policy terms, order status, names). If a specific detail is not in the knowledge base, say what IS confirmed, give the most useful concrete next step (what to check, what to send, who handles it), and offer to hand the conversation to a person with a one-line summary.
4. Use details the user gives you (order numbers, dates, context). Never ask for passwords or full card numbers.
5. Keep replies under about 110 words unless the user asks for detail. Short paragraphs or bullets. Use **bold** sparingly. No headings.
6. Decline only clearly harmful or privacy-violating requests: briefly, kindly, with a safe alternative.
7. End every reply with exactly one final line, in this form: ::follow-ups:: first question | second question | third question   (three short, natural questions the user might ask next, written as the user would say them).
8. If the user wants to start a project, get a quote, or speak to a person at Scape AI, add one extra final line: ::action:: start`;

export async function POST(req) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return json({ error: 'no_key' }, 501);
  if (foreignOrigin(req)) return json({ error: 'forbidden' }, 403);
  if (limited(req, 'chat')) return json({ error: 'rate' }, 429);
  let b; try { b = await req.json(); } catch { return json({ error: 'bad' }, 400); }
  const kb = KBS[b.kb]; if (!kb) return json({ error: 'kb' }, 400);
  const extra = (Array.isArray(b.docs) ? b.docs : []).slice(0, 6).map(d => [String(d[0] || 'Document').slice(0, 80), String(d[1] || '').slice(0, 4000)]);
  const docs = [...kb.docs, ...extra];
  const raw = (Array.isArray(b.messages) ? b.messages : []).slice(-10).map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: String(m.content || '').slice(0, 1500) })).filter(m => m.content.trim());
  const msgs = []; for (const m of raw) { const l = msgs[msgs.length - 1]; if (l && l.role === m.role) l.content += '\n' + m.content; else msgs.push({ ...m }); }
  while (msgs.length && msgs[0].role !== 'user') msgs.shift();
  if (!msgs.length || msgs[msgs.length - 1].role !== 'user') return json({ error: 'bad' }, 400);
  const system = `You are the ${kb.role} for ${kb.name}. Today is ${new Date().toISOString().slice(0, 10)}.\nVoice: warm, confident, precise, professional.\n${kb.persona}\n\n${RULES}\n\nKNOWLEDGE BASE (cite as [n]):\n${docs.map((d, i) => `[${i + 1}] ${d[0]}: ${d[1]}`).join('\n')}`;
  let up;
  try {
    up = await fetch(`${API_BASE()}/v1/messages`, { method: 'POST', headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' }, body: JSON.stringify({ model: MODEL(), max_tokens: 700, temperature: 0.4, stream: true, system, messages: msgs }) });
  } catch { return json({ error: 'upstream' }, 502); }
  if (!up.ok || !up.body) return json({ error: 'upstream', status: up.status }, 502);
  const enc = new TextEncoder(), dec = new TextDecoder();
  const stream = new ReadableStream({
    async start(ctl) {
      const rd = up.body.getReader(); let buf = '';
      try {
        for (;;) {
          const { done, value } = await rd.read(); if (done) break;
          buf += dec.decode(value, { stream: true }); let i;
          while ((i = buf.indexOf('\n')) >= 0) {
            const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
            if (!line.startsWith('data:')) continue;
            try { const ev = JSON.parse(line.slice(5)); if (ev.type === 'content_block_delta' && ev.delta?.type === 'text_delta') ctl.enqueue(enc.encode(ev.delta.text)); } catch { /* partial frame */ }
          }
        }
      } catch { /* client went away */ }
      ctl.close();
    },
  });
  return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', 'X-Accel-Buffering': 'no' } });
}
