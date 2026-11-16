import { withOG } from '@/lib/seo';
import Legal from '@/components/Legal';
export const metadata = withOG({ title: 'Cookie policy', description: 'The cookies and local storage Scape AI uses, and how to control them.', alternates: { canonical: '/cookies' } });
export default function Cookies() {
  return (<Legal title="Cookie policy" lead="What this site stores in your browser, and how to control it." video={9}>
    <h2>Essential storage</h2><p>The site remembers that you have answered the cookie notice and keeps the state of the project flow you are working in. These are needed for the site to work and do not track you.</p>
    <h2>Analytics</h2><p>With your consent we use Google Analytics 4 with IP anonymisation to see which pages are useful. Analytics and advertising storage are denied by default and only switch on after you choose Accept.</p>
    <h2>Changing your choice</h2><p>Clear this site&apos;s data in your browser settings to see the notice again, or block cookies in your browser. Blocking essential storage may stop parts of the site from working.</p>
    <h2>More</h2><p>See the <a href="/privacy">privacy policy</a> for how personal data is handled.</p>
  </Legal>);
}
