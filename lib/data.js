export const BASE = process.env.NEXT_PUBLIC_BASE_URL || 'https://ai.scapedatasolutions.com';
export const services = [
 {slug:'ai-strategy',name:'AI Strategy',tag:'Roadmaps that actually ship',desc:'Find the AI use cases worth building, size the value, and get a sequenced roadmap your team can execute.',items:['Opportunity and ROI assessment','Data and infrastructure readiness audit','Build, buy or partner analysis','90-day execution roadmap']},
 {slug:'ai-development',name:'AI Development',tag:'Production models and agents',desc:'Custom LLM applications, agents, RAG systems and ML models, engineered for production from day one.',items:['LLM apps and autonomous agents','RAG and knowledge systems','Fine-tuning and model optimization','CI/CD and MLOps pipelines']},
 {slug:'ai-evaluation',name:'AI Evaluation',tag:'Know if your model is good',desc:'Rigorous human and automated evaluation of models and agents: quality, safety, bias and regression testing.',items:['Custom benchmark design','Expert human evaluation and RLHF data','Red-teaming and safety testing','Continuous regression monitoring']},
 {slug:'data-services',name:'Data Services',tag:'Training data you can trust',desc:'Collection, labeling, cleaning and synthetic data pipelines with quality controls built in.',items:['Annotation and labeling at scale','Data cleaning and enrichment','Synthetic data generation','Quality assurance workflows']},
 {slug:'ai-integration',name:'AI Integration',tag:'Plug AI into your stack',desc:'Connect AI to your CRM, ERP, support desk and internal tools without rebuilding your systems.',items:['API and workflow integration','Legacy system connectors','Security and access controls','Monitoring and observability']},
 {slug:'ai-analytics',name:'AI Analytics',tag:'Decisions from your data',desc:'Predictive models, forecasting and natural-language analytics that turn raw data into decisions.',items:['Forecasting and prediction','Natural-language BI','Anomaly detection','Executive dashboards']},
 {slug:'ai-talent',name:'AI Talent',tag:'Vetted AI engineers on demand',desc:'Access ML engineers, data scientists and AI product leads, matched to your project and timeline.',items:['ML and LLM engineers','Data scientists and analysts','AI product and delivery leads','Flexible team augmentation']},
 {slug:'managed-ai',name:'Managed AI',tag:'We run it for you',desc:'Ongoing operation, monitoring and improvement of your AI systems under clear service levels.',items:['24/7 monitoring and incident response','Model retraining and tuning','Cost and latency optimization','Monthly performance reviews']}
];
export const industries = [
 {slug:'finance',name:'Finance',desc:'Fraud detection, risk modeling, document intelligence and compliance automation.',uses:['Fraud and anomaly detection','KYC and document processing','Risk and credit modeling']},
 {slug:'healthcare',name:'Healthcare',desc:'Clinical documentation, triage support and operational AI with privacy built in.',uses:['Clinical note summarization','Patient routing and triage','Claims and coding automation']},
 {slug:'retail',name:'Retail and E-commerce',desc:'Demand forecasting, personalization and AI-powered customer support.',uses:['Demand forecasting','Product search and recommendations','Support automation']},
 {slug:'logistics',name:'Logistics',desc:'Route optimization, predictive maintenance and supply-chain visibility.',uses:['Route and load optimization','Predictive maintenance','ETA and delay prediction']},
 {slug:'legal',name:'Legal',desc:'Contract analysis, research assistants and review workflows with human oversight.',uses:['Contract review','Legal research assistants','e-Discovery triage']},
 {slug:'telecom',name:'Telecom',desc:'Churn prediction, network analytics and agent-assist for large support operations.',uses:['Churn prediction','Network anomaly detection','Agent-assist copilots']},
 {slug:'education',name:'Education',desc:'Personalize learning, support educators, and simplify administration.',uses:['Personalized learning assistants','Marking and feedback support','Admissions and administration automation']},
 {slug:'agriculture',name:'Agriculture',desc:'Improve yields, monitor crops and livestock, and streamline supply chains.',uses:['Crop health and yield prediction','Livestock and field monitoring','Produce demand and supply-chain forecasting']}
];
export const audiences = [
 {slug:'individuals',name:'Individuals',desc:'Independent builders, researchers and consultants who need expert AI help without an agency retainer.'},
 {slug:'small-business',name:'Small Business',desc:'Lean teams that want practical AI wins fast, with predictable scope and cost.'},
 {slug:'enterprise',name:'Enterprise',desc:'Large organizations that need governance, security, scale and dedicated delivery teams.'}
];
export const bySlug = (arr, s) => arr.find(x => x.slug === s);
export const faqFor = (s) => [
 [`What does ${s.name} include?`, s.items.join('; ') + '.'],
 [`How long does a ${s.name} engagement take?`, 'Most engagements start with a scoped discovery in the first week, followed by milestone-based delivery. Timelines are agreed in writing before work begins.'],
 [`How do you protect our data?`, 'Work runs under NDA with role-based access, encrypted storage and an audit trail. Enterprise engagements can use your own cloud environment.']
];

