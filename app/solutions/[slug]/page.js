import AgentDemo from '@/components/AgentConsole';
import { withOG } from '@/lib/seo';
import { Interlude, VCta } from '@/components/BgVideo';
import { pageVideo } from '@/lib/media';
import { notFound } from 'next/navigation';
import { DemoStage } from '@/components/DemoWindow';
import { Faq } from '@/components/Chrome';
import { EvalLab, RagViz } from '@/components/Labs';
import { AssistantDemo, TrainingPlayground, BenchmarkConsole, ExtractDemo } from '@/components/Demos';
import { LD, breadcrumbLd, serviceLd } from '@/lib/seo';
import { solutions, solutionBySlug } from '@/lib/solutions';
import { services } from '@/lib/data';
import { HeroPanel, HeroCenter, HeroType, HeroFrame, Sec, Head, Split, Rows, Cols, Bento, Path, Strip, Actions, Btn, VSec } from '@/components/Blocks';
const DEMOS = { assistant: <AssistantDemo />, training: <TrainingPlayground />, benchmark: <BenchmarkConsole />, documents: <ExtractDemo />, agents: <AgentDemo />, suite: <EvalLab />, rag: <RagViz /> };
export const generateStaticParams = () => solutions.map(s => ({ slug: s.slug }));
export async function generateMetadata({ params }) { const { slug } = await params; const s = solutionBySlug(slug); if (!s) return {}; return withOG({ title: s.title, description: s.desc, alternates: { canonical: `/solutions/${s.slug}` }, keywords: [s.kw, ...s.more] }); }
const STEPS = [['Scope', 'A short call and a written scope with milestones and cost.'], ['Build', 'Weekly increments you can test, in a shared repository.'], ['Evaluate', 'Measured quality and safety before anything goes live.'], ['Operate', 'Handover and training, or we keep it running for you.']];
const cap = t => t.replace(/^./, c => c.toUpperCase());
export default async function Solution({ params }) {
  const { slug } = await params; const s = solutionBySlug(slug); if (!s) notFound();
  const vi = solutions.findIndex(x => x.slug === s.slug), h = vi % 4, b = Math.floor(vi / 4) % 3;
  const svc = services.find(x => x.slug === s.service), more = solutions.filter(x => x.slug !== s.slug).slice(0, 4);
  const common = { crumb: [{ t: 'Home', href: '/' }, { t: 'Solutions', href: '/solutions' }, { t: s.title }], title: s.h1, lead: s.intro,
    actions: <Actions><Btn p href="/contact">Get a scoped quote</Btn>{svc && <Btn href={`/services/${svc.slug}`}>{svc.name}</Btn>}</Actions> };
  const hero = [
    <HeroPanel key="h" {...common} video={pageVideo(vi)} label="Also covers" rows={s.more.map(m => [cap(m)])} />,
    <HeroCenter key="h" {...common} video={pageVideo(vi)} stats={[['Tier', s.tier], ['Live demo', s.demo ? 'Below' : 'On request'], ['Scoped in', '24 hours']]} />,
    <HeroType key="h" {...common} video={pageVideo(vi)} spec={[['Tier', s.tier], ['Service', svc ? svc.name : 'AI'], ['Live demo', s.demo ? 'Included below' : 'On request'], ['First reply', '24 hours']]} />,
    <HeroFrame key="h" {...common} video={pageVideo(vi)} tag={s.tier} />,
  ][h];
  const demo = s.demo ? <DemoStage kind={s.demo} video={pageVideo(vi + 5)}>{DEMOS[s.demo]}</DemoStage> : null;
  const rel = more.map(x => [x.title, x.tier, `/solutions/${x.slug}`]);
  const dlv = <Interlude compact video={pageVideo(vi + 3)} eyebrow="Delivery" title="Measured before it ships. Yours after it does." text="Quality and safety are tested before launch, then the code, data and documentation transfer to you."><Btn p href="/contact">Get a scoped quote</Btn></Interlude>;
  return (<div className="xp">
    <LD data={[breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Solutions', path: '/solutions' }, { name: s.title, path: `/solutions/${s.slug}` }]), serviceLd({ name: s.title, description: s.desc, path: `/solutions/${s.slug}` })]} />
    {hero}
    {b === 0 && <>
      {demo}
      <Split k="What you get" title="Built around your data"><Rows items={s.what} /></Split>
      {dlv}
      <VSec video={pageVideo(vi + 12)} k="How it works" title="From first call to handover"><div style={{ marginTop: 40 }}><Path steps={STEPS} /></div></VSec>
      <Split alt k="Questions" title="Before you ask"><Faq list={s.faq} /></Split>
      <Sec><Head k="Related" title="Related solutions" /><div style={{ marginTop: 32 }}><Rows items={rel} /></div></Sec>
    </>}
    {b === 1 && <>
      <VSec video={pageVideo(vi + 12)} k="What you get" title="Built around your data"><div style={{ marginTop: 40 }}><Cols n={4} items={s.what} /></div></VSec>
      {demo}
      <Split alt k="How it works" title="From first call to handover"><Path vertical steps={STEPS} /></Split>
      <Sec narrow={860}><Head k="Questions" title="Before you ask" /><div style={{ marginTop: 24 }}><Faq list={s.faq} /></div></Sec>
      <Sec><Head k="Related" title="Related solutions" /><div style={{ marginTop: 32 }}><Bento items={rel} /></div></Sec>
    </>}
    {b === 2 && <>
      <VSec video={pageVideo(vi + 12)} k="What you get" title="Built around your data"><div style={{ marginTop: 40 }}><Bento items={s.what} /></div></VSec>
      <Sec alt><Head k="How it works" title="From first call to handover" /><div style={{ marginTop: 40 }}><Path steps={STEPS} /></div></Sec>
      {demo}
      {dlv}
      <Split flip k="Questions" title="Before you ask"><Faq list={s.faq} /></Split>
      <Sec><Head k="Related" title="Related solutions" /><div style={{ marginTop: 32 }}><Strip items={rel} /></div></Sec>
    </>}
    <VCta video={pageVideo(vi + 9)} title="Tell us the problem. Get a written plan in 24 hours." text="Scope, timeline and cost, free, with an NDA on request." />
  </div>);
}
