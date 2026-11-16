'use client';
import { useEffect, useState } from 'react';

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
  return (<>
    <div className="dpick"><div className="wrap">
      <label htmlFor="dsel">Choose a demo</label>
      <div className="dsel"><select id="dsel" value={sel} onChange={e => { setSel(e.target.value); history.replaceState(null, '', '#demo-' + e.target.value); }}>
        {items.map((i, n) => <option key={i.id} value={i.id}>{String(n + 1).padStart(2, '0')} · {i.label}</option>)}
      </select></div>
      <span className="dpick-sub">{cur.hint}</span>
    </div></div>
    <div key={cur.id}>{cur.node}</div>
  </>);
}
