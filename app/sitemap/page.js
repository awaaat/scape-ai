import Link from 'next/link';
import { withOG } from '@/lib/seo';
import PageHero from '@/components/PageHero';
import { services, industries, audiences } from '@/lib/data';
import { solutions } from '@/lib/solutions';
export const metadata = withOG({ title: 'Site map', description: 'Every page on the Scape AI website.', alternates: { canonical: '/sitemap' } });
const L = ({ items }) => items.map(([t, h]) => <Link key={h} href={h}>{t}</Link>);
export default function SiteMap() {
  return (<><PageHero crumbs={[{ t: 'Home', href: '/' }, { t: 'Site map' }]} title="Site map" lead="Every page, in one place." video={3} />
    <section><div className="wrap smap">
      <div><b>Company</b><L items={[['Home', '/'], ['About', '/about'], ['AI Lab', '/lab'], ['Contact', '/contact'], ['Privacy policy', '/privacy'], ['Terms of use', '/terms'], ['Cookie policy', '/cookies']]} /></div>
      <div><b>AI Stack</b><L items={services.map(s => [s.name, `/services/${s.slug}`])} /></div>
      <div><b>Solutions</b><L items={[['All solutions', '/solutions'], ...solutions.map(x => [x.title, `/solutions/${x.slug}`])]} /></div>
      <div><b>Industries</b><L items={industries.map(s => [s.name, `/industries/${s.slug}`])} /></div>
      <div><b>Who we serve</b><L items={audiences.map(s => [s.name, `/for/${s.slug}`])} /></div>
      {services.map(s => <div key={s.slug}><b>{s.name} for</b><L items={audiences.map(a => [a.name, `/services/${s.slug}/for/${a.slug}`])} /></div>)}
    </div></section></>);
}
