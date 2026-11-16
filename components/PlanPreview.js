'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText } from 'lucide-react';
// The real deliverable, shown: what the free written plan contains. Example format, labelled as such.
const P = [
  ['Goal and problem', 'Goal and problem', ['The business problem in one paragraph, in your words.', 'The measurable outcome: hours saved, response time, error rate, revenue.', 'Who uses it, and what they do today.']],
  ['Recommended build', 'Recommended build', ['The system we propose: assistant, agent, custom model or automation.', 'Data it needs, systems it connects to, and where it runs (your cloud or ours).', 'Why this approach over the alternatives, including what not to build.']],
  ['Scope: in and out', 'Scope: in and out', ['What is included, listed so there are no surprises.', 'What is explicitly out of scope for this phase.', 'What we need from your team, and when.']],
  ['Timeline', 'Timeline and milestones', ['Discovery, build, evaluation, staged rollout, each with dates.', 'A demo you can click through at every milestone.', 'Acceptance tests agreed before build starts.']],
  ['Cost and terms', 'Cost and terms', ['Fixed fee per milestone, so you can stop or continue at each one.', 'Ongoing run cost for model usage and hosting, estimated separately.', 'You own the code, models, data and documentation.']],
  ['Risks and quality', 'Risks and quality checks', ['The main risks (data quality, accuracy, adoption) and how we reduce them.', 'How quality is measured before release and monitored after.', 'Security, access control and audit approach.']],
];
export default function PlanPreview() {
  const [i, setI] = useState(0), [hold, setHold] = useState(false);
  useEffect(() => { if (hold) return undefined; const t = setInterval(() => setI(x => (x + 1) % P.length), 5200); return () => clearInterval(t); }, [hold]);
  return (<div className="plan" onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)}>
    <div className="plan-l" role="tablist">{P.map(([t], k) => <button key={t} role="tab" aria-selected={k === i} className={k === i ? 'on' : ''} onClick={() => setI(k)}><span className="mono">0{k + 1}</span>{t}</button>)}
      <Link href="/contact" className="btn p" style={{ marginTop: 18 }}>Get my free AI plan</Link></div>
    <div className="plan-r"><div className="dw dw-doc"><div className="dw-bar"><div className="dw-id"><span className="dw-ic"><FileText size={16} strokeWidth={1.75} /></span><div><b>Your AI plan</b><small>Delivered within 24 hours</small></div></div><div className="dw-env"><span className="mono">Example format</span></div></div>
      <div className="paper"><div className="pp-h"><b>Scape<i>.</i>AI</b><span className="mono">AI plan · example format</span></div><h4>Customer support automation</h4><p className="pp-s">Prepared for: your company · Written by an AI engineer · Delivered within 24 hours</p>
        {P.map(([t, h, b], k) => <div key={t} className={'pp-sec' + (k === i ? ' on' : '')} onClick={() => setI(k)}><h5><span className="mono">0{k + 1}</span>{h}</h5>{k === i && <ul>{b.map(x => <li key={x}>{x}</li>)}</ul>}</div>)}</div></div></div></div>);
}
