import { limited, foreignOrigin, API_BASE, MODEL, json } from '@/lib/guard';
export const runtime = 'nodejs'; export const dynamic = 'force-dynamic';

// ---- Sample Northwind back office the agent can act on (fake data, real tool-use loop) ----
const CUSTOMERS = [{ id: 'C-1042', name: 'Maria Gomez', email: 'maria@example.com', plan: 'Pro', since: '2024-03-11' }, { id: 'C-2210', name: 'Liam Walker', email: 'liam@example.com', plan: 'Free', since: '2025-08-02' }, { id: 'C-3307', name: 'Priya Nair', email: 'priya@example.com', plan: 'Pro', since: '2023-12-20' }];
const ORDERS = [{ id: 'NW-88231', customer_id: 'C-1042', item: 'Trail Boot (size 9)', total: 129.0, status: 'delivered', delivered: '2026-11-02', note: 'Customer reports cracked sole' }, { id: 'NW-90112', customer_id: 'C-2210', item: 'Rain Shell', total: 89.0, status: 'in_transit', eta: '2026-11-18' }, { id: 'NW-90377', customer_id: 'C-3307', item: 'Hiking Socks x3', total: 36.0, status: 'processing' }];
const CHARGES = [{ id: 'CH-7781', customer_id: 'C-1042', amount: 49.0, date: '2026-11-03', desc: 'Pro plan' }, { id: 'CH-7782', customer_id: 'C-1042', amount: 49.0, date: '2026-11-03', desc: 'Pro plan' }, { id: 'CH-8120', customer_id: 'C-3307', amount: 49.0, date: '2026-11-01', desc: 'Pro plan' }];
const TOOLS = [
  { name: 'lookup_customer', description: 'Find a customer by id, email or name.', input_schema: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] } },
  { name: 'get_order', description: 'Get an order by id (for example NW-88231).', input_schema: { type: 'object', properties: { order_id: { type: 'string' } }, required: ['order_id'] } },
  { name: 'list_charges', description: 'List recent billing charges for a customer id.', input_schema: { type: 'object', properties: { customer_id: { type: 'string' } }, required: ['customer_id'] } },
  { name: 'issue_refund', description: 'Request a refund for a charge. All refunds require human approval.', input_schema: { type: 'object', properties: { charge_id: { type: 'string' }, amount: { type: 'number' }, reason: { type: 'string' } }, required: ['charge_id', 'amount', 'reason'] } },
  { name: 'create_ticket', description: 'Open a support ticket for a human team.', input_schema: { type: 'object', properties: { summary: { type: 'string' }, priority: { type: 'string', enum: ['low', 'normal', 'high'] } }, required: ['summary'] } },
];
function run(name, i) {
  const q = String(i.query || '').toLowerCase();
  if (name === 'lookup_customer') return CUSTOMERS.find(c => c.id.toLowerCase() === q || c.email.toLowerCase() === q || c.name.toLowerCase().includes(q)) || { error: 'no customer matched' };
  if (name === 'get_order') return ORDERS.find(o => o.id.toLowerCase() === String(i.order_id || '').toLowerCase()) || { error: 'order not found' };
  if (name === 'list_charges') return CHARGES.filter(c => c.customer_id === i.customer_id);
  if (name === 'issue_refund') return CHARGES.find(c => c.id === i.charge_id) ? { status: 'pending_approval', approval_id: 'APR-' + (2000 + Math.floor(Math.random() * 900)), charge_id: i.charge_id, amount: i.amount, note: 'Refunds require approval by a human teammate.' } : { error: 'charge not found' };
  if (name === 'create_ticket') return { ticket_id: 'TCK-' + (1000 + Math.floor(Math.random() * 900)), status: 'open', priority: i.priority || 'normal' };
  return { error: 'unknown tool' };
}
const SYSTEM = `You are an operations agent for Northwind Outfitters customer support. Resolve the task by calling tools. Look facts up before acting and never invent data. Issuing a refund only REQUESTS it: it still needs human approval, so say so plainly. Think briefly in one short sentence before tool calls. When finished, write a concise final summary: what you found, what you did, what is pending. Today is ${new Date().toISOString().slice(0, 10)}.`;

export async function POST(req) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return json({ error: 'no_key' }, 501);
  if (foreignOrigin(req)) return json({ error: 'forbidden' }, 403);
  if (limited(req, 'agent', 6, 40)) return json({ error: 'rate' }, 429);
  let b; try { b = await req.json(); } catch { return json({ error: 'bad' }, 400); }
  const task = String(b.task || '').slice(0, 600).trim(); if (!task) return json({ error: 'bad' }, 400);
  const enc = new TextEncoder(); const t0 = Date.now();
  const stream = new ReadableStream({
    async start(ctl) {
      const send = (o) => ctl.enqueue(enc.encode(JSON.stringify(o) + '\n'));
      const messages = [{ role: 'user', content: task }];
      try {
        for (let step = 0; step < 7; step++) {
          const r = await fetch(`${API_BASE()}/v1/messages`, { method: 'POST', headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' }, body: JSON.stringify({ model: MODEL(), max_tokens: 900, temperature: 0.2, system: SYSTEM, tools: TOOLS, messages }) });
          if (!r.ok) { send({ t: 'error', text: 'The model service returned an error.' }); break; }
          const data = await r.json(); const uses = (data.content || []).filter(c => c.type === 'tool_use');
          for (const c of data.content || []) { if (c.type === 'text' && c.text.trim()) send({ t: uses.length ? 'think' : 'answer', text: c.text.trim() }); }
          if (data.stop_reason !== 'tool_use' || !uses.length) break;
          messages.push({ role: 'assistant', content: data.content }); const results = [];
          for (const u of uses) { send({ t: 'tool', id: u.id, name: u.name, input: u.input }); const out = run(u.name, u.input || {}); send({ t: 'result', id: u.id, name: u.name, output: out }); results.push({ type: 'tool_result', tool_use_id: u.id, content: JSON.stringify(out) }); }
          messages.push({ role: 'user', content: results });
        }
      } catch { send({ t: 'error', text: 'Something interrupted the run.' }); }
      send({ t: 'done', ms: Date.now() - t0 }); ctl.close();
    },
  });
  return new Response(stream, { headers: { 'Content-Type': 'application/x-ndjson; charset=utf-8', 'Cache-Control': 'no-store', 'X-Accel-Buffering': 'no' } });
}