export const detail = {
 'ai-strategy':{problem:'Most AI programs stall between pilot and production because use cases, data and ownership were never aligned.',outcomes:['A ranked backlog of use cases with value and effort estimates','A readiness scorecard across data, security and skills','A funded 90-day plan with named owners'],stack:['Value modeling','Data audit','Governance','Build vs buy','Vendor review','Roadmapping']},
 'ai-development':{problem:'Demos are easy. Reliable agents and models that handle real traffic, edge cases and cost limits are not.',outcomes:['Working software in production, not slideware','Tested prompts, tools and retrieval with versioning','Observability for cost, latency and quality'],stack:['LLM APIs','Open-weight models','Vector search','Agent frameworks','Python and TypeScript','CI/CD']},
 'ai-evaluation':{problem:'Teams ship models they cannot measure. Without independent evaluation, regressions and safety gaps reach users first.',outcomes:['Benchmarks built around your real tasks','Expert human scoring with inter-rater checks','Red-team findings ranked by severity'],stack:['Custom benchmarks','LLM-as-judge','Human review','Red-teaming','Regression suites','Reporting']},
 'data-services':{problem:'Model quality is capped by data quality. Inconsistent labels and gaps quietly cap every result downstream.',outcomes:['Clear labeling guidelines and golden sets','Measured annotation quality, not assumed','Documented provenance for every dataset'],stack:['Annotation tooling','Golden sets','Active learning','Synthetic data','Deduplication','Quality audits']},
 'ai-integration':{problem:'AI that lives outside your workflow does not get used. Value comes from connecting it to the systems your teams already run.',outcomes:['AI inside your CRM, support and internal tools','Secure access with least-privilege permissions','Fallbacks when a model or API fails'],stack:['REST and webhooks','Event streams','SSO and RBAC','ETL','Legacy adapters','Monitoring']},
 'ai-analytics':{problem:'Dashboards describe the past. Teams need forecasts and answers they can trust, in plain language.',outcomes:['Forecasts with stated error ranges','Natural-language questions over governed data','Alerts on anomalies before they escalate'],stack:['Time-series models','Text-to-SQL','Feature stores','BI tools','Anomaly detection','Experimentation']},
 'ai-talent':{problem:'Hiring AI specialists takes months, and the wrong hire is costly. Projects need the right people quickly.',outcomes:['Pre-vetted specialists matched to your stack','Fast start with flexible team size','Hands-on delivery leadership if you need it'],stack:['ML engineers','LLM engineers','Data scientists','MLOps','AI product leads','Researchers']},
 'managed-ai':{problem:'Launching is the start. Models drift, costs creep and usage changes, so someone has to own operations.',outcomes:['Monitoring with defined response times','Scheduled retraining and evaluation','Monthly review of quality, cost and roadmap'],stack:['Monitoring','Drift detection','Incident response','Cost control','Retraining','Reporting']}
};
export const deliver = [
 {t:'Scope',h:'Agree what success looks like',p:'A short discovery turns goals into measurable requirements, risks and a delivery plan.',b:['Success metrics defined up front','Data and access reviewed','Fixed milestones in writing']},
 {t:'Build',h:'Ship in short, visible increments',p:'Work lands in weekly increments you can see and test, not in a final reveal.',b:['Weekly demos','Shared repository and docs','Security review throughout']},
 {t:'Evaluate',h:'Prove it works before launch',p:'Every release passes an evaluation gate with automated and human checks.',b:['Task-specific benchmarks','Regression tracking','Clear go or no-go report']},
 {t:'Operate',h:'Hand over or keep it running',p:'Transfer everything to your team, or have us operate it under agreed service levels.',b:['Runbooks and training','Optional managed service','Quarterly improvement plan']}
];
