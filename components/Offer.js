'use client';
import { useState } from 'react';
import Link from 'next/link';
const A = {
  enterprise: { label: 'Enterprise', promise: 'Production AI for teams with real data, real users and real compliance needs.', start: ['Discovery sprint: scope, data and risk review', 'Pilot: working system on your data in weeks', 'Production: rollout, monitoring and handover'], who: 'Heads of engineering, data, operations, support and risk',
    offers: [['Support and knowledge assistants', 'Chatbots that answer from your policies and documents, cite sources, hand off to humans and log every conversation.', 'Customer support, internal HR/IT help desks, sales enablement', '/lab#assistant', 'Try the assistant'],
      ['Custom and fine-tuned models', 'Models trained on your data, in your cloud, with a held-out test set that proves they work before launch.', 'Classification, ranking, forecasting, domain language models', '/lab#training', 'Train a model live'],
      ['Evaluation and benchmarks', 'Private benchmarks, expert human review and red-teaming, with regression gates in your release pipeline.', 'Model selection, release sign-off, safety and bias audits', '/lab#benchmark', 'Open the benchmark console'],
      ['Document and workflow automation', 'Read invoices, contracts and emails, validate them, and write clean records into your systems.', 'Accounts payable, contract review, claims, onboarding', '/lab#documents', 'Extract from a document'],
      ['Managed AI operations', 'We monitor, retrain and tune what we ship, under agreed service levels.', 'Drift, cost and latency control, monthly reviews', '/services/managed-ai', 'See managed service']] },
  'small-business': { label: 'Small business', promise: 'Practical AI that saves hours every week, set up for you, with predictable scope.', start: ['30-minute call: find your biggest time sink', 'Fixed-scope setup, usually in under a month', 'Handover with training, or we keep it running'], who: 'Owners and operators of shops, agencies, clinics and local services',
    offers: [['Website and support chatbot', 'A chatbot trained on your FAQs and policies that answers customers 24/7 and passes tricky ones to you.', 'Store policies, bookings, product questions', '/lab#assistant', 'Chat with a sample bot'],
      ['Invoice and email automation', 'Pull the numbers out of invoices and sort customer emails by urgency, so nothing slips.', 'Bookkeeping, order emails, lead triage', '/lab#documents', 'Try document extraction'],
      ['Sales and demand insights', 'Simple forecasts and plain-language answers from your sales data.', 'Stock planning, staffing, campaign results', '/lab#impact', 'Estimate the time saved'],
      ['Done-for-you AI setup', 'We connect AI to the tools you already use and train your team to run it.', 'CRM, email, spreadsheets, helpdesk', '/services/ai-integration', 'See integration']] },
  individuals: { label: 'Individual', promise: 'Expert AI help without an agency: sessions, fixed-scope builds, and paid expert work.', start: ['Book a 60-minute expert session', 'Choose a fixed-scope build or ongoing sessions', 'Or apply to work with us as an AI expert'], who: 'Founders, researchers, consultants, creators and AI practitioners',
    offers: [['1:1 AI expert sessions', 'Talk through your idea with an engineer: architecture, model choice, debugging and what to build first.', 'Prototype planning, code reviews, model selection', '/contact', 'Book a session'],
      ['Personal automations', 'A fixed-scope assistant that handles your research, inbox or content workflow.', 'Research briefs, inbox triage, content pipelines', '/lab#assistant', 'Try an assistant'],
      ['Train a model on your dataset', 'We fine-tune and evaluate a small model on your data and teach you how it works.', 'Research projects, niche classifiers, hobby models', '/lab#training', 'Watch a model train'],
      ['Work with us as an AI expert', 'Review model outputs, write rubrics and help build benchmarks as a paid expert.', 'Evaluators, domain experts, data reviewers', '/lab#benchmark', 'Try human review']] },
};
export default function Offer({ initial = 'enterprise', lock = false }) {
  const [k, setK] = useState(initial), a = A[k];
  return (<div className="ofr">
    {!lock && <div className="seg big" role="tablist">{Object.entries(A).map(([id, v]) => <button key={id} role="tab" aria-selected={id === k} className={id === k ? 'on' : ''} onClick={() => setK(id)}>{v.label}</button>)}</div>}
    <div className="ofh" key={k}><h3>{a.promise}</h3><p><span className="mono">Built for</span> {a.who}</p></div>
    <div className="ofg" data-n={a.offers.length} key={k + 'g'}>{a.offers.map(([t, d, ex, href, cta], i) => <Link href={href} className="card ofc" key={t} style={{ animationDelay: i * 70 + 'ms' }}><span className="n">0{i + 1}</span><h4>{t}</h4><p>{d}</p><div className="ex"><span className="mono">Typical use</span>{ex}</div><span className="cta2">{cta} →</span></Link>)}</div>
    <div className="ofs" key={k + 's'}><span className="mono">How it starts</span>{a.start.map((s, i) => <div key={s}><b>0{i + 1}</b>{s}</div>)}</div></div>);
}
