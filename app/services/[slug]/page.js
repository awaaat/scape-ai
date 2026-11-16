import AgentDemo from '@/components/AgentConsole';
import { withOG } from '@/lib/seo';
import { Interlude, VBand, VCta } from '@/components/BgVideo';
import { DemoStage } from '@/components/DemoWindow';
import { pageVideo } from '@/lib/media';
import { notFound } from 'next/navigation';
import { EvalLab, RagViz, RoiCalc } from '@/components/Labs';
import { AssistantDemo, TrainingPlayground, BenchmarkConsole, ExtractDemo } from '@/components/Demos';
import { Tabs } from '@/components/Interactive';
import { Faq } from '@/components/Chrome';
import { serviceSeo, LD, breadcrumbLd, serviceLd } from '@/lib/seo';
import { services, audiences, bySlug, faqFor, detail, deliver } from '@/lib/data';
import { HeroPanel, HeroCenter, HeroType, HeroFrame, Sec, Head, Split, Rows, Cols, Bento, Path, Statement, Cloud, Strip, Actions, Btn, VSec } from '@/components/Blocks';
export const generateStaticParams = () => services.map(s => ({ slug: s.slug }));
export async function generateMetadata({ params }) { const { slug } = await params; const s = bySlug(services, slug); if (!s) return {};
  const [t, dsc] = serviceSeo[s.slug] || [s.name, s.desc];
  return withOG({ title: t, description: dsc, alternates: { canonical: `/services/${s.slug}` } }); }
export default async function Service({ params }) {
  const { slug } = await params; const s = bySlug(services, slug); if (!s) notFound(); const d = detail[slug];
  const demos = { 'ai-evaluation': [['Build a benchmark and review like an expert', <BenchmarkConsole />, 'benchmark'], ['Run an evaluation suite', <EvalLab />, 'suite']], 'ai-development': [['Chat with a grounded assistant', <AssistantDemo />, 'assistant'], ['Train a model live', <TrainingPlayground />, 'training']], 'ai-strategy': [['Estimate the impact', <RoiCalc />, 'roi']], 'ai-analytics': [['Estimate the impact', <RoiCalc />, 'roi']], 'ai-integration': [['Extract data from documents', <ExtractDemo />, 'documents'], ['Watch an agent use your tools', <AgentDemo />, 'agents']], 'managed-ai': [['Watch an agent use your tools', <AgentDemo />, 'agents']], 'data-services': [['Extract data from documents', <ExtractDemo />, 'documents']], 'ai-talent': [['Review model outputs like an expert', <BenchmarkConsole />, 'benchmark']] };
  const demo = demos[slug] || [];
  const i = services.findIndex(x => x.slug === s.slug), vi = 3 + i, h = i % 4, b = Math.floor(i / 4) % 2;
  const rel = services.filter(x => x.slug !== slug).slice(0, 3).map(x => [x.name, x.tag, `/services/${x.slug}`]);
  const common = { crumb: [{ t: 'Home', href: '/' }, { t: 'AI Stack' }, { t: s.name }], title: s.name, lead: s.desc,
    actions: <Actions><Btn p href="/contact">Talk to an expert</Btn><Btn href={`/services/${s.slug}/for/enterprise`}>For enterprise</Btn></Actions> };
  const hero = [
    <HeroPanel key="h" {...common} video={pageVideo(vi)} label="What you get" rows={d.outcomes.map(o => [o])} />,
    <HeroCenter key="h" {...common} video={pageVideo(vi)} stats={[['Workstreams', String(s.items.length)], ['Live demos', demo.length ? String(demo.length) : 'On request'], ['First reply', '24 hours']]} />,
    <HeroType key="h" {...common} video={pageVideo(vi)} spec={[['Focus', s.tag], ['Workstreams', String(s.items.length)], ['Live demos', demo.length ? String(demo.length) : 'On request'], ['First reply', '24 hours']]} />,
    <HeroFrame key="h" {...common} video={pageVideo(vi)} tag={s.tag} />,
  ][h];
  const showOut = h !== 0, out = d.outcomes.map(o => [o]);
  const demoEls = demo.map(([t, c, k], n) => <DemoStage key={t} id={`demo-${n + 1}`} kind={k} title={t} video={pageVideo(vi + 5 + n)}>{c}</DemoStage>);
  const aud = audiences.map(a => [a.name, a.desc, `/services/${s.slug}/for/${a.slug}`]);
  const dlv = <Interlude compact video={pageVideo(vi + 2)} eyebrow="Delivery" title="Built to run in production, not just to demo." text="Short cycles, visible progress and an evaluation gate before anything goes live."><Btn p href="/contact">Talk to an expert</Btn></Interlude>;
  const faq = faqFor(s);
  return (<div className="xp">
    <LD data={[breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'AI Stack' }, { name: s.name, path: `/services/${s.slug}` }]), serviceLd({ name: (serviceSeo[s.slug] || [s.name])[0], description: s.desc, path: `/services/${s.slug}` })]} />
    {hero}
    {b === 0 && <>
      <Statement by="The problem">{d.problem}</Statement>
      {showOut && <VSec video={pageVideo(vi + 12)} k="Outcomes" title="What changes"><div style={{ marginTop: 40 }}><Cols items={out} /></div></VSec>}
      <Sec><Head k="Deliverables" title={`${s.name} deliverables`} /><div style={{ marginTop: 36 }}><Rows two items={s.items.map(x => [x])} /></div></Sec>
      {dlv}
      {demoEls}
      <Sec><Head k="Delivery" title="From scope to operations." sub="The same four-stage approach on every engagement." /><Tabs items={deliver} /></Sec>
      <VBand video={pageVideo(vi + 8)}><h2>What we work with</h2><div style={{ marginTop: 28 }}><Cloud items={d.stack} /></div></VBand>
      <Split flip k="Teams" title={`${s.name} for your team`}><Rows items={aud} /></Split>
      <Sec alt><Head k="Related" title="Works well with" /><div style={{ marginTop: 28 }}><Strip items={rel} /></div></Sec>
      <Split k="FAQ" title="Questions we hear"><Faq list={faq} /></Split>
    </> }
    {b === 1 && <>
      <Split k="The problem" title={`Why ${s.name} matters`}><p className="x-quote sm">{d.problem}</p>{showOut && <Rows items={out} />}</Split>
      <Sec alt><Head k="Deliverables" title={`${s.name} deliverables`} /><div style={{ marginTop: 36 }}><Bento items={s.items.map(x => [x])} /></div></Sec>
      {demoEls}
      <Sec><Head k="Delivery" title="From scope to operations." sub="The same four-stage approach on every engagement." /><div style={{ marginTop: 40 }}><Path steps={deliver.map(x => [x.t, x.p])} /></div></Sec>
      {dlv}
      <Sec alt><Head k="Stack" title="What we work with" /><div style={{ marginTop: 28 }}><Cloud items={d.stack} /></div></Sec>
      <VSec video={pageVideo(vi + 12)} k="Teams" title={`${s.name} for your team`}><div style={{ marginTop: 36 }}><Cols items={aud} /></div></VSec>
      <Sec alt><Head k="Related" title="Works well with" /><div style={{ marginTop: 28 }}><Rows items={rel} /></div></Sec>
      <Sec narrow={860}><Head k="FAQ" title="Questions we hear" /><div style={{ marginTop: 28 }}><Faq list={faq} /></div></Sec>
    </> }
    <VCta video={pageVideo(vi + 10)} title={`Let's scope your ${s.name.toLowerCase()} project.`} text="An engineer replies within 24 hours with a written plan: scope, timeline and cost." label="Get started" />
  </div>);
}
