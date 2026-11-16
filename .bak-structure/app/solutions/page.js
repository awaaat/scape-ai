import { withOG } from '@/lib/seo';
import Link from 'next/link';
import { Bg, Interlude, VBand, VCta } from '@/components/BgVideo';
import { pageVideo } from '@/lib/media';
import { solutions } from '@/lib/solutions';
import { LD, breadcrumbLd } from '@/lib/seo';
import { Crumb } from '@/components/Chrome';
export const metadata = withOG({ title: 'AI Solutions: Chatbots, RAG, Agents, Evaluation and Fine-Tuning', description: 'AI chatbot development, RAG, AI agents, MCP servers, LLM evaluation, red teaming, fine-tuning and private LLMs. Pick your problem and see what we build.', alternates: { canonical: '/solutions' } });
export default function Solutions() {
  return (<><section className="page"><Bg name={pageVideo(4)} dim={0.82} side /><LD data={breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Solutions', path: '/solutions' }])} /><div className="wrap">
    <Crumb items={[{ t: 'Home', href: '/' }, { t: 'Solutions' }]} /><h1>AI solutions</h1><p className="lead" style={{ margin: '0 0 12px' }}>Pick the problem you are solving. Each page explains what we build, how it works and what it takes.</p></div></section>
    <VBand video={pageVideo(8)}><div className="cards">{solutions.map(s => <Link key={s.slug} className="card" href={`/solutions/${s.slug}`}><span className="ar">↗</span><span className="n">{s.tier}</span><h3>{s.h1.split(':')[0].replace(/^./, c => c.toUpperCase())}</h3><p>{s.desc.slice(0, 110)}…</p></Link>)}</div></VBand>
    <VCta video={pageVideo(11)} title="Not sure which one fits? Tell us the problem." text="An engineer replies within 24 hours with a written plan." label="Get my free AI plan" /></>);
}
