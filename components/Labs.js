'use client';
import { useEffect, useRef, useState } from 'react';

function useInView(th = 0.25) {
  const r = useRef(null); const [v, setV] = useState(false);
  useEffect(() => { const io = new IntersectionObserver(([e]) => setV(e.isIntersecting), { threshold: th }); io.observe(r.current); return () => io.disconnect(); }, [th]);
  return [r, v];
}
function useTween(target, ms = 600) {
  const [v, setV] = useState(target); const from = useRef(target);
  useEffect(() => { const a = from.current, t0 = performance.now(); let id; const f = (t) => { const p = Math.min((t - t0) / ms, 1), e = 1 - Math.pow(1 - p, 3); setV(a + (target - a) * e); if (p < 1) id = requestAnimationFrame(f); else from.current = target; }; id = requestAnimationFrame(f); return () => cancelAnimationFrame(id); }, [target, ms]);
  return v;
}

/* ---------- 1. Interactive neural network background ---------- */
export function NeuralCanvas({ density = 70 }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current, x = c.getContext('2d'); let w = 0, h = 0, raf, nodes = [], pulses = [], vis = true;
    const m = { x: -999, y: -999 }; const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const size = () => { const r = c.parentElement.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2); w = r.width; h = r.height; c.width = w * d; c.height = h * d; c.style.width = w + 'px'; c.style.height = h + 'px'; x.setTransform(d, 0, 0, d, 0, 0);
      nodes = Array.from({ length: Math.round(density * w / 1300) + 24 }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35, r: 1 + Math.random() * 1.8 })); };
    const mv = (e) => { const r = c.getBoundingClientRect(); m.x = e.clientX - r.left; m.y = e.clientY - r.top; };
    const lv = () => { m.x = m.y = -999; };
    const burst = (e) => { const r = c.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top; nodes.map((n, i) => [Math.hypot(n.x - px, n.y - py), i]).sort((a, b) => a[0] - b[0]).slice(0, 5).forEach(([, i]) => pulses.push({ a: i, t: 0, hops: 3 })); };
    size(); addEventListener('resize', size); addEventListener('mousemove', mv); addEventListener('mouseleave', lv); addEventListener('click', burst);
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; }, { threshold: 0 }); io.observe(c);
    let tick = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw); if (!vis) return; tick++; x.clearRect(0, 0, w, h);
      for (const n of nodes) { const dx = m.x - n.x, dy = m.y - n.y, d = Math.hypot(dx, dy); if (d < 170 && d > 1) { n.vx += dx / d * .012; n.vy += dy / d * .012; }
        n.vx *= .985; n.vy *= .985; if (Math.abs(n.vx) < .08) n.vx += (Math.random() - .5) * .02; if (Math.abs(n.vy) < .08) n.vy += (Math.random() - .5) * .02;
        n.x += n.vx; n.y += n.vy; if (n.x < 0 || n.x > w) n.vx *= -1; if (n.y < 0 || n.y > h) n.vy *= -1; }
      const near = (i) => { const o = []; for (let j = 0; j < nodes.length; j++) if (j !== i && Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y) < 120) o.push(j); return o; };
      for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) { const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y); if (d < 120) { x.strokeStyle = `rgba(120,150,210,${(1 - d / 120) * .28})`; x.lineWidth = 1; x.beginPath(); x.moveTo(nodes[i].x, nodes[i].y); x.lineTo(nodes[j].x, nodes[j].y); x.stroke(); } }
      for (const n of nodes) { const d = Math.hypot(m.x - n.x, m.y - n.y); const hot = d < 170; if (hot) { x.strokeStyle = `rgba(190,210,255,${(1 - d / 170) * .6})`; x.beginPath(); x.moveTo(n.x, n.y); x.lineTo(m.x, m.y); x.stroke(); }
        x.fillStyle = hot ? '#FFFFFF' : 'rgba(150,175,225,.55)'; x.beginPath(); x.arc(n.x, n.y, n.r + (hot ? 1 : 0), 0, 7); x.fill(); }
      if (!rm && tick % 50 === 0) pulses.push({ a: Math.floor(Math.random() * nodes.length), t: 0, hops: 3 });
      pulses = pulses.filter(p => { const A = nodes[p.a]; if (!A) return false; if (p.b === undefined) { const nb = near(p.a); if (!nb.length) return false; p.b = nb[Math.floor(Math.random() * nb.length)]; }
        const B = nodes[p.b]; p.t += .05; const px = A.x + (B.x - A.x) * p.t, py = A.y + (B.y - A.y) * p.t; x.fillStyle = '#fff'; x.shadowColor = '#6C9BFF'; x.shadowBlur = 6; x.beginPath(); x.arc(px, py, 2.4, 0, 7); x.fill(); x.shadowBlur = 0;
        if (p.t >= 1) { if (--p.hops <= 0) return false; p.a = p.b; p.b = undefined; p.t = 0; } return true; });
    };
    draw();
    return () => { cancelAnimationFrame(raf); io.disconnect(); removeEventListener('resize', size); removeEventListener('mousemove', mv); removeEventListener('mouseleave', lv); removeEventListener('click', burst); };
  }, [density]);
  return <canvas ref={ref} className="nc" aria-hidden="true" />;
}

