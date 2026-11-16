'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { KBS, KB_KEYS } from '@/lib/kb';
import { openFlow } from '@/components/ProjectFlow';

/* ================= local engine: used only when no model key is configured on the server ================= */
const STOP = new Set('a an the is are was were be been do does did can could i you we my me your our to of for in on at by with and or if it this that what how when where which who there any have has had will would should about from as not no get so much many never ever always please want need tell give just'.split(' '));
const SYN = { delivery: 'ship', deliver: 'ship', cancel: 'return', money: 'refund', broken: 'warranty', damaged: 'warranty', defect: 'warranty', late: 'track', arrive: 'track', arrived: 'track', package: 'track', parcel: 'track', cost: 'price', cheaper: 'price', holiday: 'pto', vacation: 'pto', leave: 'parental', maternity: 'parental', paternity: 'parental', reimburse: 'expense', receipt: 'expense', abroad: 'remote', wfh: 'remote', laptop: 'equipment', insurance: 'benefit', review: 'performance', secure: 'security', safe: 'security', privacy: 'security', bank: 'finance', hospital: 'healthcare', quote: 'pricing', charge: 'pricing', build: 'offer', make: 'offer', provide: 'offer', services: 'offer', service: 'offer', offering: 'offer', banks: 'finance', trust: 'security', hack: 'security', timeline: 'timelines', long: 'timelines', fast: 'timelines' };
const strip = (w) => (w.length > 4 ? w.replace(/(ing|ed|es|s)$/, '').replace(/(.)\1$/, '$1') : w);
const stem = (w) => strip(SYN[w] || SYN[strip(w)] || w);   // synonym targets are normalised exactly like document text
const tok = (s) => (s.toLowerCase().match(/[a-z0-9$]+/g) || []).filter(w => !STOP.has(w)).map(stem);
function retrieve(docs, q) {
  const qt = tok(q), D = docs.map(([t, x]) => ({ t, x, tk: [...tok(x), ...tok(t), ...tok(t)] })), N = D.length, avg = D.reduce((a, d) => a + d.tk.length, 0) / N, df = {};
  D.forEach(d => new Set(d.tk).forEach(w => { df[w] = (df[w] || 0) + 1; }));
  return D.map((d, i) => { let sc = 0; for (const w of new Set(qt)) { const tf = d.tk.filter(v => v === w).length; if (!tf) continue; const idf = Math.log(1 + (N - df[w] + .5) / (df[w] + .5)); sc += Math.pow(idf, 1.6) * (tf * 2.2) / (tf + 1.2 * (.25 + .75 * d.tk.length / avg)); } return { i, t: d.t, x: d.x, score: sc }; }).sort((a, b) => b.score - a.score);
}
function bestSent(x, qt, strict) { const ss = x.split(/(?<=[.!?])\s+/); const sc = ss.map((s, i) => [tok(s).filter(w => qt.includes(w)).length, i]); const top = sc.filter(a => a[0] > 0).sort((a, b) => b[0] - a[0]).slice(0, 2).map(a => a[1]).sort((a, b) => a - b); if (strict && !top.length) return ''; return (top.length ? top : [0]).map(i => ss[i]).join(' '); }
const list = (docs, n = 4) => docs.slice(0, n).map(d => d[0].toLowerCase()).join(', ').replace(/, ([^,]*)$/, ' and $1');
function localReply(K, docs, q) {
  const t = q.toLowerCase().trim(), conc = K.name === 'Scape AI', ask = K.ask.slice(0, 3);
  const wantsStart = conc && /\b(quote|start a project|get started|hire you|work with you|proposal|talk to|contact)\b/.test(t);
  if (/^(hi|hello|hey|good (morning|afternoon|evening))\b/.test(t)) return { text: `Hi! I’m the ${K.role} for ${K.name}. I can help with ${list(docs)}. What would you like to know?`, follow: ask };
  if (/\b(thank|thanks|cheers)\b/.test(t)) return { text: 'You’re very welcome! Is there anything else I can help with?', follow: ask };
  if (/(who|what) are you|what can you do|what do you do/.test(t)) return { text: `I’m the ${K.role} for ${K.name}. I answer from the company’s own knowledge base and cite my sources. Ask me about ${list(docs)}.`, follow: ask };
  if (/\b(human|representative|someone|manager|call me|real person)\b/.test(t)) return { text: 'Of course. I’ve passed this conversation to a specialist with a summary, so you won’t need to repeat yourself. They’ll reply by email within 24 hours.', follow: ask.slice(0, 2), action: conc ? 'start' : undefined };
  const r = retrieve(docs, q), qt = tok(q), top = r[0]; let text, follow = r.slice(1, 4).filter(x => x.score > 0).map(x => `Tell me about ${x.t.toLowerCase()}`);
  if (top.score >= 1.1) { text = bestSent(top.x, qt) + ` [${top.i + 1}]`; if (r[1].score >= .7 * top.score) { const b2 = bestSent(r[1].x, qt, true); if (b2) text += ' ' + b2 + ` [${r[1].i + 1}]`; } }
  else if (top.score > 0) text = `The closest guidance on this: ${bestSent(top.x, qt)} [${top.i + 1}] Tell me a little more about your situation and I’ll narrow it down, or I can hand this to the team with your question attached.`;
  else text = `Here’s how I can help right now: ${list(docs)}. Tell me which of these fits, or describe your situation and I’ll point you to the next step.`;
  return { text, follow: follow.length ? follow : ask, action: wantsStart ? 'start' : undefined };
}

