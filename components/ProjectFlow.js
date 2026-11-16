'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { services } from '@/lib/data';
import { startOrder, getOrder, saveOrder, submitOrder, loadToken, saveToken, clearToken, attribution, beacon } from '@/lib/ordersApi';
import { track } from '@/lib/track';

const EV = 'scape:start';
export const openFlow = (detail = {}) => window.dispatchEvent(new CustomEvent(EV, { detail }));
const AUD = [['enterprise', 'Enterprise', 'A company with teams, data and compliance needs'], ['small-business', 'Small business', 'A small team that wants practical AI wins fast'], ['individuals', 'Individual', 'A founder, researcher or expert working on your own']];
const OPTS = ['AI assistants and chatbots', 'Custom model training', 'Evaluation and benchmarks', 'Document and workflow AI', 'Data labeling and preparation', 'Forecasting and analytics', 'AI talent', 'Managed AI operations', 'Not sure yet'];
const SRC = { 'ai-development': 'AI assistants and chatbots', 'ai-evaluation': 'Evaluation and benchmarks', 'data-services': 'Data labeling and preparation', 'ai-analytics': 'Forecasting and analytics', 'ai-talent': 'AI talent', 'managed-ai': 'Managed AI operations', 'ai-integration': 'Document and workflow AI' };
const OUT = { 'AI assistants and chatbots': 'Customers and staff get instant, accurate answers', 'Custom model training': 'A model that knows your data and proves it works', 'Evaluation and benchmarks': 'Know if your AI is reliable before customers do', 'Document and workflow AI': 'Stop retyping invoices, contracts and emails', 'Data labeling and preparation': 'Clean, labelled data your models can learn from', 'Forecasting and analytics': 'See demand, risk and churn before they hit', 'AI talent': 'Vetted AI engineers on your team within days', 'Managed AI operations': 'We run, monitor and improve it after launch', 'Not sure yet': 'We will find the highest-value use case for you' };
const TIME = ['As soon as possible', 'Within 1 to 3 months', 'Just exploring'];
const BUDGET = ['Under $2,000', '$2,000 - $10,000', '$10,000 - $50,000', '$50,000+', 'Not sure yet'];
const RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const blank = { email: '', name: '', aud: '', opts: [], company: '', phone: '', time: '', budget: '', msg: '' };
const F = ({ label, hint, ok, err, children }) => <label className={'pf-f' + (ok ? ' ok' : '') + (err ? ' err' : '')}><span>{label}</span>{children}{ok && <i className="pf-tick" aria-hidden="true">✓</i>}{(err || hint) && <em>{err || hint}</em>}</label>;
const seen = { get: (k) => { try { return sessionStorage.getItem('op_' + k) === '1'; } catch { return false; } }, set: (k) => { try { sessionStorage.setItem('op_' + k, '1'); } catch { /* private mode */ } } };

