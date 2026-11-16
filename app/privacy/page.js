import { withOG } from '@/lib/seo';
import Legal from '@/components/Legal';
export const metadata = withOG({ title: 'Privacy policy', description: 'How Scape AI collects, uses and protects personal data.', alternates: { canonical: '/privacy' } });
const MAIL = 'info@scapedatasolutions.com';
export default function Privacy() {
  return (<Legal title="Privacy policy" lead="What we collect, why we collect it and the choices you have." video={5}>
    <h2>Who we are</h2><p>Scape AI is a division of Scape Data Solutions and is the controller of personal data collected through this website. Contact us at <a href={`mailto:${MAIL}`}>{MAIL}</a>.</p>
    <h2>What we collect</h2>
    <ul><li><b>Project and contact forms:</b> your name, email, company, the details you write and any answers you give in the project flow.</li>
      <li><b>Live demos:</b> text you type into the AI demos is sent to a language model provider to produce a reply. Do not enter confidential or personal data into a demo.</li>
      <li><b>Analytics:</b> if you accept analytics cookies, Google Analytics 4 records anonymised usage such as pages viewed and approximate location. Until you accept, analytics storage is denied.</li>
      <li><b>Technical data:</b> standard server logs such as IP address, browser and request time, used for security and reliability.</li></ul>
    <h2>How we use it</h2><p>To reply to your enquiry, scope and deliver work you ask for, keep the site secure, and understand which pages are useful. We do not sell personal data.</p>
    <h2>Who we share it with</h2><p>Service providers that help us run the site: hosting, form and email delivery, analytics and the AI model provider behind the demos. They may process data only to provide their service. We may also disclose data where the law requires it.</p>
    <h2>How long we keep it</h2><p>Enquiries are kept for as long as needed to respond and for a reasonable period afterwards. Project records are kept for the length of the engagement and the period required for legal and accounting purposes. You can ask us to delete your data earlier.</p>
    <h2>Your rights</h2><p>Under the Kenya Data Protection Act, 2019, and similar laws elsewhere, you may ask to access, correct or delete your personal data, object to or restrict its processing, and withdraw consent at any time. Email <a href={`mailto:${MAIL}`}>{MAIL}</a>. You may also complain to the Office of the Data Protection Commissioner in Kenya.</p>
    <h2>Security</h2><p>We use encrypted connections, access controls and least-privilege permissions. No system is perfectly secure, so please share only what is needed.</p>
    <h2>Children</h2><p>This site is not directed at children and we do not knowingly collect their data.</p>
    <h2>Changes</h2><p>We will update this page when our practices change and revise the date above.</p>
  </Legal>);
}
