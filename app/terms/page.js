import { withOG } from '@/lib/seo';
import Legal from '@/components/Legal';
export const metadata = withOG({ title: 'Terms of use', description: 'The terms for using the Scape AI website and live demos.', alternates: { canonical: '/terms' } });
export default function Terms() {
  return (<Legal title="Terms of use" lead="The rules for using this website and its live demos." video={7}>
    <h2>Using the site</h2><p>You may use this website for lawful purposes. Do not attempt to disrupt it, probe it for vulnerabilities without permission, scrape it at scale or use the demos to generate unlawful or harmful content.</p>
    <h2>Live demos</h2><p>Demos are illustrations. Results, pass rates, scores and ROI figures shown in them are simulated or based on sample data and are not guarantees or published benchmark results. Do not rely on a demo for professional, legal, medical or financial decisions.</p>
    <h2>Services</h2><p>Paid work is governed by a written scope, timeline and price agreed before work starts. If a signed agreement conflicts with these terms, the agreement prevails.</p>
    <h2>Intellectual property</h2><p>The site design, text and code are owned by Scape Data Solutions or its licensors. Ownership of deliverables is set out in each engagement agreement.</p>
    <h2>No warranty</h2><p>The site is provided as is. To the extent the law allows, we are not liable for indirect or consequential loss arising from use of the site or the demos.</p>
    <h2>Governing law</h2><p>These terms are governed by the laws of Kenya, and the courts of Kenya have jurisdiction, unless the law of your country requires otherwise.</p>
    <h2>Contact</h2><p>Questions about these terms: <a href="mailto:info@scapedatasolutions.com">info@scapedatasolutions.com</a>.</p>
  </Legal>);
}
