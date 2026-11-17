'use client';
import { useEffect, useRef, useState } from 'react';

export default function DemoPicker({ items }) {
  const [sel, setSel] = useState(items[0].id);
  useEffect(() => {
    const read = () => {
      if (!location.hash.startsWith('#demo-')) return;
      const h = location.hash.slice(6);
      if (!items.some(i => i.id === h)) return;
      setSel(h);
      setTimeout(() => document.getElementById('demo-' + h)?.scrollIntoView({ behavior: 'smooth' }), 80);
    };
    read();
    window.addEventListener('hashchange', read);
    return () => window.removeEventListener('hashchange', read);
  }, []);
  const cur = items.find(i => i.id === sel) || items[0];
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(0);
  const box = useRef(null);
  useEffect(() => {
    if (!open) return;
    const f = e => { if (!box.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', f);
    return () => document.removeEventListener('mousedown', f);
  }, [open]);
  const pick = id => { setSel(id); setOpen(false); history.replaceState(null, '', '#demo-' + id); };
  const toggle = () => { setHi(Math.max(0, items.findIndex(i => i.id === sel))); setOpen(o => !o); };
  const onKey = e => {
    const k = e.key;
    if (k === 'Escape') { setOpen(false); return; }
    if (k === 'ArrowDown' || k === 'ArrowUp' || k === 'Home' || k === 'End') {
      e.preventDefault();
      if (!open) { toggle(); return; }
      setHi(h => k === 'Home' ? 0 : k === 'End' ? items.length - 1 : (h + (k === 'ArrowDown' ? 1 : -1) + items.length) % items.length);
    } else if (k === 'Enter' || k === ' ') {
      if (!open) return;
      e.preventDefault(); pick(items[hi].id);
    } else if (k === 'Tab') setOpen(false);
  };
  return (<>
    <div className="dpick"><div className="wrap">
      <label htmlFor="dsel">Choose a demo</label>
      <div className="dsel" ref={box} onKeyDown={onKey}>
        <button type="button" id="dsel" className="dsel-b" aria-haspopup="listbox" aria-expanded={open} onClick={toggle}>
          <span>{String(items.indexOf(cur) + 1).padStart(2, '0')} · {cur.label}</span>
          <svg width="12" height="8" viewBox="0 0 12 8" aria-hidden="true" className={open ? 'up' : ''}><path d="M1 1.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        {open && <ul className="dsel-m" role="listbox" aria-labelledby="dsel">
          {items.map((i, n) => <li key={i.id} role="option" aria-selected={i.id === sel} className={(i.id === sel ? 'sel ' : '') + (n === hi ? 'hi' : '')} onMouseEnter={() => setHi(n)} onClick={() => pick(i.id)}>
            <span className="ck">{i.id === sel ? '✓' : ''}</span>
            <span><b>{String(n + 1).padStart(2, '0')} · {i.label}</b>{i.hint && <small>{i.hint}</small>}</span>
          </li>)}
        </ul>}
      </div>
      <span className="dpick-sub">{cur.hint}</span>
    </div></div>
    <div key={cur.id}>{cur.node}</div>
  </>);
}