/* ---------- 2. Agent demo (scripted simulation) ---------- */
const SC = [
  { k: 'Support triage', p: 'Customer: "I was charged twice for my invoice this month."', s: [['think', 'Intent: billing dispute. I need the account, then the recent charges.'], ['tool', 'crm.lookup(customer="C-1042")', 'Plan: Pro · status: active'], ['tool', 'billing.list_charges(days=30)', '2 charges of $49.00 on the same day'], ['tool', 'billing.refund(amount=49.00)', 'Refund queued · needs human approval'], ['answer', 'I found a duplicate $49.00 charge and queued a refund for approval. A teammate will confirm it, and you will get an email once it is processed.']] },
  { k: 'Contract review', p: 'Review this supplier agreement for risky clauses.', s: [['think', 'Split the document into clauses, then compare each against the playbook.'], ['tool', 'docs.parse(file="supplier.pdf")', '41 clauses extracted'], ['tool', 'playbook.compare(clauses=41)', '3 deviations · 1 high severity'], ['tool', 'review.flag(clause="Liability cap")', 'Escalated to legal'], ['answer', 'Three clauses deviate from your playbook. The liability cap is high severity, so I escalated it to legal with a suggested redline. The other two are low risk.']] },
  { k: 'Data question', p: 'Which region saw the biggest drop in orders last month?', s: [['think', 'Need monthly orders by region, then the month-over-month change.'], ['tool', 'sql.query("SELECT region, SUM(orders) …")', '5 rows returned'], ['tool', 'analytics.compare(prev_month=true)', 'North: -12% · others within ±3%'], ['tool', 'chart.render(type="bar")', 'Chart created'], ['answer', 'The North region fell the most, down 12% month over month, while every other region stayed within 3%. I have attached the chart and the query so you can verify it.']] },
];
export function ScriptedAgentDemo() {
  const [r, vis] = useInView(.3); const [si, setSi] = useState(0), [n, setN] = useState(0), [sub, setSub] = useState(0), [go, setGo] = useState(false);
  const S = SC[si];
  useEffect(() => { if (vis && !go) setGo(true); }, [vis, go]);
  useEffect(() => { setN(0); setSub(0); }, [si]);
  useEffect(() => {
    if (!go) return; const st = S.s[n]; if (!st) return; let t;
    if (st[0] === 'answer') t = sub < st[1].length ? setTimeout(() => setSub(sub + 2), 16) : setTimeout(() => { setN(n + 1); setSub(0); }, 200);
    else if (st[0] === 'tool') t = sub === 0 ? setTimeout(() => setSub(1), 1000) : setTimeout(() => { setN(n + 1); setSub(0); }, 600);
    else t = setTimeout(() => { setN(n + 1); setSub(0); }, 1200);
    return () => clearTimeout(t);
  }, [n, sub, si, go, S]);
  const done = n >= S.s.length;
  return (<div className="lab ag" ref={r}>
    <div className="agl">{SC.map((x, i) => <button key={x.k} className={i === si ? 'on' : ''} onClick={() => { setSi(i); setGo(true); }}><span className="mono">Scenario 0{i + 1}</span>{x.k}</button>)}
      <button className="rp" onClick={() => { setN(0); setSub(0); setGo(true); }}>↻ Replay</button><small>Simulated demo with sample data</small></div>
    <div className="agc"><div className="tb"><i/><i/><i/><span className="mono">agent.run</span><em className={done ? 'ok' : 'live'}>{done ? 'complete' : 'running'}</em></div>
      <div className="agb"><div className="msg u">{S.p}</div>
        {S.s.slice(0, n + 1).map((st, i) => { const cur = i === n;
          if (st[0] === 'think') return <div key={i} className="msg t"><span className="mono">thinking</span>{st[1]}</div>;
          if (st[0] === 'tool') return <div key={i} className="msg c"><span className="mono">tool call</span><code>{st[1]}</code><div className={'res' + (cur && sub === 0 ? ' pend' : '')}>{cur && sub === 0 ? <><i className="spin"/>running…</> : <>✓ {st[2]}</>}</div></div>;
          return <div key={i} className="msg a"><span className="mono">answer</span>{cur ? st[1].slice(0, sub) : st[1]}{cur && sub < st[1].length && <i className="caret"/>}</div>; })}</div></div></div>);
}

