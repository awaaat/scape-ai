import { withOG } from '@/lib/seo';
import { VCta } from '@/components/BgVideo';
import { pageVideo } from '@/lib/media';
import { solutions } from '@/lib/solutions';
import { LD, breadcrumbLd } from '@/lib/seo';
import { HeroType, Split, Rows, Actions, Btn } from '@/components/Blocks';
export const metadata = withOG({ title: 'AI Solutions: Chatbots, RAG, Agents, Evaluation and Fine-Tuning', description: 'AI chatbot development, RAG, AI agents, MCP servers, LLM evaluation, red teaming, fine-tuning and private LLMs. Pick your problem and see what we build.', alternates: { canonical: '/solutions' } });
const LABEL = { 'Competitive': 'Core solutions', 'Competitive and rising': 'Rising demand', 'Emerging': 'Emerging', 'Local, low competition': 'Local focus' };
const GROUPS = [...new Set(solutions.map(s => s.tier))].map(t => [t, LABEL[t] || t]);
const nm = s => s.h1.split(':')[0].replace(/^./, c => c.toUpperCase());
export default function Solutions() {
  const demos = solutions.filter(s => s.demo).length;
  return (<div className="xp"><LD data={breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Solutions', path: '/solutions' }])} />
    <HeroType crumb={[{ t: 'Home', href: '/' }, { t: 'Solutions' }]} title="AI solutions" video={pageVideo(0)} lead="Pick the problem you are solving. Each page explains what we build, how it works and what it takes."
      actions={<Actions><Btn p href="/contact">Get a scoped quote</Btn></Actions>} spec={[['Solutions', String(solutions.length)], ['With a live demo', String(demos)], ['First reply', '24 hours']]} />
    {GROUPS.map(([tier, label], gi) => { const list = solutions.filter(s => s.tier === tier); if (!list.length) return null;
      return <Split key={tier} alt={gi % 2 === 1} flip={gi % 2 === 1} video={gi % 2 === 1 ? pageVideo(4 + gi) : undefined} k={tier} title={label} sub={`${list.length} ${list.length === 1 ? 'solution' : 'solutions'}`}><Rows items={list.map(s => [nm(s), s.desc.slice(0, 110) + '…', `/solutions/${s.slug}`])} /></Split>; })}
    <VCta video={pageVideo(11)} title="Not sure which one fits? Tell us the problem." text="An engineer replies within 24 hours with a written plan." label="Get my free AI plan" />
  </div>);
}
