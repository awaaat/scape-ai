'use client';
import { useEffect, useRef, useState } from 'react';

const CUSTOMERS = [{ id: 'C-1042', name: 'Maria Gomez', email: 'maria@example.com', plan: 'Pro', since: '2024-03-11' }, { id: 'C-2210', name: 'Liam Walker', email: 'liam@example.com', plan: 'Free', since: '2025-08-02' }, { id: 'C-3307', name: 'Priya Nair', email: 'priya@example.com', plan: 'Pro', since: '2023-12-20' }];
const ORDERS = [{ id: 'NW-88231', customer_id: 'C-1042', item: 'Trail Boot (size 9)', total: 129.0, status: 'delivered', delivered: '2026-11-02' }, { id: 'NW-90112', customer_id: 'C-2210', item: 'Rain Shell', total: 89.0, status: 'in_transit', eta: '2026-11-18' }, { id: 'NW-90377', customer_id: 'C-3307', item: 'Hiking Socks x3', total: 36.0, status: 'processing' }];
const CHARGES = [{ id: 'CH-7781', customer_id: 'C-1042', amount: 49.0, date: '2026-11-03', desc: 'Pro plan' }, { id: 'CH-7782', customer_id: 'C-1042', amount: 49.0, date: '2026-11-03', desc: 'Pro plan' }, { id: 'CH-8120', customer_id: 'C-3307', amount: 49.0, date: '2026-11-01', desc: 'Pro plan' }];
const TASKS = [
  ['Double charge', 'Maria Gomez says she was charged twice for her Pro plan. Sort it out.', 'A customer was billed twice'],
  ['Track order', 'Where is order NW-90112 and when will it arrive?', 'Where is my parcel?'],
  ['Damaged boots', 'maria@example.com says order NW-88231 arrived with a cracked sole. What are the options?', 'Warranty claim, needs judgement'],
  ['Audit charges', 'Check whether Priya Nair has any unusual charges.', 'Spot anything suspicious'],
  ['Login problem', 'Open a high-priority ticket: Liam Walker cannot log in.', 'Escalate to a human'],
];
const ICON = { lookup_customer: 'ID', get_order: 'OR', list_charges: '$', issue_refund: '↩', create_ticket: '#' };
const LABEL = { lookup_customer: 'Looking up customer', get_order: 'Fetching order', list_charges: 'Reviewing charges', issue_refund: 'Requesting refund', create_ticket: 'Opening ticket' };

function run(name, i) {
  const q = String(i.query || '').toLowerCase();
  if (name === 'lookup_customer') return CUSTOMERS.find(c => c.id.toLowerCase() === q || c.email.toLowerCase() === q || c.name.toLowerCase().includes(q)) || { error: 'no customer matched' };
  if (name === 'get_order') return ORDERS.find(o => o.id.toLowerCase() === String(i.order_id || '').toLowerCase()) || { error: 'order not found' };
  if (name === 'list_charges') return CHARGES.filter(c => c.customer_id === i.customer_id);
  if (name === 'issue_refund') return CHARGES.find(c => c.id === i.charge_id) ? { status: 'pending_approval', approval_id: 'APR-' + (2000 + Math.floor(Math.random() * 900)), charge_id: i.charge_id, amount: i.amount, note: 'Refunds require approval by a human teammate.' } : { error: 'charge not found' };
  if (name === 'create_ticket') return { ticket_id: 'TCK-' + (1000 + Math.floor(Math.random() * 900)), status: 'open', priority: i.priority || 'normal' };
  return { error: 'unknown tool' };
}

