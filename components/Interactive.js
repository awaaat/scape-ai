'use client';
import { useEffect, useRef, useState } from 'react';
function useInView(th = 0.3) {
  const r = useRef(null); const [v, setV] = useState(false);
  useEffect(() => { const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); io.disconnect(); } }, { threshold: th }); io.observe(r.current); return () => io.disconnect(); }, [th]);
  return [r, v];
}
export function Tabs({ items }) {
  const [i, setI] = useState(0); const t = items[i];
  return (<div className="tabs"><div className="tl" role="tablist">{items.map((x, n) => <button key={x.t} role="tab" aria-selected={n === i} className={n === i ? 'on' : ''} onClick={() => setI(n)}><span className="mono">0{n + 1}</span>{x.t}</button>)}</div>
    <div className="tp" key={i}><h3>{t.h}</h3><p>{t.p}</p><ul>{t.b.map(b => <li key={b}>{b}</li>)}</ul></div></div>);
}
export function Counter({ to, label }) {
  const [r, v] = useInView(); const [n, setN] = useState(0);
  useEffect(() => { if (!v) return; let s; const f = (ts) => { s ??= ts; const p = Math.min((ts - s) / 1400, 1); setN(Math.round(to * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); }, [v, to]);
  return <div ref={r} className="ct"><b>{n}</b><span className="mono">{label}</span></div>;
}
export function Rotator({ words }) {
  const [i, setI] = useState(0);
  useEffect(() => { const id = setInterval(() => setI(x => (x + 1) % words.length), 2400); return () => clearInterval(id); }, [words.length]);
  return <span className="rot grad" key={i}>{words[i]}</span>;
}
export function Stepper({ steps }) {
  const [i, setI] = useState(0); const [hold, setHold] = useState(false);
  useEffect(() => { if (hold) return; const id = setInterval(() => setI(x => (x + 1) % steps.length), 3600); return () => clearInterval(id); }, [hold, steps.length]);
  return (<div className="stp" onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)}>
    <div className="sl">{steps.map((s, n) => <button key={s.t} className={n === i ? 'on' : ''} onClick={() => setI(n)}><span className="mono">Step 0{n + 1}</span><b>{s.t}</b>{n === i && !hold && <i className="pg" key={'p' + i} />}</button>)}</div>
    <div className="sp" key={i}><div className="mono" style={{ color: 'var(--gr)' }}>0{i + 1} / 0{steps.length}</div><h3>{steps[i].t}</h3><p>{steps[i].p}</p></div></div>);
}
export function TypedTerm({ lines }) {
  const [r, v] = useInView(0.4); const [n, setN] = useState(0);
  useEffect(() => { if (!v) return; const id = setInterval(() => setN(x => (x < lines.length ? x + 1 : x)), 650); return () => clearInterval(id); }, [v, lines.length]);
  return (<div className="term" ref={r}><div className="tb"><span className="mono">terminal</span></div><pre>{lines.slice(0, n).map((l, k) => <div key={k} dangerouslySetInnerHTML={{ __html: l }} />)}<span className="caret" /></pre></div>);
}
// Kept as a no-op so the layout import stays valid: pointer tilt and magnetic buttons were removed on purpose.
export function GlobalFx() { return null; }
export function Cookie() {
  const [s, setS] = useState(false);
  const grant = () => { try { window.gtag?.('consent', 'update', { analytics_storage: 'granted' }); } catch {} };
  useEffect(() => { try { if (localStorage.getItem('ck')) grant(); else setS(true); } catch { setS(true); } }, []);
  if (!s) return null;
  const ok = () => { try { localStorage.setItem('ck', '1'); } catch {} grant(); setS(false); };
  return (<div className="ckb"><span>We use essential cookies to run this site and analytics cookies to improve it.</span><button className="btn" onClick={ok}>Accept</button></div>);
}
export function TitleSwap({ words }) {
  const [i, setI] = useState(0);
  useEffect(() => { const id = setInterval(() => setI(x => (x + 1) % words.length), 3500); return () => clearInterval(id); }, [words.length]);
  return <span className="ts" key={i}><span className="mono sm">for</span> <span className="grad">{words[i]}</span></span>;
}
export function Announce() {
  const [s, setS] = useState(true);
  if (!s) return null;
  return (<div className="ann"><i className="new">New</i><span>AI Evaluation suites for model builders are now available —</span><a href="/services/ai-evaluation">Explore AI Evaluation ↗</a><button aria-label="Dismiss" onClick={() => setS(false)}>×</button></div>);
}