/* ================= parsing the model's reply ================= */
const split = (full) => { const i = full.search(/::(follow-ups|action)::/); const body = (i < 0 ? full : full.slice(0, i)).trim(); const f = (full.match(/::follow-ups::\s*([^\n]*)/) || [])[1]; const a = (full.match(/::action::\s*(\w+)/) || [])[1]; return { body, follow: f ? f.split('|').map(s => s.trim()).filter(Boolean).slice(0, 3) : [], action: a }; };
const visible = (full) => { const i = full.indexOf('::'); return (i < 0 ? full : full.slice(0, i)).trimStart(); };
function inline(s, onCite) { return s.split(/(\*\*[^*]+\*\*|\[\d+\])/g).map((p, i) => /^\*\*/.test(p) ? <strong key={i}>{p.slice(2, -2)}</strong> : /^\[\d+\]$/.test(p) ? <button key={i} className="as-cite" onClick={() => onCite(+p.slice(1, -1) - 1)}>{p.slice(1, -1)}</button> : p); }
function Md({ text, onCite }) {
  return text.split(/\n{2,}/).map((b, i) => { const ls = b.split('\n'); const li = /^\s*([-*•]|\d+\.)\s+/;
    return ls.every(l => li.test(l)) ? <ul key={i}>{ls.map((l, j) => <li key={j}>{inline(l.replace(li, ''), onCite)}</li>)}</ul> : <p key={i}>{ls.map((l, j) => <span key={j}>{j > 0 && <br />}{inline(l, onCite)}</span>)}</p>; });
}

