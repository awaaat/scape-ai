import './globals.css';
import Script from 'next/script';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Nav, Footer } from '@/components/Chrome';
import ProjectFlow from '@/components/ProjectFlow';
import VideoPauser from '@/components/VideoPauser';
import { GlobalFx, Cookie } from '@/components/Interactive';
import SiteBg from '@/components/SiteBg';
import { BASE, ORG_ID, LD } from '@/lib/seo';

const TITLE = 'AI Systems for Businesses, Enterprises and Individuals | Scape AI';
const DESC = 'Scape AI implements AI systems end to end for enterprises, small and mid-sized businesses and individuals: strategy, agents, custom models, automation, evaluation, data and managed operations.';
const GA = process.env.NODE_ENV === 'production' ? (process.env.NEXT_PUBLIC_GA_ID || 'G-QZMP8M7TW6') : '';   // same GA4 property as the parent site unless overridden

export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#05070d' };
export const metadata = {
  metadataBase: new URL(BASE),
  title: { default: TITLE, template: '%s | Scape AI' },
  description: DESC,
  applicationName: 'Scape AI', authors: [{ name: 'Scape AI', url: BASE }], creator: 'Scape AI', publisher: 'Scape AI',
  keywords: ['ai chatbot development', 'llm evaluation services', 'rag development', 'ai agent development', 'fine tune llm', 'mcp server development', 'ai consulting'],
  icons: { icon: [{ url: '/favicon.ico?v=4', sizes: 'any' }, { url: '/favicon-32.png?v=4', type: 'image/png', sizes: '32x32' }, { url: '/favicon-16.png?v=4', type: 'image/png', sizes: '16x16' }, { url: '/icon-192.png?v=4', type: 'image/png', sizes: '192x192' }], apple: [{ url: '/apple-touch-icon.png?v=4', sizes: '180x180' }] },
  manifest: '/site.webmanifest',
  openGraph: { type: 'website', siteName: 'Scape AI', title: TITLE, description: DESC, locale: 'en_US' },   // image comes from app/opengraph-image.png
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 } },
  verification: process.env.NEXT_PUBLIC_GSC_TOKEN ? { google: process.env.NEXT_PUBLIC_GSC_TOKEN } : undefined,
  formatDetection: { telephone: false, email: false, address: false },
};
const SCHEMA = { '@context': 'https://schema.org', '@graph': [
  { '@type': 'Organization', '@id': ORG_ID, name: 'Scape AI', url: BASE, logo: { '@type': 'ImageObject', url: `${BASE}/icon-512.png`, width: 512, height: 512 }, image: `${BASE}/opengraph-image`, description: DESC, email: 'info@scapedatasolutions.com',
    parentOrganization: { '@type': 'Organization', name: 'Scape Data Solutions', url: 'https://www.scapedatasolutions.com' }, contactPoint: [{ '@type': 'ContactPoint', contactType: 'sales', email: 'info@scapedatasolutions.com', availableLanguage: ['English'] }] },
  { '@type': 'WebSite', '@id': `${BASE}/#site`, url: BASE, name: 'Scape AI', inLanguage: 'en', publisher: { '@id': ORG_ID } }] };

export default function Root({ children }) {
  return (<html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}><body>
    {GA && <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});gtag('js',new Date());gtag('config','${GA}',{anonymize_ip:true});` }} /></>}
    <LD data={SCHEMA} />
    <noscript><div style={{ padding: 40, textAlign: 'center', fontFamily: 'Arial, sans-serif', background: '#fff', color: '#000' }}><h1>Scape AI</h1><p>AI systems for businesses, enterprises and individuals.</p><p>For the best experience, please enable JavaScript.</p>
      <nav><a href="/">Home</a> | <a href="/solutions">Solutions</a> | <a href="/services/ai-evaluation">AI Evaluation</a> | <a href="/lab">AI Lab</a> | <a href="/contact">Contact</a></nav></div></noscript>
    <SiteBg /><GlobalFx /><VideoPauser /><Nav />{children}<Footer /><Cookie /><ProjectFlow />
  </body></html>);
}
