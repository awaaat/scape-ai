import Link from 'next/link';
import { MessageSquareText, Workflow, LineChart, Network, ClipboardCheck, Calculator, FileScan, Trophy } from 'lucide-react';
import { Bg } from '@/components/BgVideo';

// Product frame for a live demo. It is deliberately not a fake browser: a title, what it is running on,
// and the two lines that tell the visitor what they are looking at and what to do.
const ICONS = { assistant: MessageSquareText, agent: Workflow, training: LineChart, rag: Network, eval: ClipboardCheck, roi: Calculator, extract: FileScan, bench: Trophy };

// Chat, agent and document demos sit on a bright surface so they read as a real product, not a dark panel.
const LIGHT = new Set(['assistant', 'agent', 'extract']);

export default function DemoWindow({ icon = 'assistant', title, sub, env = 'Interactive demo', data = 'Sample data', seeing, tryit, children, note }) {
  const I = ICONS[icon] || MessageSquareText;
  return (<div className={'dw' + (LIGHT.has(icon) ? ' lite' : '')}><div className="dw-bar">
    <div className="dw-id"><span className="dw-ic"><I size={16} strokeWidth={1.75} /></span><div><b>{title}</b>{sub && <small>{sub}</small>}</div></div>
    <div className="dw-env"><span className="mono">{env}</span><span className="mono">{data}</span></div></div>
    <div className="dw-body">{children}</div>
    <div className="dw-cap"><div><span className="mono">What you are seeing</span>{seeing}</div><div><span className="mono">Try this</span>{tryit}</div>{note && <div className="dw-note">{note}</div>}</div></div>);
}

// One full-screen chapter per demo. No counters or topic labels. `video` swaps the animated backdrop for a full-bleed clip.
export function DemoSection({ id, theme = 'knowledge', title, text, svc, video, dim = 0.6, wtitle, wsub, n, total, eyebrow, runs, spec, ...win }) {
  return (<section className={`dsec fit th-${theme} hasv`} id={id}><Bg name={video || 'hud'} dim={dim} /><div className="wrap">
    <div className="dsec-h"><div className="dsec-t"><h2>{title}</h2>{text && <p className="sub">{text}</p>}</div>{svc && <Link className="dsec-svc" href={svc[1]}>{svc[0]} →</Link>}</div>
    <DemoWindow title={wtitle} sub={wsub} {...win} /></div></section>);
}

// Solution-page demo: a full-screen stage on a video background, placed right under the hero.
const STAGE = {
  assistant: { icon: 'assistant', h: 'Talk to it. This one is live.', p: 'Ask your own question, the way a customer would. Answers cite their sources, and you can add your own documents and ask about them.', t: 'Knowledge assistant', s: 'Cited answers · human hand-off', d: 'Sample knowledge base', seeing: 'A working assistant that answers from a knowledge base and shows the source for every claim, with feedback buttons and live analytics.', tryit: 'Type any question, tap a suggestion, click a [1] citation, or add your own text under Knowledge and ask about it.' },
  agents: { icon: 'agent', h: 'Give it a task. Watch it work.', p: 'A real model chooses tools, calls them against sample back-office data and shows every decision. Anything risky waits for your approval.', t: 'Operations agent', s: 'Tool calls with approval gates', d: 'Sample back office', seeing: 'An agent planning, calling tools and returning an auditable answer, step by step.', tryit: 'Pick a task or write your own, then approve or reject the refund when it asks.' },
  documents: { icon: 'extract', h: 'Paste a document. Get structured data.', p: 'Edit the text and the extraction re-runs as you type. Totals are checked and risky items are routed to a person.', t: 'Document extraction', s: 'Fields, checks and routing', d: 'Editable sample', seeing: 'Rule-based extraction with confidence, a validation check and a simulated ERP hand-off.', tryit: 'Edit an amount so the totals no longer add up, or drop in your own .txt file.' },
  rag: { icon: 'rag', h: 'See how documents become answers.', p: 'The retrieval pipeline stage by stage, from raw document to cited answer.', t: 'Retrieval pipeline', s: 'Document to cited answer', d: 'Illustrative', seeing: 'Documents split, embedded, retrieved and passed to a model that cites them.', tryit: 'Hover to hold the animation and click a stage to inspect it.' },
  benchmark: { icon: 'bench', h: 'Rank models on what matters to you.', p: 'Weight the categories, then review answers blind and watch a live ranking form from your votes.', t: 'Benchmark console', s: 'Leaderboard and human review', d: 'Sample scores', seeing: 'A weighted leaderboard and a blind A/B review console with a live Elo ranking.', tryit: 'Switch to the review console and vote with A, B or T on the keyboard.' },
  suite: { icon: 'eval', h: 'Run an evaluation suite.', p: 'Pick a model, run the suite and watch every test case resolve.', t: 'Evaluation suite', s: '40 test cases · 3 models', d: 'Simulated run', seeing: 'A benchmark run across test cases for quality, safety and cost.', tryit: 'Hover a cell to read its test case. Pass rates are a simulation.' },
  roi: { icon: 'roi', h: 'Put numbers on it.', p: 'Enter your own volumes and see the hours and cost involved.', t: 'Impact calculator', s: 'Hours and cost, from your numbers', d: 'Your inputs', seeing: 'A simple model of the time and cost automation could free up.', tryit: 'Change the volumes and watch the totals update.' },
  training: { icon: 'training', h: 'Train a model right here.', p: 'A real neural network learns in your browser. Change the data, size and learning rate and watch it succeed or fail.', t: 'Model training console', s: 'Live backpropagation', d: 'Generated 2-D data', seeing: 'Every curve and the decision boundary are computed live, not animated.', tryit: 'Raise the learning rate until training goes unstable, then click the map to query the model.' },
};
export function DemoStage({ kind, video, title, id = 'demo', children }) {
  const m = STAGE[kind]; if (!m) return null;
  return (<section className={'stage fit' + (video ? ' hasv' : '')} id={id}>{video && <Bg name={video} dim={0.6} />}<div className="wrap">
    <div className="stage-h"><span className="stage-pill"><i />Live demo</span><h2>{title || m.h}</h2><p className="sub">{m.p}</p></div>
    <DemoWindow icon={m.icon} title={m.t} sub={m.s} env="Interactive" data={m.d} seeing={m.seeing} tryit={m.tryit}>{children}</DemoWindow></div></section>);
}