/* ================= the product UI ================= */
export default function Assistant({ initial = 'concierge' }) {
  const [kb, setKb] = useState(initial), K = KBS[kb];
  const [view, setView] = useState('chat'), [conv, setConv] = useState({}), [extra, setExtra] = useState({}), [mode, setMode] = useState('unknown');
  const [stats, setStats] = useState({ q: 0, ms: [], up: 0, down: 0, cites: {}, qs: [] }), [val, setVal] = useState(''), [busy, setBusy] = useState(false), [active, setActive] = useState(null), [nd, setNd] = useState({ t: '', x: '' }), [copied, setCopied] = useState('');
  const abort = useRef(null), box = useRef(null), inp = useRef(null);
  const [t0m] = useState(() => Date.now());
  const ts = (m) => { const n = +String(m.id).replace(/\D/g, ''); return new Date(n > 1e12 ? n : t0m).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); };

  const greeting = (k) => ({ id: 'g-' + k, role: 'a', text: KBS[k].greet, follow: KBS[k].ask.slice(0, 3), greeting: true });
  const docs = useMemo(() => [...K.docs, ...(extra[kb] || [])], [K, extra, kb]);
  const msgs = conv[kb] || [greeting(kb)];
  const setMsgs = (fn, k = kb) => setConv(c => ({ ...c, [k]: fn(c[k] || [greeting(k)]) }));
  useEffect(() => { if (box.current) box.current.scrollTop = box.current.scrollHeight; }, [msgs, view]);
  useEffect(() => { if (inp.current) { inp.current.style.height = 'auto'; inp.current.style.height = Math.min(inp.current.scrollHeight, 120) + 'px'; } }, [val]);

  const send = async (raw, regen = false) => {
    const text = raw.trim(); if (!text || busy) return; const k = kb, KK = KBS[k], dd = [...KK.docs, ...(extra[k] || [])];
    setBusy(true); setVal(''); setView('chat'); const t0 = performance.now(), aId = 'a' + Date.now(); const cur = conv[k] || [greeting(k)];
    const hist = cur.filter(m => !m.greeting && !m.streaming).map(m => ({ role: m.role === 'u' ? 'user' : 'assistant', content: m.text }));
    const api = regen ? hist.slice(0, -1) : [...hist, { role: 'user', content: text }];
    setMsgs(p => regen ? [...p.slice(0, -1), { id: aId, role: 'a', text: '', streaming: true }] : [...p, { id: 'u' + aId, role: 'u', text }, { id: aId, role: 'a', text: '', streaming: true }], k);
    if (!regen) setStats(s => ({ ...s, q: s.q + 1, qs: [text, ...s.qs].slice(0, 6) }));
    let full = '', via = 'live', first = null; const ctrl = new AbortController(); abort.current = ctrl;
    try {
      if (mode === 'demo') throw Object.assign(new Error('demo'), { status: 501 });
      const r = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kb: k, messages: api, docs: extra[k] || [] }), signal: ctrl.signal });
      if (!r.ok) throw Object.assign(new Error('http'), { status: r.status });
      const rd = r.body.getReader(), dec = new TextDecoder();
      for (;;) { const { done, value } = await rd.read(); if (done) break; full += dec.decode(value, { stream: true }); if (first === null) first = Math.round(performance.now() - t0); const v = visible(full); setMsgs(p => p.map(m => m.id === aId ? { ...m, text: v } : m), k); }
      setMode('live');
    } catch (e) {
      if (e.name === 'AbortError') { via = 'live'; }
      else if (e.status === 429) { full = 'You’re sending messages quickly, so I’ve paused for a few seconds. Try again in a moment and we’ll pick up right where we left off.'; }
      else {
        via = 'demo'; if (!e.status || e.status === 501) setMode('demo');
        const res = localReply(KK, dd, text); full = res.text + (res.follow?.length ? `\n::follow-ups:: ${res.follow.join(' | ')}` : '') + (res.action ? `\n::action:: ${res.action}` : '');
        await new Promise(r => setTimeout(r, 700 + Math.random() * 700)); const body = split(full).body; first = 450;
        for (let i = 0; i <= body.length; i += 4) { setMsgs(p => p.map(m => m.id === aId ? { ...m, text: body.slice(0, i) } : m), k); await new Promise(r => setTimeout(r, 12)); }
      }
    }
    const { body, follow, action } = split(full); const cites = [...new Set([...body.matchAll(/\[(\d+)\]/g)].map(m => +m[1] - 1))].filter(i => i >= 0 && i < dd.length); const ms = Math.round(performance.now() - t0);
    setMsgs(p => p.map(m => m.id === aId ? { ...m, text: body || '…', cites, follow, action, ms, first: first ?? ms, via, streaming: false } : m), k);
    setStats(s => { const c = { ...s.cites }; cites.forEach(i => { const t = dd[i][0]; c[t] = (c[t] || 0) + 1; }); return { ...s, ms: [...s.ms, first ?? ms], cites: c }; });
    setBusy(false); abort.current = null; setActive(null);
  };
  const stop = () => abort.current?.abort();
  const lastUser = [...msgs].reverse().find(m => m.role === 'u');
  const rate = (id, v) => { const m = msgs.find(x => x.id === id); if (!m || m.fb === v) return; setMsgs(p => p.map(x => x.id === id ? { ...x, fb: v } : x)); setStats(s => ({ ...s, up: s.up + (v === 'up' ? 1 : 0) - (m.fb === 'up' ? 1 : 0), down: s.down + (v === 'down' ? 1 : 0) - (m.fb === 'down' ? 1 : 0) })); };
  const copy = (m) => { try { navigator.clipboard.writeText(m.text); setCopied(m.id); setTimeout(() => setCopied(''), 1400); } catch { /* clipboard blocked */ } };
  const newChat = () => { if (busy) stop(); setConv(c => ({ ...c, [kb]: undefined })); setActive(null); };
  const addDoc = (t, x) => { if (!x.trim()) return; setExtra(e => ({ ...e, [kb]: [...(e[kb] || []), [(t || 'Untitled').slice(0, 80), x.slice(0, 4000)]].slice(0, 6) })); setNd({ t: '', x: '' }); };
  const upload = (f) => { if (!f) return; const r = new FileReader(); r.onload = () => addDoc(f.name, String(r.result)); r.readAsText(f); };
  const lastA = [...msgs].reverse().find(m => m.role === 'a' && m.cites?.length);
  const srcIdx = active != null ? [active, ...(lastA?.cites || []).filter(i => i !== active)] : (lastA?.cites || []);
  const avg = stats.ms.length ? Math.round(stats.ms.reduce((a, b) => a + b, 0) / stats.ms.length) : 0, rated = stats.up + stats.down;
  const topSrc = Object.entries(stats.cites).sort((a, b) => b[1] - a[1]).slice(0, 5), maxC = topSrc[0]?.[1] || 1;

  return (<div className="lab as">
    <div className="as-top">
      <div className="as-ws"><span className="as-av">{K.mark}</span><div><b>{K.name}</b><small><i className="as-on" />{busy ? 'typing…' : 'Online · replies instantly'}</small></div></div>
      <div className="as-tabs">{[['chat', 'Chat'], ['kb', `Knowledge (${docs.length})`], ['an', 'Analytics']].map(([id, l]) => <button key={id} className={view === id ? 'on' : ''} onClick={() => setView(id)}>{l}</button>)}</div>
      <div className="as-right"><span className={'as-mode ' + mode} title={mode === 'demo' ? 'Running on the built-in demo engine. Set ANTHROPIC_API_KEY on the server for the full model.' : ''}>{mode === 'live' ? 'Live AI' : mode === 'demo' ? 'Demo engine' : 'Ready'}</span><button className="as-new" onClick={newChat}>New chat</button></div>
    </div>
    <div className="as-kbs">{KB_KEYS.map(k => <button key={k} className={k === kb ? 'on' : ''} onClick={() => { if (busy) stop(); setKb(k); setView('chat'); setActive(null); }}>{KBS[k].tab}</button>)}</div>

    {view === 'chat' && <div className="as-body">
      <div className="as-main">
        <div className="as-msgs" ref={box} aria-live="polite"><div className="as-day">Today</div>{msgs.map((m, idx) => { const isLast = idx === msgs.length - 1;
          return <div key={m.id} className={'as-row ' + m.role}>
            {m.role === 'a' && <span className="as-av sm">{K.mark}</span>}
            <div className="as-col"><div className={'as-bub' + (m.streaming && !m.text ? ' wait' : '')}>{m.streaming && !m.text ? <span className="ty"><i /><i /><i /></span> : <Md text={m.text} onCite={(i) => { setActive(i); }} />}{m.streaming && m.text && <i className="caret" />}</div>
              {m.role === 'u' && <div className="as-ts">{ts(m)} · <b>Read ✓✓</b></div>}
              {m.role === 'a' && !m.streaming && !m.greeting && <div className="as-meta"><span>{ts(m)} · {m.first ? `${(m.first / 1000).toFixed(1)}s` : ''}{m.via === 'demo' ? ' · demo engine' : ''}</span>
                <button onClick={() => copy(m)}>{copied === m.id ? 'Copied' : 'Copy'}</button><button className={m.fb === 'up' ? 'on' : ''} onClick={() => rate(m.id, 'up')} aria-label="Helpful">👍</button><button className={m.fb === 'down' ? 'on' : ''} onClick={() => rate(m.id, 'down')} aria-label="Not helpful">👎</button>
                {isLast && lastUser && !busy && <button onClick={() => send(lastUser.text, true)}>↻ Regenerate</button>}</div>}
              {m.action === 'start' && !m.streaming && <button className="btn p as-act" onClick={() => openFlow({ medium: 'assistant' })}>Start a project →</button>}
              {isLast && !m.streaming && !busy && m.follow?.length > 0 && <div className="as-chips">{m.follow.map(f => <button key={f} onClick={() => send(f)}>{f}</button>)}</div>}
            </div></div>; })}</div>
        <div className="as-comp"><textarea ref={inp} rows={1} value={val} maxLength={1200} placeholder={`Ask ${K.name} anything…`} onChange={e => setVal(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(val); } }} />
          {busy ? <button className="as-send stop" onClick={stop} aria-label="Stop">■</button> : <button className="as-send" disabled={!val.trim()} onClick={() => send(val)} aria-label="Send">↑</button>}</div>
        <p className="as-hint">{mode === 'demo' ? 'Answers come from the sample knowledge base on the right. Add your own text under Knowledge to test it on your content.' : 'Ask in your own words. Enter to send, Shift+Enter for a new line. Answers cite their sources.'}</p>
      </div>
      <aside className="as-side"><div className="as-sh">Sources</div>
        {srcIdx.length ? srcIdx.map(i => <div key={i} className={'as-src' + (i === active ? ' act' : '')}><div className="as-st"><sup className="as-cite">{i + 1}</sup><b>{docs[i][0]}</b></div><p>{docs[i][1]}</p></div>) : <p className="as-empty">Answers that use company knowledge show their sources here. Click a numbered citation in any answer to open it.</p>}
        <div className="as-sh" style={{ marginTop: 16 }}>Try asking</div>{K.ask.map(q => <button key={q} className="as-q" onClick={() => send(q)} disabled={busy}>{q}</button>)}
      </aside></div>}

    {view === 'kb' && <div className="as-pane">
      <div className="as-split"><div><div className="as-sh">Documents in {K.name}’s knowledge base</div>
        {docs.map((d, i) => <div className="as-doc" key={i}><span className="as-cite">{i + 1}</span><div><b>{d[0]}</b><p>{d[1].slice(0, 150)}{d[1].length > 150 ? '…' : ''}</p></div><em>{i >= K.docs.length ? 'Yours' : 'Indexed'}</em>{i >= K.docs.length && <button className="as-x" onClick={() => setExtra(e => ({ ...e, [kb]: e[kb].filter((_, j) => j !== i - K.docs.length) }))} aria-label="Remove">✕</button>}</div>)}</div>
        <div className="as-add"><div className="as-sh">Add your own knowledge</div><p className="as-empty">Add a policy, FAQ or any text. The assistant can use it immediately. Go to Chat and ask about it.</p>
          <input placeholder="Title, for example Refund exceptions" value={nd.t} onChange={e => setNd({ ...nd, t: e.target.value })} /><textarea rows={6} placeholder="Paste text here…" value={nd.x} onChange={e => setNd({ ...nd, x: e.target.value })} />
          <div className="as-adda"><button className="btn p" disabled={!nd.x.trim() || (extra[kb] || []).length >= 6} onClick={() => addDoc(nd.t, nd.x)}>Add to knowledge base</button><label className="btn as-up">Upload .txt / .md<input type="file" accept=".txt,.md,.csv,.json" onChange={e => upload(e.target.files?.[0])} hidden /></label></div>
          <p className="as-empty">Up to 6 documents of 4,000 characters, kept in this browser session only.</p></div></div></div>}

    {view === 'an' && <div className="as-pane"><div className="as-stats">{[['Questions', stats.q], ['Avg first response', avg ? (avg / 1000).toFixed(1) + 's' : '—'], ['Helpful rate', rated ? Math.round(stats.up / rated * 100) + '%' : '—'], ['Sources cited', Object.values(stats.cites).reduce((a, b) => a + b, 0)]].map(([l, v]) => <div key={l}><span>{l}</span><b>{v}</b></div>)}</div>
      <div className="as-split"><div><div className="as-sh">Most-cited sources</div>{topSrc.length ? topSrc.map(([t, c]) => <div className="as-bar" key={t}><span>{t}</span><div><i style={{ width: c / maxC * 100 + '%' }} /></div><b>{c}</b></div>) : <p className="as-empty">Ask a few questions in Chat and this fills in live.</p>}</div>
        <div><div className="as-sh">Recent questions</div>{stats.qs.length ? stats.qs.map((q, i) => <div className="as-rq" key={i}>{q}</div>) : <p className="as-empty">Nothing yet.</p>}</div></div>
      <p className="as-empty" style={{ padding: '0 20px 18px' }}>These numbers are computed from your session, the same dashboard you get on a real deployment (with every customer conversation).</p></div>}
  </div>);
}
