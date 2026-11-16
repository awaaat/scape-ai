import { withOG } from '@/lib/seo';
import { Bg } from '@/components/BgVideo';
import { pageVideo } from '@/lib/media';
import { AutoOpen, StartButton } from '@/components/ProjectFlow';
export const metadata = withOG({ title: 'Start a project', description: 'Tell us what you are building. An AI expert replies within 24 hours.', alternates: { canonical: '/contact' } });
export default function Contact() {
  return (<section className="page"><Bg name={pageVideo(2)} dim={0.3} side /><AutoOpen /><div className="wrap" style={{ maxWidth: 820 }}><h1>Start a project</h1>
    <p className="lead" style={{ margin: '0 0 28px' }}>Four short steps. An AI expert replies within 24 hours.</p><StartButton />
    <div className="pf-nx" style={{ marginTop: 56 }}>{['We read your request and match an expert to it', 'A 30-minute scoping call to understand goals and data', 'A written proposal with scope, milestones and cost'].map((t, i) => <div key={t}><b>0{i + 1}</b>{t}</div>)}</div></div></section>);
}
