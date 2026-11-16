"""
PASTE INTO  orders/catalog.py  (backend repo), above the `SITES = {...}` line, then change that line to:

    SITES = {s["key"]: s for s in (THESIS, MAIN, AI)}

That is the only backend change. CORS for https://ai.scapedatasolutions.com is already allowed by your
CORS_ALLOWED_ORIGIN_REGEXES, and http://localhost:5173 is already in _BASE_CORS_ORIGINS.
The front end sends  site="ai"  explicitly, so local development works too.
"""

# ═════════════════════════════════════════════════════════════════════
#  SITE: ai.scapedatasolutions.com  — Scape AI (chatbots, model training, evaluation)
# ═════════════════════════════════════════════════════════════════════
AI = build_site(
    "ai", name="Scape AI",
    hosts=["ai.scapedatasolutions.com"],
    frontend_url="https://ai.scapedatasolutions.com",
    resume_path="/contact",            # reminder emails link to  /contact?resume=<token>  which re-opens the saved flow
    # notify_emails=["you@yourdomain.com"],   # optional: send this site's alerts to different people than ORDER_NOTIFICATION_EMAILS
    categories=[
        {"id": "build", "title": "Build"},
        {"id": "evaluate", "title": "Evaluate and train"},
        {"id": "operate", "title": "Operate and staff"},
    ],
    services=[
        {"slug": "ai-assistants-chatbots", "label": "AI assistants and chatbots", "category": "build",
         "blurb": "Chatbots that answer from your documents, cite sources and hand off to humans."},
        {"slug": "custom-model-training", "label": "Custom model training", "category": "evaluate",
         "blurb": "Fine-tune and evaluate models on your data."},
        {"slug": "evaluation-benchmarks", "label": "Evaluation and benchmarks", "category": "evaluate",
         "blurb": "Benchmarks, human review and red teaming for models and agents."},
        {"slug": "document-workflow-ai", "label": "Document and workflow AI", "category": "build",
         "blurb": "Extract and validate data from invoices, contracts and emails."},
        {"slug": "data-labeling-preparation", "label": "Data labeling and preparation", "category": "evaluate",
         "blurb": "Annotation, cleaning and synthetic data with measured quality."},
        {"slug": "forecasting-analytics", "label": "Forecasting and analytics", "category": "build",
         "blurb": "Predictive models and natural-language analytics."},
        {"slug": "ai-talent", "label": "AI talent", "category": "operate",
         "blurb": "Vetted ML and LLM engineers matched to your project."},
        {"slug": "managed-ai-operations", "label": "Managed AI operations", "category": "operate",
         "blurb": "Monitoring, retraining and optimization under service levels."},
    ],
    options={
        "audience": ["Enterprise", "Small business", "Individual"],
        "deadline_window": ["As soon as possible", "Within 1 to 3 months", "Just exploring"],
        "budget": ["Under $2,000", "$2,000 - $10,000", "$10,000 - $50,000", "$50,000+", "Not sure yet"],
    },
    labels={"audience": "I am a", "interests": "Interested in", "company": "Company", "budget": "Budget range",
            "deadline_window": "Start", "details": "Notes"},
    steps=[
        {"key": "email", "title": "Enter your work email, speak with an AI expert", "input": "form",
         "fields": ["email"], "required": ["email"]},
        {"key": "who", "title": "Tell us who you are", "input": "form+cards",
         "fields": ["name", "audience"], "options_from": "audience", "required": ["name"]},
        {"key": "build", "title": "What do you want to build?", "input": "multi",
         "fields": ["interests"], "required": []},
        {"key": "project", "title": "Tell us about your project", "input": "form",
         "fields": ["company", "phone", "deadline_window", "budget", "details"],
         "options_from": "deadline_window", "required": []},
        {"key": "review", "title": "Review and submit", "input": "review", "fields": [], "required": []},
    ],
    required=("name", "email", "service"),
    promise={"reply_within": "24 hours", "pay_nothing_until_you_agree": True},
)
