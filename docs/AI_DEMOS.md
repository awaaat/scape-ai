# Live AI demos: how they work and how to turn them on

## What is real
| Demo | What runs | Needs a key? |
|---|---|---|
| **Assistant** (`/lab#assistant`, home) | Streams answers from a real model through `/api/chat`, grounded in a numbered knowledge base with citations. Users can add their own documents and the model uses them immediately. Rate, copy, regenerate, follow-ups, analytics are real. | Yes, for the full intelligence |
| **Agent** (`/lab#agents`) | A real model picks and calls tools (`lookup_customer`, `get_order`, `list_charges`, `issue_refund`, `create_ticket`) against sample data via `/api/agent`. Refunds only request approval. | Yes |
| **Model training** | Real backpropagation in the browser. Real exports, real click-to-query inference. | No |
| **Benchmarks** | Real re-weighting and Elo maths, real CSV and JSONL exports. The model scores are sample data. | No |
| **Document AI** | Real rule-based extraction on text you paste or upload, with real validation. | No |

## Turn on the live model
1. Create a key at console.anthropic.com and **set a monthly spend limit there first**.
2. Add `ANTHROPIC_API_KEY` (and optionally `ANTHROPIC_MODEL`) to the server environment: `.env.local` locally, Vercel project settings in production. Redeploy.
3. Open the assistant. The badge changes from **Demo engine** to **Live AI**.

## Without a key
Chat falls back to a built-in retrieval engine. It never replies with a refusal, but it can only paraphrase the knowledge base, so it is
not "intelligent" in the way the live model is. The badge says **Demo engine** so nobody is misled. The agent shows scripted scenarios.

## How the assistant is kept honest and useful (`app/api/chat/route.js`)
- Company facts come only from the knowledge base and are cited as [n]; the model is told never to invent prices, policies, dates or order status.
- It must always give a helpful answer: general knowledge is labelled as general guidance, gaps become a concrete next step plus an offer to hand off. No bare "I don't know".
- Harmful or privacy-violating requests are declined briefly with a safe alternative.
- Replies end with machine-readable follow-up suggestions (and an optional `::action:: start` that renders the Start-a-project button).

## Protecting your bill (`lib/guard.js`)
Per-IP limits (chat 12/min and 120/h, agent 6/min and 40/h), same-origin check, input caps (10 messages, 1,500 chars each, 6 extra docs),
and `max_tokens` 700. The limiter is in-memory, so on serverless it is best effort: for a high-traffic launch add a shared store (Upstash/Redis)
and keep the spend cap in the Anthropic console.

## Editing the knowledge bases
`lib/kb.js` holds the three assistants (Scape AI concierge, Northwind support, Contoso HR). Edit the concierge text to match your real offer, prices policy and locations.