export default function ProjectFlow() {
  const [open, setOpen] = useState(false), [step, setStep] = useState(1), [d, setD] = useState(blank), [busy, setBusy] = useState(false), [banner, setBanner] = useState(''), [resumed, setResumed] = useState(false), [result, setResult] = useState(null), [tok, setTok] = useState(''), [touched, setTouched] = useState({});
  const path = usePathname(); const body = useRef(null), tokenRef = useRef(''), medRef = useRef('site'), inflight = useRef(null), offline = useRef(false);
  const set = (k, v) => setD(x => ({ ...x, [k]: v }));

  // ---- one request at a time, so a blur + a click can never create two drafts ----
  const run = async (fn) => { if (inflight.current) await inflight.current.catch(() => {}); const p = fn(); inflight.current = p; try { return await p; } finally { if (inflight.current === p) inflight.current = null; } };
  const persist = (payload) => run(async () => {
    if (tokenRef.current) {
      try { return await saveOrder(tokenRef.current, payload); }
      catch (e) { if (e.status !== 409 && e.status !== 404) throw e; clearToken(); tokenRef.current = ''; setTok(''); }
    }
    const res = await startOrder({ ...attribution(medRef.current), ...payload });
    tokenRef.current = res.token; saveToken(res.token); setTok(res.token); return res;
  });

  const payloadFor = (s) => {
    const base = { 1: { email: d.email.trim().toLowerCase() }, 2: { name: d.name.trim(), answers: { audience: d.aud } },
      3: { answers: { interests: d.opts } }, 4: { phone: d.phone.trim(), deadline_window: d.time, details: d.msg.trim(), answers: { company: d.company.trim() || null, budget: d.budget || null } } }[s];
    const out = { ...base, step: s };            // 0-based index of the step the visitor sees next (backend shows "stopped at step N+1")
    if (d.email && s > 1) out.email = d.email.trim().toLowerCase();
    if (d.opts[0]) out.service = d.opts[0].slice(0, 150);
    if (s === 4) { if (!out.phone) delete out.phone; if (!out.deadline_window) delete out.deadline_window; if (!out.details) delete out.details; if (d.name) out.name = d.name.trim(); }
    return out;
  };

  // ---- open / resume ----
  const hydrate = (o) => {
    const x = o.extra_answers || {};
    setD(p => ({ ...p, email: o.email || p.email, name: o.name || '', phone: o.phone || '', company: x.company || '', aud: x.audience || p.aud, opts: x.interests?.length ? x.interests : p.opts, time: o.deadline_window || '', budget: x.budget || '', msg: o.details || '' }));
    setStep(Math.min(Math.max((o.current_step || 0) + 1, 1), 4)); setResumed(true);
  };
  const start = async (detail = {}) => {
    medRef.current = detail.medium || 'site';
    const parts = path.split('/'); const slug = parts[2]; const o = SRC[slug]; const aud = path.startsWith('/for/') ? slug : '';
    const pre = [...(detail.opts || []), ...(o && path.startsWith('/services') && !(detail.opts || []).length ? [o] : [])];
    setD({ ...blank, email: detail.email || '', aud: AUD.some(a => a[0] === aud) ? aud : '', opts: pre });
    setStep(detail.email && RE.test(detail.email) ? 2 : 1); setBanner(''); setResult(null); setResumed(false); setOpen(true);
    track('start_project_open', { medium: medRef.current, page_path: path });
    const t = tokenRef.current || loadToken();
    if (t) {
      try {
        const ord = await getOrder(t);            // loading the draft also cancels a pending "they left" alert on the backend
        const same = !detail.email || !ord.email || ord.email.toLowerCase() === detail.email.toLowerCase();
        if (ord.is_editable && same) { tokenRef.current = ord.token; setTok(ord.token); hydrate(ord); } else { clearToken(); tokenRef.current = ''; setTok(''); }
      } catch { clearToken(); tokenRef.current = ''; setTok(''); }
    }
    // email already known (footer strip etc.): capture the lead immediately, before they touch another field
    if (detail.email && RE.test(detail.email) && !tokenRef.current) persist({ email: detail.email.trim().toLowerCase(), step: 1 }).catch(() => {});
  };
  useEffect(() => {
    const ev = (e) => start(e.detail || {});
    const click = (e) => { const a = e.target.closest?.('a[href="/contact"],[data-start]'); if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return; e.preventDefault(); e.stopPropagation(); start({ medium: a.dataset?.medium || (a.closest('.hd') ? 'nav' : 'cta') }); };
    const key = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener(EV, ev); document.addEventListener('click', click, true); addEventListener('keydown', key);
    return () => { window.removeEventListener(EV, ev); document.removeEventListener('click', click, true); removeEventListener('keydown', key); };
  });
  useEffect(() => {   // reminder-email "finish your order" link: /contact?resume=TOKEN
    const t = loadToken(); if (t) { tokenRef.current = t; setTok(t); }
    const r = new URLSearchParams(location.search).get('resume');
    if (r) { tokenRef.current = r; setTok(r); setTimeout(() => { start({ medium: 'resume-email' }); history.replaceState(null, '', location.pathname); }, 400); }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {   // exit / return beacons for any unfinished draft
    if (!tok) return undefined;
    const leave = () => beacon(tok, 'leave'); const vis = () => { if (document.visibilityState === 'visible') beacon(tok, 'return'); };
    addEventListener('pagehide', leave); document.addEventListener('visibilitychange', vis);
    return () => { removeEventListener('pagehide', leave); document.removeEventListener('visibilitychange', vis); };
  }, [tok]);
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [open]);
  useEffect(() => { if (open) setTimeout(() => body.current?.querySelector('input,textarea')?.focus(), 60); }, [open, step]);

  // ---- validation + navigation ----
  const ok = [null, RE.test(d.email), d.name.trim().length >= 2 && !!d.aud, d.opts.length > 0, (d.aud === 'individuals' || d.company.trim().length > 0) && !!d.time][step];
  const applyErr = (e) => setBanner(e.fieldErrors ? Object.values(e.fieldErrors).flat()[0] : e.message);
  const next = async () => {
    if (!ok || busy) return; setBanner('');
    if (step === 4) return finish();
    setBusy(true);
    try { await persist(payloadFor(step)); track('start_project_step', { step, medium: medRef.current }); setStep(step + 1); }
    catch (e) { if (e.status === 0) { offline.current = true; setStep(step + 1); } else applyErr(e); }
    finally { setBusy(false); }
  };
  const finish = async () => {
    setBusy(true);
    const done = (r) => { setResult(r); setStep(5); track('generate_lead', { medium: medRef.current, audience: d.aud, interest: d.opts[0], page_path: path }); };
    try {
      if (offline.current) throw Object.assign(new Error('offline'), { status: 0 });
      await persist(payloadFor(4)); const r = await submitOrder(tokenRef.current, { service: d.opts[0] });
      clearToken(); tokenRef.current = ''; setTok(''); done(r);
    } catch (e) {
      if (e.status === 0 || e.status >= 500) {     // backend unreachable: never lose the lead, send it to the site's own fallback route
        try { const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...d, source: path }) }); if (!r.ok) throw 0; clearToken(); tokenRef.current = ''; setTok(''); done({ reference: '' }); }
        catch { setBanner('We could not send your request. Please email info@scapedatasolutions.com and we will reply within 24 hours.'); }
      } else applyErr(e);
    } finally { setBusy(false); }
  };
  const toggle = (o) => set('opts', d.opts.includes(o) ? d.opts.filter(x => x !== o) : [...d.opts, o]);
  const titles = [null, 'Where should we send your free AI plan?', 'Who is this plan for?', 'What should AI take off your plate?', 'Last step: shape your plan'];
  const emailBlur = () => { if (step === 1 && RE.test(d.email) && !tokenRef.current && !busy) persist({ email: d.email.trim().toLowerCase(), step: 0 }).catch(() => {}); };

  return (<>
    <OrderLayer open={open} start={start} />
    {open && <div className="pf" role="dialog" aria-modal="true" aria-label="Start a project">
      <div className="pf-h"><a href="/" className="logo" style={{ fontSize: 22 }}>Scape<b>.</b>AI</a><div className="pf-hr"><a className="pf-help" href="mailto:info@scapedatasolutions.com">Need help? info@scapedatasolutions.com</a><button className="pf-x" onClick={() => setOpen(false)} aria-label="Close">✕</button></div></div>
      <div className="pf-pr"><i style={{ width: step === 5 ? '100%' : step * 25 + '%' }} /></div>
      <div className="pf-b" ref={body} onKeyDown={(e) => { if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') { e.preventDefault(); next(); } }}>
        <div key={step} className="pf-s">
          {step < 5 && <><div className="pf-st">STEP {step} OF 4</div><h2 className="pf-t">{titles[step]}</h2></>}
          {resumed && step > 1 && step < 5 && <p className="pf-wb">Welcome back. Your answers are saved.</p>}
          {banner && <p className="pf-er" role="alert">{banner}</p>}
          {step === 1 && <><p className="pf-sub">An engineer reads your request and replies within 24 hours with a written plan: what to build, how long it takes and what it costs. Free, with no payment up front.</p><F label="Work email" ok={RE.test(d.email)} err={touched.email && d.email && !RE.test(d.email) ? 'Enter a valid email address' : ''}><input type="email" autoComplete="email" inputMode="email" placeholder="my.name@company.com" value={d.email} onChange={e => set('email', e.target.value)} onBlur={() => { setTouched(t => ({ ...t, email: true })); emailBlur(); }} /></F><button className="pf-btn" disabled={!ok || busy} onClick={next}>{busy ? 'Saving…' : <>Start my plan <span className="ar">→</span></>}</button><p className="pf-kb">or press Enter ↵</p>
            <p className="pf-lg">By continuing, you agree that Scape AI may contact you about your project. We use your details only to respond to you.</p></>}
          {step === 2 && <><F label="Your name" ok={d.name.trim().length >= 2}><input autoComplete="name" placeholder="Jane Doe" value={d.name} onChange={e => set('name', e.target.value)} /></F><div className="pf-q">I am a…</div>
            {AUD.map(([id, n, s]) => <button key={id} className={'pf-o' + (d.aud === id ? ' on' : '')} onClick={() => set('aud', id)}><i className="pf-r" /><span><b>{n}</b><small>{s}</small></span></button>)}
            <button className="pf-btn" disabled={!ok || busy} onClick={next} style={{ marginTop: 10 }}>{busy ? 'Saving…' : <>Continue <span className="ar">→</span></>}</button></>}
          {step === 3 && <><p className="pf-sub">Choose everything that applies. Not sure? Pick the last one and we will find it together.</p>{OPTS.map(o => <button key={o} className={'pf-o' + (d.opts.includes(o) ? ' on' : '')} onClick={() => toggle(o)}><i className="pf-c" /><span><b>{o}</b>{OUT[o] && <small>{OUT[o]}</small>}</span></button>)}
            <button className="pf-btn" disabled={!ok || busy} onClick={next} style={{ marginTop: 10 }}>{busy ? 'Saving…' : <>Continue <span className="ar">→</span></>}</button></>}
          {step === 4 && <><F label={d.aud === 'individuals' ? 'Company or project (optional)' : 'Company'}><input autoComplete="organization" value={d.company} onChange={e => set('company', e.target.value)} /></F>
            <F label="WhatsApp or phone (optional)" hint="Include the country code, e.g. +1 415 555 0100"><input type="tel" autoComplete="tel" inputMode="tel" placeholder="+1 415 555 0100" value={d.phone} onChange={e => set('phone', e.target.value)} /></F>
            <div className="pf-q">When do you want to start?</div><div className="pf-tm">{TIME.map(t => <button key={t} className={d.time === t ? 'on' : ''} onClick={() => set('time', t)}>{t}</button>)}</div>
            <div className="pf-q">Budget range (optional)</div><div className="pf-tm">{BUDGET.map(t => <button key={t} className={d.budget === t ? 'on' : ''} onClick={() => set('budget', d.budget === t ? '' : t)}>{t}</button>)}</div>
            <F label="Anything we should know? (optional)"><textarea rows={3} maxLength={2000} value={d.msg} onChange={e => set('msg', e.target.value)} /></F>
            <button className="pf-btn" disabled={!ok || busy} onClick={next}>{busy ? 'Sending…' : <>Get my free AI plan <span className="ar">→</span></>}</button></>}
          {step === 5 && <div className="pf-done"><div className="pf-ck">✓</div><h2 className="pf-t" style={{ marginTop: 18 }}>Thanks{d.name ? `, ${d.name.split(' ')[0]}` : ''}. We have your request.</h2>
            <p className="pf-sub">{result?.reference ? <>Your reference is <b>{result.reference}</b>. </> : null}A confirmation is on its way to <b>{d.email}</b>, and an AI expert will reply within 24 hours.</p>
            <div className="pf-sum">{[['Reference', result?.reference || 'Received'], ['Confirmation sent to', d.email], ['Interested in', d.opts.join(', ') || 'To be scoped'], ['Start', d.time || 'To be agreed']].map(([k, v]) => <div key={k}><span>{k}</span><b>{v}</b></div>)}</div>
            <div className="pf-nx">{['We read your request and match an expert to it', 'A 30-minute scoping call to understand goals and data', 'A written proposal with scope, milestones and cost'].map((t, i) => <div key={t}><b>0{i + 1}</b>{t}</div>)}</div>
            <button className="pf-btn" onClick={() => setOpen(false)}>Back to the site</button></div>}
          {step < 5 && <ul className="pf-tr"><li>Written plan in 24 hours</li><li>Free, no payment up front</li><li>NDA on request</li></ul>}
          {step > 1 && step < 5 && <button className="pf-bk" onClick={() => setStep(step - 1)}>← Back</button>}
        </div></div></div>}
  </>);
}

/* ===================== On-every-page order nudges (ported from the parent site's OrderLayer) ===================== */
const LINES = ['Team buried in repetitive work?', 'Not sure your AI is reliable?', 'Customers waiting too long for answers?', 'Data, but no model yet?', 'Where would AI pay off first?'];
function OrderLayer({ open, start }) {
  const path = usePathname(); const here = (() => { const m = path.match(/^\/services\/([^/]+)/); return m ? services.find(s => s.slug === m[1]) : null; })();
  const lines = here ? [`Need ${here.name}? Get a written plan.`, `${here.name}: scoped in 24 hours`, `What would ${here.name} change for you?`] : LINES;
  const [dock, setDock] = useState(false), [i, setI] = useState(0), [pocket, setPocket] = useState(false), [pick, setPick] = useState(''), [toast, setToast] = useState(0), [modal, setModal] = useState(false); const t0 = useRef(0);
  useEffect(() => { t0.current = Date.now(); setToast(0); setModal(false); setPocket(false); setDock(false); if (seen.get('dock_x')) return undefined; const t = setTimeout(() => setDock(true), 9000); return () => clearTimeout(t); }, [path]);
  useEffect(() => { if (pocket) return undefined; const t = setInterval(() => setI(n => (n + 1) % lines.length), 4800); return () => clearInterval(t); }, [pocket, lines.length]);
  useEffect(() => {
    const on = () => { if (seen.get('toast') || Date.now() - t0.current < 10000) return; const de = document.documentElement, max = de.scrollHeight - innerHeight; if (max < 600) return; const pct = Math.round(scrollY / max * 100); if (pct >= 45) { seen.set('toast'); setToast(Math.min(pct, 99)); } };
    addEventListener('scroll', on, { passive: true }); return () => removeEventListener('scroll', on);
  }, [path]);
  useEffect(() => {
    const fire = () => { if (!seen.get('modal')) { seen.set('modal'); setToast(0); setModal(true); } };
    const out = (e) => { if (e.clientY <= 0 && Date.now() - t0.current > 12000) fire(); };
    const touch = matchMedia('(hover: none)').matches; let timer;
    if (touch) timer = setTimeout(fire, 45000); else document.addEventListener('mouseleave', out);
    return () => { clearTimeout(timer); document.removeEventListener('mouseleave', out); };
  }, [path]);
  useEffect(() => { if (!modal) return undefined; const k = (e) => e.key === 'Escape' && setModal(false); addEventListener('keydown', k); return () => removeEventListener('keydown', k); }, [modal]);
  if (open) return null;
  const go = (opts, medium) => { setModal(false); setToast(0); setPocket(false); start({ opts, medium }); };
  return (<>
    {dock && <div className="dockw">
      {pocket && <div className="pocket" role="dialog" aria-label="Quick start"><button className="x" onClick={() => setPocket(false)} aria-label="Close">✕</button><p className="mono pk">Free AI plan · 90 seconds</p><p className="pt">What should AI do for you?</p>
        <div className="pchips">{OPTS.slice(0, 8).map(o => <button key={o} className={pick === o ? 'on' : ''} onClick={() => setPick(o)}>{o}</button>)}</div>
        <button className="btn p" style={{ width: '100%' }} onClick={() => go(pick ? [pick] : [], 'dock-pocket')}>Get my free plan →</button><p className="pf2">Written scope, timeline and cost within 24 hours. No payment up front.</p></div>}
      <div className="dock"><button className="dock-t" onClick={() => setPocket(p => !p)} aria-expanded={pocket}><span key={i}>{lines[i % lines.length]}</span></button><button className="dock-go" onClick={() => go([], 'dock')}>Get my plan →</button><button className="dock-x" onClick={() => { seen.set('dock_x'); setDock(false); }} aria-label="Hide for this visit">✕</button></div></div>}
    {toast > 0 && !modal && <div className="toast" role="status"><svg width="44" height="44" viewBox="0 0 46 46" aria-hidden="true"><circle cx="23" cy="23" r="18" fill="none" stroke="#2F3141" strokeWidth="4" /><circle cx="23" cy="23" r="18" fill="none" stroke="#096CFF" strokeWidth="4" strokeLinecap="round" strokeDasharray={113} strokeDashoffset={113 * (1 - toast / 100)} transform="rotate(-90 23 23)" /><text x="23" y="27" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff">{toast}</text></svg>
      <div><b>You&apos;ve seen {toast}% of how we work.</b><span>The next step takes 90 seconds: tell us the problem, get a written plan within 24 hours.</span></div><button className="btn p" onClick={() => go([], 'scroll-toast')}>Get my plan</button><button className="x" onClick={() => setToast(0)} aria-label="Dismiss">✕</button></div>}
    {modal && <div className="ovl" onMouseDown={e => e.target === e.currentTarget && setModal(false)}><div className="exm" role="dialog" aria-modal="true" aria-label="Before you go"><button className="x" onClick={() => setModal(false)} aria-label="Close">✕</button>
      <p className="mono pk">Before you go · it is free</p><h3>{here ? `Weighing ${here.name}? Start with the problem, not the technology.` : 'Which problem should AI solve for you first?'}</h3><p className="pf2" style={{ margin: '8px 0 18px' }}>Pick the closest one. Within 24 hours an AI engineer sends you a written plan: <b>what to build, how long it takes and what it costs.</b> You keep it whether or not we work together.</p>
      <div className="exo">{[['My team loses hours to repetitive work', 'Automate documents, emails, invoices and approvals', 'Document and workflow AI'], ['Customers wait too long for answers', 'An assistant that answers from your own knowledge, 24/7', 'AI assistants and chatbots'], ['I cannot tell if my AI is reliable', 'Independent benchmarks, red-teaming and human review', 'Evaluation and benchmarks'], ['I am not sure where AI fits yet', 'We find the highest-value use case with you', 'Not sure yet']].map(([t, s, o], n) => <button key={t} onClick={() => go([o], 'exit-modal')}><span className="mono">0{n + 1}</span><b>{t}</b><em>{s}</em><i className="exa" aria-hidden="true">→</i></button>)}</div>
      <ul className="pf-tr" style={{ marginTop: 18 }}><li>Written plan in 24 hours</li><li>No payment up front</li><li>NDA on request</li></ul>
      <button className="nope" onClick={() => setModal(false)}>Not now</button></div></div>}
  </>);
}

export function StartStrip() {
  const [em, setEm] = useState('');
  return (<section className="strip"><div className="wrap strip-in"><div><h3>Know what AI can do for your business within 24 hours.</h3><p>Enter your work email. An AI engineer replies with a written plan: what to build, how long it takes, what it costs. Free, no payment up front.</p></div>
    <div className="strip-f"><input type="email" value={em} placeholder="my.name@company.com" onChange={e => setEm(e.target.value)} onKeyDown={e => e.key === 'Enter' && RE.test(em) && openFlow({ email: em, medium: 'footer-strip' })} aria-label="Work email" /><button className="btn p" disabled={!RE.test(em)} onClick={() => openFlow({ email: em, medium: 'footer-strip' })}>Get my free plan</button></div></div></section>);
}
export function AutoOpen() { useEffect(() => { const t = setTimeout(() => openFlow({ medium: 'contact-page' }), 350); return () => clearTimeout(t); }, []); return null; }
export const StartButton = () => <button className="btn p" onClick={() => openFlow({ medium: 'contact-page' })}>Start a project</button>;
