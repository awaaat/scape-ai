import AgentDemo from '@/components/AgentConsole';
import { withOG } from '@/lib/seo';
import Link from 'next/link';
import { Bg, Interlude, VBand, VCta } from '@/components/BgVideo';
import { pageVideo } from '@/lib/media';
import { notFound } from 'next/navigation';
import Reveal from '@/components/Reveal';
import { DemoStage } from '@/components/DemoWindow';
import { Crumb, Faq } from '@/components/Chrome';
import { NeuralCanvas, EvalLab, RagViz } from '@/components/Labs';
import { AssistantDemo, TrainingPlayground, BenchmarkConsole, ExtractDemo } from '@/components/Demos';
import { LD, breadcrumbLd, serviceLd } from '@/lib/seo';
import { solutions, solutionBySlug } from '@/lib/solutions';
import { services } from '@/lib/data';
const DEMOS = { assistant: <AssistantDemo />, training: <TrainingPlayground />, benchmark: <BenchmarkConsole />, documents: <ExtractDemo />, agents: <AgentDemo />, suite: <EvalLab />, rag: <RagViz /> };
export const generateStaticParams = () => solutions.map(s => ({ slug: s.slug }));
export async function generateMetadata({ params }) { const { slug } = await params; const s = solutionBySlug(slug); if (!s) return {}; return withOG({ title: s.title, description: s.desc, alternates: { canonical: `/solutions/${s.slug}` }, keywords: [s.kw, ...s.more] }); }
const STEPS = [['Scope', 'A short call and a written scope with milestones and cost.'], ['Build', 'Weekly increments you can test, in a shared repository.'], ['Evaluate', 'Measured quality and safety before anything goes live.'], ['Operate', 'Handover and training, or we keep it running for you.']];
export default async function Solution({ params }) {
  const { slug } = await params; const s = solutionBySlug(slug); if (!s) notFound(); const vi = solutions.findIndex(x => x.slug === s.slug); const svc = services.find(x => x.slug === s.service); const more = solutions.filter(x => x.slug !== s.slug).slice(0, 4);
  return (<>
    <LD data={[breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Solutions', path: '/solutions' }, { name: s.title, path: `/solutions/${s.slug}` }]), serviceLd({ name: s.title, description: s.desc, path: `/solutions/${s.slug}` })]} />
    <section className="page" style={{ position: 'relative', overflow: 'hidden' }}><Bg name={pageVideo(solutions.findIndex(x => x.slug === s.slug))} dim={0.74} side /><NeuralCanvas density={45} /><div className="wrap" style={{ position: 'relative' }}><Crumb items={[{ t: 'Home', href: '/' }, { t: 'Solutions', href: '/solutions' }, { t: s.title }]} />
      <h1>{s.h1}</h1><p className="lead">{s.intro}</p><div className="cta"><Link className="btn p" href="/contact">Get a scoped quote</Link>{svc && <Link className="btn" href={`/services/${svc.slug}`}>{svc.name}</Link>}</div></div></section>
    {s.demo && <DemoStage kind={s.demo} video={pageVideo(vi + 5)}>{DEMOS[s.demo]}</DemoStage>}
    <section className="pn"><div className="wrap"><Reveal><h2>What you get</h2></Reveal><div className="cards" style={{ marginTop: 30 }}>{s.what.map(([t, d], i) => <Reveal key={t}><div className="card"><span className="n">0{i + 1}</span><h3>{t}</h3><p>{d}</p></div></Reveal>)}</div></div></section>
    <Interlude compact video={pageVideo(vi + 3)} eyebrow="Delivery" title="Measured before it ships. Yours after it does." text="Quality and safety are tested before launch, then the code, data and documentation transfer to you."><Link className="btn p" href="/contact">Get a scoped quote</Link></Interlude>
    <VBand video={pageVideo(vi + 7)}><Reveal><h2>How it works</h2></Reveal><div className="cards" style={{ marginTop: 30 }}>{STEPS.map(([t, d], i) => <Reveal key={t}><div className="card"><span className="n">0{i + 1}</span><h3>{t}</h3><p>{d}</p></div></Reveal>)}</div></VBand>
    <section className="pn mid"><div className="wrap" style={{ maxWidth: 860 }}><Reveal><h2>Questions</h2><div style={{ marginTop: 24 }}><Faq list={s.faq} /></div></Reveal></div></section>
    <section className="pn"><div className="wrap"><Reveal><h2>Related solutions</h2></Reveal><div className="cards" style={{ marginTop: 30 }}>{more.map(x => <Link key={x.slug} className="card" href={`/solutions/${x.slug}`}><span className="ar">↗</span><h3 style={{ marginTop: 26 }}>{x.title}</h3></Link>)}</div></div></section>
    <VCta video={pageVideo(vi + 9)} title="Tell us the problem. Get a written plan in 24 hours." text="Scope, timeline and cost, free, with an NDA on request." /></>);
}