/* ---------- 3. Evaluation lab ---------- */
const MODELS = [{ k: 'Baseline model', pass: .62, safe: .86, lat: 420, cost: 1 }, { k: 'Fine-tuned', pass: .78, safe: .92, lat: 380, cost: .7 }, { k: 'Fine-tuned + retrieval', pass: .91, safe: .96, lat: 460, cost: .8 }];
const CASES = ['Refund policy lookup', 'Multi-step tool use', 'Prompt injection', 'Date reasoning', 'PII handling', 'Ambiguous request', 'Long context recall', 'Tone check'];
const rnd = (i, s) => (((i + 1) * 2654435761 + s * 40503) >>> 0) % 1000 / 1000;
export function EvalLab() {
  const [mi, setMi] = useState(0), [k, setK] = useState(0), [run, setRun] = useState(false); const N = 40, M = MODELS[mi];
  const res = Array.from({ length: N }, (_, i) => rnd(i, mi + 3) < M.pass);
  useEffect(() => { if (!run) return; if (k >= N) { setRun(false); return; } const t = setTimeout(() => setK(k + 1), 70); return () => clearTimeout(t); }, [run, k]);
  const basePass = Array.from({ length: N }, (_, i) => rnd(i, 3) < MODELS[0].pass).filter(Boolean).length; const pass = res.slice(0, k).filter(Boolean).length, acc = k ? pass / k : 0, fin = k >= N;
  const A = useTween(acc * 100), Sf = useTween(fin ? M.safe * 100 : 0), L = useTween(fin ? M.lat : 0), C = useTween(fin ? M.cost * 100 : 0);
  const start = () => { setK(0); setRun(true); };
  return (<div className="lab ev"><div className="evh"><div className="seg">{MODELS.map((m, i) => <button key={m.k} className={i === mi ? 'on' : ''} onClick={() => { setMi(i); setK(0); setRun(false); }}>{m.k}</button>)}</div>
    <button className="btn p" onClick={start} disabled={run}>{run ? 'Running…' : k >= N ? 'Run again' : 'Run evaluation'}</button></div>
    <div className="evg"><div className="cells">{res.map((ok, i) => <span key={i} title={`${CASES[i % CASES.length]} #${i + 1}`} className={i < k ? (ok ? 'p' : 'f') : i === k && run ? 'a' : ''} />)}</div>
      <div className="mets">{[['Accuracy', A.toFixed(0) + '%', A], ['Safety', Sf.toFixed(0) + '%', Sf], ['Latency', L.toFixed(0) + ' ms', L / 6], ['Relative cost', C.toFixed(0) + '%', C]].map(([n, v, w]) => <div key={n}><div className="mt"><span>{n}</span><b>{v}</b></div><div className="bar"><i style={{ width: Math.min(w, 100) + '%' }} /></div></div>)}
        <div className="evn">{k === 0 ? 'Choose a model and run the suite. Hover cells to see the test case.' : fin ? `${pass}/${N} cases passed${mi > 0 ? ` · ${pass - basePass >= 0 ? '+' : ''}${Math.round((pass - basePass) / N * 100)} pts vs baseline` : ' · baseline recorded'}${N - pass > 0 ? ` · ${N - pass} regressions flagged for review` : ''}` : `Running case ${k}/${N}…`}</div></div></div>
    <div className="evlog">{k===0?<span className="evlog-e">Case results stream in here as the suite runs.</span>:res.slice(0,k).map((ok,i)=>({ok,i})).slice(-6).reverse().map(({ok,i})=><div key={i} className={ok?'p':'f'}><b>{ok?'PASS':'FAIL'}</b><span>#{i+1} {CASES[i%CASES.length]}</span></div>)}</div>
    <small className="dis">Illustrative simulation with sample pass rates. Not real benchmark results.</small></div>);
}

/* ---------- 4. RAG pipeline visualizer ---------- */
const R1 = (n) => Math.round(n * 10) / 10;
const PTS = Array.from({ length: 38 }, (_, i) => ({ x: R1(340 + ((Math.sin(i * 12.9898) * 43758.5) % 1 + 1) % 1 * 420), y: R1(40 + ((Math.sin(i * 78.233) * 12345.6) % 1 + 1) % 1 * 240) }));
const Q = { x: 640, y: 150 }; const NEAR = PTS.map((p, i) => [Math.hypot(p.x - Q.x, p.y - Q.y), i]).sort((a, b) => a[0] - b[0]).slice(0, 3).map(a => a[1]);
const STG = ['Documents', 'Chunk', 'Embed', 'Retrieve', 'Generate'], ANS = 'Refunds are issued within 5 business days [1], and annual plans are prorated [2][3].';
export function RagViz() {
  const [s, setS] = useState(0), [hold, setHold] = useState(false), [ty, setTy] = useState(0);
  useEffect(() => { if (hold) return; const t = setTimeout(() => setS(x => (x + 1) % 5), 2800); return () => clearTimeout(t); }, [s, hold]);
  useEffect(() => { setTy(0); if (s !== 4) return; const id = setInterval(() => setTy(x => Math.min(x + 2, ANS.length)), 28); return () => clearInterval(id); }, [s]);
  const T = (k, d = 0) => ({ opacity: s >= k ? 1 : 0, transition: `opacity .6s ${d}ms, transform .6s ${d}ms` });
  return (<div className="lab rg" onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)}>
    <div className="rgs">{STG.map((x, i) => <button key={x} className={i === s ? 'on' : i < s ? 'dn' : ''} onClick={() => { setS(i); setHold(true); }}><span className="mono">0{i + 1}</span>{x}</button>)}</div>
    <svg viewBox="0 0 800 330" className="viz">
      {[0, 1, 2].map(i => <g key={i} style={{ transform: s >= 1 ? 'translateX(0)' : 'none' }}><rect x={30 + i * 34} y={50 + i * 26} width="96" height="124" rx="6" className="nd" /><path d={`M${44 + i * 34} ${72 + i * 26}h60M${44 + i * 34} ${86 + i * 26}h66M${44 + i * 34} ${100 + i * 26}h48`} stroke="#3a4260" strokeWidth="3" /></g>)}
      {Array.from({ length: 9 }, (_, i) => <rect key={i} x={190 + (i % 3) * 36} y={80 + Math.floor(i / 3) * 40} width="30" height="30" rx="4" fill="#14234D" stroke="#6C9BFF" style={T(1, i * 60)} />)}
      <path className="wire f" d="M290 140 H330" style={T(2)} />
      {PTS.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={NEAR.includes(i) && s >= 3 ? 7 : 4.5} fill={NEAR.includes(i) && s >= 3 ? '#FFFFFF' : '#6C8CFF'} style={{ ...T(2, i * 25), transition: 'opacity .6s, r .4s, fill .4s' }} />)}
      <g style={T(3)}><rect x={Q.x - 8} y={Q.y - 8} width="16" height="16" transform={`rotate(45 ${Q.x} ${Q.y})`} fill="#fff" /><text x={Q.x + 16} y={Q.y + 4} className="tx2">query</text>
        {NEAR.map(i => <line key={i} x1={Q.x} y1={Q.y} x2={PTS[i].x} y2={PTS[i].y} stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="5 5" className="dsh" />)}</g>
      <g style={T(4)}><rect x="30" y="228" width="300" height="84" rx="8" className="hub" /><text x="46" y="252" className="tx2">ANSWER</text>
        <foreignObject x="44" y="258" width="274" height="52"><div className="rgt">{ANS.slice(0, ty)}</div></foreignObject></g>
      <text x="340" y="320" className="tx2">{['Your documents', 'Split into chunks', 'Each chunk becomes a vector', 'Nearest chunks to the question', 'Answer cites its sources'][s]}</text>
    </svg></div>);
}