function* planner(task) {
  const t = task.toLowerCase();
  const orderId = (task.match(/NW-\d+/i) || [])[0];
  const email = (task.match(/[\w.+-]+@[\w-]+\.[\w.]+/) || [])[0];
  const named = CUSTOMERS.find(c => t.includes(c.name.toLowerCase()) || t.includes(c.name.split(' ')[0].toLowerCase()));
  const billing = /(charge|twice|duplicate|refund|billing|invoice|unusual)/.test(t);
  const damaged = /(crack|damag|broken|defect|faulty)/.test(t);
  const ticket = /(ticket|log ?in|escalate|open an?)/.test(t);
  let cust = null, order = null;
  if (orderId) {
    yield { t: 'think', text: `You mentioned order ${orderId.toUpperCase()}. I will pull it up first so I act on facts, not guesses.` };
    order = yield { t: 'call', name: 'get_order', input: { order_id: orderId.toUpperCase() } };
    if (order.error) order = null;
    if (order) { yield { t: 'think', text: 'Found it. Now checking who placed it.' }; cust = yield { t: 'call', name: 'lookup_customer', input: { query: order.customer_id } }; }
  } else if (email || named) {
    yield { t: 'think', text: `Finding ${email || named.name} in the customer records.` };
    cust = yield { t: 'call', name: 'lookup_customer', input: { query: email || named.name } };
  }
  if (cust && cust.error) cust = null;
  if (!cust && !order && !ticket) { yield { t: 'answer', text: 'I could not match a customer or order in that request. Give me a name, an email or an order number such as NW-88231 and I will take it from there.' }; return; }
  if (ticket) {
    const priority = /high|urgent/.test(t) ? 'high' : 'normal';
    yield { t: 'think', text: `This one needs a person. Opening a ${priority}-priority ticket with the details attached.` };
    const tk = yield { t: 'call', name: 'create_ticket', input: { summary: (task.split(':').pop() || task).trim().slice(0, 140), priority } };
    yield { t: 'answer', text: `Done. Ticket ${tk.ticket_id} is open at ${tk.priority} priority${cust ? ` for ${cust.name} (${cust.plan} plan since ${cust.since})` : ''}. A teammate will pick it up.` };
    return;
  }
  if (billing && cust) {
    yield { t: 'think', text: `Reviewing ${cust.name}'s recent charges and looking for duplicates.` };
    const ch = yield { t: 'call', name: 'list_charges', input: { customer_id: cust.id } };
    const dups = ch.filter((c, i) => ch.some((d, j) => j !== i && d.date === c.date && d.amount === c.amount && d.desc === c.desc));
    if (dups.length > 1) {
      yield { t: 'think', text: `Two identical $${dups[1].amount.toFixed(2)} charges on ${dups[1].date}. That is a duplicate. I will request a refund for the second one, but a human has to approve it.` };
      const r = yield { t: 'call', name: 'issue_refund', input: { charge_id: dups[1].id, amount: dups[1].amount, reason: 'Duplicate charge' } };
      yield { t: 'answer', text: `Confirmed: ${cust.name} was charged $${dups[1].amount.toFixed(2)} twice for ${dups[1].desc} on ${dups[1].date}. I requested a refund (${r.approval_id}). Nothing moves until you approve it below.` };
    } else {
      const total = ch.reduce((a, c) => a + c.amount, 0);
      yield { t: 'answer', text: `${cust.name} has ${ch.length} charge${ch.length === 1 ? '' : 's'} totalling $${total.toFixed(2)}. No duplicates and nothing unusual, so no action is needed.` };
    }
    return;
  }
  if (order && damaged) {
    yield { t: 'think', text: 'A cracked sole on a delivered order is a defect, and the 12-month warranty covers it. Opening a ticket so support can confirm with a photo.' };
    const tk = yield { t: 'call', name: 'create_ticket', input: { summary: `${order.id}: ${order.item} arrived damaged (${cust ? cust.name : 'customer'})`, priority: 'normal' } };
    yield { t: 'answer', text: `${order.item} was delivered ${order.delivered}. This is covered by the 12-month warranty, so a free replacement or a refund is possible. I opened ${tk.ticket_id}; ${cust ? cust.name : 'the customer'} just needs to send a photo of the sole.` };
    return;
  }
  if (order) { yield { t: 'answer', text: order.status === 'in_transit' ? `${order.item} (${order.id}) is in transit and expected on ${order.eta}.` : `${order.item} (${order.id}) is ${order.status}${order.delivered ? ' as of ' + order.delivered : ''}.` }; return; }
  yield { t: 'answer', text: `${cust.name} (${cust.id}) is on the ${cust.plan} plan since ${cust.since}. Tell me what to check: charges, an order, or a ticket.` };
}

const sleep = (ms, sig) => new Promise((res, rej) => { const t = setTimeout(res, ms); sig?.addEventListener('abort', () => { clearTimeout(t); rej(new DOMException('aborted', 'AbortError')); }); });
const pretty = (o) => JSON.stringify(o, null, 2);
const args = (o) => Object.entries(o || {}).map(([k, v]) => `${k}=${JSON.stringify(v)}`).join(', ');
const brief = (o) => Array.isArray(o) ? `${o.length} record${o.length === 1 ? '' : 's'} returned` : o && o.error ? o.error : Object.entries(o || {}).slice(0, 3).map(([k, v]) => `${k}: ${v}`).join(' · ');

