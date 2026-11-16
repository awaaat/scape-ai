export const BASE = process.env.NEXT_PUBLIC_BASE_URL || 'https://ai.scapedatasolutions.com';
export const ORG_ID = `${BASE}/#org`;
export const breadcrumbLd = (items) => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, ...(it.path ? { item: BASE + it.path } : {}) })) });
export const serviceLd = ({ name, description, path }) => ({ '@context': 'https://schema.org', '@type': 'Service', name, description, url: BASE + path, provider: { '@id': ORG_ID }, areaServed: 'Worldwide', serviceType: name });
export const faqLd = (list) => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: list.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) });
export const LD = ({ data }) => <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
// Keyword-targeted titles for the 8 core service pages (titles kept under ~60 chars, descriptions under ~155).
export const serviceSeo = {
  'ai-strategy': ['AI Strategy and Roadmap Consulting', 'Find the AI use cases worth building, size the value and get a 90-day roadmap. AI strategy consulting for enterprises, SMEs and founders.'],
  'ai-development': ['Custom AI Development: LLM Apps, RAG and Agents', 'Custom LLM applications, RAG systems, AI agents and fine-tuned models, engineered for production. Talk to an AI development team.'],
  'ai-evaluation': ['AI and LLM Evaluation Services: Benchmarks and Red Teaming', 'Independent LLM evaluation: custom benchmarks, expert human review, red teaming and regression testing for models and AI agents.'],
  'data-services': ['AI Training Data and Data Annotation Services', 'Data annotation, labeling, cleaning and synthetic data with measured quality. Training data services for LLMs and machine learning.'],
  'ai-integration': ['AI Integration Services for CRM, ERP and Support', 'Connect AI to your CRM, ERP, help desk and internal tools securely, without rebuilding your systems. AI integration and MCP servers.'],
  'ai-analytics': ['Predictive and AI Analytics Services', 'Forecasting, anomaly detection and natural-language analytics that turn raw data into decisions your team can trust.'],
  'ai-talent': ['Hire AI Engineers, ML Engineers and Data Scientists', 'Vetted ML engineers, LLM engineers and AI product leads matched to your project, on flexible terms.'],
  'managed-ai': ['Managed AI Operations and MLOps Services', 'We monitor, retrain and optimize your AI systems under clear service levels: drift, cost and latency control, monthly reviews.'],
};

// Gives every page its OWN og:title / og:url / twitter tags (a page-level openGraph replaces the layout's, so it must be complete).
export const withOG = (m, type = 'website') => {
  const raw = typeof m.title === 'string' ? `${m.title} | Scape AI` : (m.title?.absolute || m.title?.default || 'Scape AI');
  const url = BASE + (m.alternates?.canonical === '/' ? '' : (m.alternates?.canonical || ''));
  return { ...m, openGraph: { type, siteName: 'Scape AI', locale: 'en_US', title: raw, description: m.description, url }, twitter: { card: 'summary_large_image', title: raw, description: m.description } };
};