/* ---------- 5. ROI estimator ---------- */
export function RoiCalc() {
  const [t, setT] = useState(4000), [m, setM] = useState(9), [a, setA] = useState(40), [r, setR] = useState(28);
  const hrs = t * m / 60, saved = hrs * a / 100, usd = saved * r; const H = useTween(saved), U = useTween(usd * 12);
  const sl = (l, v, set, min, max, step, f) => <label><div className="mt"><span>{l}</span><b>{f(v)}</b></div><input type="range" min={min} max={max} step={step} value={v} onChange={e => set(+e.target.value)} /></label>;
  return (<div className="lab roi"><div className="rin">{sl('Requests per month', t, setT, 500, 20000, 500, v => v.toLocaleString())}{sl('Minutes per request', m, setM, 1, 30, 1, v => v + ' min')}{sl('Share AI can handle', a, setA, 10, 90, 5, v => v + '%')}{sl('Loaded hourly cost', r, setR, 10, 120, 2, v => '$' + v)}</div>
    <div className="rout"><div className="big2"><span className="mono">Hours freed per month</span><b>{Math.round(H).toLocaleString()}</b></div><div className="big2"><span className="mono">Estimated yearly value</span><b>${Math.round(U).toLocaleString()}</b></div>
      <div className="cmpb"><div><span>Today</span><i style={{ width: '100%' }} /><b>{Math.round(hrs).toLocaleString()} h</b></div><div><span>With AI</span><i className="g" style={{ width: (100 - a) + '%' }} /><b>{Math.round(hrs - saved).toLocaleString()} h</b></div></div>
      <small className="dis">Estimate from your own inputs. Not a guarantee of results.</small></div></div>);
}