export default function AgentConsole() {
  const [task, setTask] = useState(''), [asked, setAsked] = useState(''), [ev, setEv] = useState([]), [busy, setBusy] = useState(false), [mode, setMode] = useState('unknown'), [ap, setAp] = useState({}), [open, setOpen] = useState({}), [note, setNote] = useState(''), [ms, setMs] = useState(null), [away, setAway] = useState(false), [cases, setCases] = useState(0);
  const ctl = useRef(null), box = useRef(null), end = useRef(null), seq = useRef(0), stick = useRef(true);

  const toBottom = () => { const b = box.current; if (b) b.scrollTop = b.scrollHeight; };
  useEffect(() => { if (!stick.current) return; const id = requestAnimationFrame(toBottom); return () => cancelAnimationFrame(id); });
  useEffect(() => {
    const b = box.current; if (!b || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => { if (stick.current) toBottom(); });
    if (end.current) ro.observe(end.current);
    return () => ro.disconnect();
  }, []);
  const onScroll = () => { const b = box.current; if (!b) return; const near = b.scrollHeight - b.scrollTop - b.clientHeight < 70; stick.current = near; setAway(!near); };

  const add = (e) => { const id = ++seq.current; setEv(p => [...p, { id, ...e }]); return id; };
  const patch = (id, u) => setEv(p => p.map(x => x.id === id ? { ...x, ...u } : x));
  const say = async (kind, text, sig) => {
    const id = add({ t: kind, text: '', done: false });
    for (let i = 0; i < text.length; i += 3) { patch(id, { text: text.slice(0, i) }); await sleep(16, sig); }
    patch(id, { text, done: true });
  };
  const simulate = async (text, sig) => {
    const gen = planner(text); let s = gen.next();
    while (!s.done) {
      const v = s.value; let back;
      if (v.t === 'think' || v.t === 'answer') { await say(v.t, v.text, sig); await sleep(240, sig); }
      else { const id = add({ t: 'tool', name: v.name, input: v.input }); await sleep(700 + Math.random() * 400, sig); back = run(v.name, v.input); patch(id, { output: back }); await sleep(320, sig); }
      s = gen.next(back);
    }
  };

  const decide = async (o, yes) => {
    setAp(a => ({ ...a, [o.approval_id]: yes ? 'approved' : 'rejected' }));
    const ch = CHARGES.find(c => c.id === o.charge_id), cu = CUSTOMERS.find(c => c.id === ch?.customer_id);
    setBusy(true); stick.current = true; setAway(false);
    await sleep(600);
    if (yes) {
      await say('answer', `Approved. The $${Number(o.amount).toFixed(2)} refund on ${o.charge_id} is on its way to ${cu ? cu.name : 'the customer'}. I drafted the confirmation email below.`);
      await sleep(300);
      const body = `Hi ${cu ? cu.name.split(' ')[0] : 'there'},\n\nSorry about the double charge. We found it, and a refund of $${Number(o.amount).toFixed(2)} is on its way to your original payment method. It usually shows up within 3 to 5 business days.\n\nThanks for your patience,\nNorthwind Support`;
      const id = add({ t: 'mail', to: cu ? cu.email : 'customer', subject: 'Your refund is on its way', body: '', done: false });
      for (let i = 0; i < body.length; i += 4) { patch(id, { body: body.slice(0, i) }); await sleep(14); }
      patch(id, { body, done: true });
    } else {
      await say('answer', 'Rejected. No money moves, and I left a note on the account so the next agent knows why.');
    }
    setBusy(false);
  };

  const go = async (t) => {
    const text = (t ?? task).trim(); if (!text || busy) return;
    setTask(''); setAsked(text); setEv([]); setAp({}); setOpen({}); setNote(''); setMs(null); setBusy(true); stick.current = true; setAway(false);
    const c = new AbortController(); ctl.current = c; const t0 = Date.now(); let got = false;
    try {
      let sim = mode === 'sim';
      if (!sim) {
        const r = await fetch('/api/agent', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ task: text }), signal: c.signal });
        if (r.status === 501 || r.status === 404 || r.status === 405) { setMode('sim'); sim = true; }
        else if (r.status === 429) { setNote('You are running tasks quickly. Wait a minute and try again.'); setBusy(false); return; }
        else if (!r.ok || !r.body) throw new Error('bad');
        else {
          setMode('live'); const rd = r.body.getReader(), dec = new TextDecoder(); let buf = ''; const ids = {};
          for (;;) {
            const { done, value } = await rd.read(); if (done) break; buf += dec.decode(value, { stream: true }); let i;
            while ((i = buf.indexOf('\n')) >= 0) {
              const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1); if (!line) continue;
              let e; try { e = JSON.parse(line); } catch { continue; }
              got = true;
              if (e.t === 'think' || e.t === 'answer') await say(e.t, e.text, c.signal);
              else if (e.t === 'tool') ids[e.id] = add({ t: 'tool', name: e.name, input: e.input });
              else if (e.t === 'result') patch(ids[e.id], { output: e.output });
              else if (e.t === 'error') add({ t: 'error', text: e.text });
            }
          }
        }
      }
      if (sim) await simulate(text, c.signal);
      setMs(Date.now() - t0); setCases(n => n + 1);
    } catch (e) {
      if (e.name === 'AbortError') { setNote('Stopped.'); setEv(p => p.map(x => ({ ...x, done: true }))); }
      else if (!got) { try { setMode('sim'); await simulate(text, c.signal); setMs(Date.now() - t0); setCases(n => n + 1); } catch (e2) { if (e2.name !== 'AbortError') setNote('The run was interrupted. Please try again.'); } }
      else setNote('The run was interrupted. Please try again.');
    }
    setBusy(false);
  };

  const F = {};
  ev.forEach(e => { if (e.t !== 'tool' || !e.output || e.output.error) return; const o = e.output; if (e.name === 'lookup_customer') F.cust = o; if (e.name === 'get_order') F.order = o; if (e.name === 'list_charges') F.charges = o; if (e.name === 'issue_refund') F.refund = o; if (e.name === 'create_ticket') F.ticket = o; });
  const refundState = F.refund ? (ap[F.refund.approval_id] || 'pending') : null;
  const calls = ev.filter(e => e.t === 'tool').length;
  const last = ev[ev.length - 1];
  const streaming = last && last.t !== 'tool' && last.done === false;
  const pendingTool = last && last.t === 'tool' && last.output === undefined;
  const dupIds = F.charges ? F.charges.filter((c, i) => F.charges.some((d, j) => j !== i && d.date === c.date && d.amount === c.amount)).map(c => c.id) : [];
  const saved = calls * 3 + (Object.values(ap).length ? 4 : 0);

  return (<div className="ox">
    <div className="ox-main">
      <div className="ox-top">
        <span className="ox-av">OA</span>
        <div className="ox-who"><b>Ops Agent</b><small>{mode === 'live' ? 'Live model' : mode === 'sim' ? 'Simulated agent' : 'Sample data'}</small></div>
        <span className={'ox-st ' + (busy ? 'on' : ms !== null ? 'ok' : '')}><i />{busy ? 'Working' : ms !== null ? 'Done' : 'Ready'}</span>
      </div>
      <div className="ox-feed" ref={box} onScroll={onScroll}>
        <div ref={end} className="ox-in">
          {!asked && <div className="ox-empty"><span className="ox-orb" /><h4>What should the agent handle?</h4><p>Pick a support case. You will watch it investigate, use tools, and ask you before any money moves.</p>
            <div className="ox-cards">{TASKS.map(([l, t, d]) => <button key={l} onClick={() => go(t)}><b>{l}</b><span>{d}</span></button>)}</div></div>}
          {asked && <div className="ox-u">{asked}</div>}
          {ev.map(e => {
            if (e.t === 'think') return <div key={e.id} className="ox-think"><span>Thinking</span>{e.text}{e.done === false && <i className="ox-caret" />}</div>;
            if (e.t === 'answer') return <div key={e.id} className="ox-ans"><span>Result</span>{e.text}{e.done === false && <i className="ox-caret" />}</div>;
            if (e.t === 'error') return <div key={e.id} className="ox-err">{e.text}</div>;
            if (e.t === 'mail') return <div key={e.id} className="ox-mail"><div className="ox-mh"><span>To</span>{e.to}<span>Subject</span>{e.subject}</div><pre>{e.body}{e.done === false && <i className="ox-caret" />}</pre><small>Draft only. Nothing is sent in this demo.</small></div>;
            const out = e.output, pend = out?.status === 'pending_approval', isOpen = open[e.id];
            const st = out === undefined ? (busy ? 'run' : '') : out?.error ? 'err' : 'ok';
            return (<div key={e.id} className={'ox-tool ' + st}>
              <div className="ox-trow"><span className="ox-ic">{ICON[e.name] || '•'}</span><b>{LABEL[e.name] || e.name}</b><span className={'ox-pill ' + st}>{out === undefined ? (busy ? 'running' : 'stopped') : out?.error ? 'error' : 'done'}</span></div>
              <code>{e.name}({args(e.input)})</code>
              {out === undefined ? (busy && <div className="ox-run"><i />Working on it…</div>) : <>
                <div className="ox-sum">{brief(out)}</div>
                <button className="ox-more" onClick={() => setOpen(o => ({ ...o, [e.id]: !o[e.id] }))}>{isOpen ? 'Hide raw data' : 'View raw data'}</button>
                {isOpen && <pre className="ox-json">{pretty(out)}</pre>}</>}
              {pend && <div className="ox-ap"><div><b>Your approval needed</b><small>Refund ${out.amount} on {out.charge_id} · {out.approval_id}</small></div>
                {ap[out.approval_id] ? <span className={'ox-dec ' + ap[out.approval_id]}>{ap[out.approval_id] === 'approved' ? '✓ Approved' : '✕ Rejected'}</span> : <div className="ox-btns"><button className="y" onClick={() => decide(out, true)}>Approve refund</button><button className="n" onClick={() => decide(out, false)}>Reject</button></div>}</div>}
            </div>);
          })}
          {busy && !streaming && !pendingTool && <div className="ox-typing"><i /><i /><i /></div>}
          {ms !== null && !busy && <div className="ox-next"><span>Try another case</span>{TASKS.filter(x => x[1] !== asked).slice(0, 4).map(([l, t]) => <button key={l} onClick={() => go(t)}>{l}</button>)}</div>}
          {note && <div className="ox-warn">{note}</div>}
        </div>
      </div>
      {away && <button className="ox-jump" onClick={() => { stick.current = true; setAway(false); toBottom(); }}>↓ Latest</button>}
      <div className="ox-comp"><textarea rows={1} value={task} maxLength={600} placeholder="Or type your own case, e.g. Where is NW-90377?" onChange={e => setTask(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); go(); } }} />
        {busy ? <button className="ox-send stop" onClick={() => ctl.current?.abort()} aria-label="Stop">■</button> : <button className="ox-send" disabled={!task.trim()} onClick={() => go()} aria-label="Run">↑</button>}</div>
      <small className="ox-dis">{mode === 'live' ? 'A real model picks the tools.' : 'A local planner picks the tools.'} Sample data only.</small>
    </div>
    <aside className="ox-side">
      <div className="ox-sh">Case file<em>{asked ? 'live' : 'empty'}</em></div>
      <div className="ox-cf">
        {!asked && <div className="ox-ph">Records the agent finds will appear here as it works.</div>}
        {asked && !F.cust && !F.order && !F.charges && !F.ticket && <div className="ox-ph">Searching records…</div>}
        {F.cust && <div className="ox-card" key="c"><span>Customer</span><b>{F.cust.name}</b><small>{F.cust.plan} plan · since {F.cust.since}</small></div>}
        {F.order && <div className="ox-card" key="o"><span>Order {F.order.id}</span><b>{F.order.item}</b><small>{F.order.status.replace('_', ' ')} · ${Number(F.order.total).toFixed(2)}</small></div>}
        {F.charges && <div className="ox-card" key="h"><span>Charges</span>{F.charges.map(c => <div key={c.id} className={'ox-row' + (dupIds.includes(c.id) ? ' dup' : '')}><em>{c.date}</em><i>${c.amount.toFixed(2)}</i>{dupIds.includes(c.id) && <u>duplicate</u>}</div>)}</div>}
        {F.refund && <div className={'ox-card rf ' + refundState} key="r"><span>Refund</span><b>${Number(F.refund.amount).toFixed(2)}</b><small>{refundState === 'pending' ? 'Waiting for your approval' : refundState === 'approved' ? 'Approved and sent' : 'Rejected'}</small></div>}
        {F.ticket && <div className="ox-card" key="t"><span>Ticket</span><b>{F.ticket.ticket_id}</b><small>{F.ticket.status} · {F.ticket.priority} priority</small></div>}
      </div>
      <div className="ox-stats"><div><b>{calls}</b><span>tool calls</span></div><div><b>{ms !== null ? (ms / 1000).toFixed(1) + 's' : '—'}</b><span>agent time</span></div><div><b>~{saved}m</b><span>manual work saved</span></div></div>
      {cases > 0 && <div className="ox-cases">{cases} case{cases === 1 ? '' : 's'} handled this session</div>}
    </aside>
  </div>);
}
