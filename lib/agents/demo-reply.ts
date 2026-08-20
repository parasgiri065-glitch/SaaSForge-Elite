/**
 * Canned assistant reply used while `/api/ai/stream` is not wired.
 * Exercises bold, lists, and a fenced TypeScript block in the markdown renderer.
 */
export const DEMO_AGENT_REPLY = `I can help you ship this workspace faster.

**What I can do**
- Summarize tenant billing state
- Draft replies with citations
- Walk through RLS policies

\`\`\`ts
const orgId = ctx.orgId; // never chosen by the model
await db.from("projects").select("*").eq("organization_id", orgId);
\`\`\`

Ask me anything about *SaaSForge Elite* — auth, Stripe, or the agent pipeline.`;
