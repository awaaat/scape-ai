import { withOG } from '@/lib/seo';
import { Interlude, VBand, VCta } from '@/components/BgVideo';
import { pageVideo } from '@/lib/media';
import { notFound } from 'next/navigation';
import Offer from '@/components/Offer';
import { audiences, services, deliver, bySlug } from '@/lib/data';
import { HeroPanel, HeroCenter, HeroType, Sec, Head, Split, Rows, Bento, Path, Statement, Actions, Btn } from '@/components/Blocks';
export const generateStaticParams = () => audiences.map(s => ({ slug: s.slug }));
export async function generateMetadata({ params }) { const { slug } = await params; const s = bySlug(audiences, slug); if (!s) return {};
  return withOG({ title: `AI services for ${s.name}`, description: s.desc, alternates: { canonical: `/for/${slug}` } }); }
export default async function Aud({ params }) {
  const { slug } = await params; const s = bySlug(audiences, slug); if (!s) notFound();
  const i = audiences.findIndex(x => x.slug === s.slug), n = s.name.toLowerCase();
  const common = { crumb: [{ t: 'Home', href: '/' }, { t: 'Who we serve' }, { t: s.name }], title: <>AI services for <span className="grad">{s.name}</span></>, lead: s.desc,
    actions: <Actions><Btn p href="/contact">Get started</Btn><Btn href="/lab">Try live demos</Btn></Actions> };
  const svc = services.map(x => [x.name, x.tag, `/services/${x.slug}/for/${s.slug}`]);
  const offer = <Offer initial={slug} lock />;
  const pages = {
    individuals: (<>
      <HeroType {...common} video={pageVideo(9 + i)} spec={[['For', 'Independent builders and consultants'], ['Engagement', 'No agency retainer'], ['Scope', 'Fixed and written down'], ['First reply', '24 hours']]} />
      <Sec><Head k="Offers" title="Specific offers, with a demo for each." /><div style={{ marginTop: 32 }}>{offer}</div></Sec>
      <Split alt k="Services" title={`Every service, tailored for ${n}.`}><Rows items={svc} /></Split>
      <Statement by="How it starts">Tell us the problem. An engineer sends back a written plan with scope, timeline and cost.</Statement>
    </>),
    'small-business': (<>
      <HeroCenter {...common} video={pageVideo(9 + i)} stats={[['Scope', 'Predictable'], ['Cost', 'Agreed up front'], ['First reply', '24 hours']]} />
      <VBand video={pageVideo(13 + i)}><h2>Specific offers, with a demo for each.</h2><div style={{ height: 20 }} />{offer}</VBand>
      <Sec><Head k="Services" title={`Every service, tailored for ${n}.`} /><div style={{ marginTop: 36 }}><Bento items={svc} /></div></Sec>
      <Sec alt><Head k="Delivery" title="How a project runs" /><div style={{ marginTop: 40 }}><Path steps={deliver.map(d => [d.t, d.p])} /></div></Sec>
    </>),
    enterprise: (<>
      <HeroPanel {...common} video={pageVideo(9 + i)} label="What large teams get" rows={[['Governance and security review'], ['Your own cloud environment'], ['Dedicated delivery team'], ['Audit trail on every change']]} />
      <Sec alt><Head k="Offers" title="Specific offers, with a demo for each." /><div style={{ marginTop: 32 }}>{offer}</div></Sec>
      <Split k="Services" title={`Every service, tailored for ${n}.`}><Rows items={svc} /></Split>
      <Interlude compact video={pageVideo(16 + i)} eyebrow="See it before you buy it" title="Every offer comes with a demo you can use." text="Open any of them, run it on your own example, then talk to us."><Btn p href="/lab">Try the live demos</Btn></Interlude>
      <Split alt k="Delivery" title="How a project runs"><Path vertical steps={deliver.map(d => [d.t, d.p])} /></Split>
    </>),
  };
  return (<div className="xp">{pages[slug] || pages.enterprise}
    <VCta video={pageVideo(20 + i)} title="Your first AI win is one 24-hour reply away." text="Tell us the problem. An engineer sends back a written plan with scope, timeline and cost." label="Get my free AI plan" />
  </div>);
}
