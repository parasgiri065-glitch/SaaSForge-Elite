/**
 * Public Lemon Squeezy storefront for SaaSForge Elite licenses.
 * Used by marketing CTAs. Never put secrets here.
 */
export const LEMON_SQUEEZY_STORE_URL = "https://elitesaasforge.lemonsqueezy.com/";

export type LicenseTierId = "standard" | "enterprise";

export type LicenseTier = {
  id: LicenseTierId;
  name: string;
  priceUsd: number;
  priceLabel: string;
  blurb: string;
  features: readonly string[];
  highlighted: boolean;
  href: string;
  ctaLabel: string;
};

export const LICENSE_TIERS: readonly LicenseTier[] = [
  {
    id: "standard",
    name: "Standard",
    priceUsd: 149,
    priceLabel: "$149",
    blurb: "GitHub repo access and the production Standard codebase.",
    features: [
      "GitHub repository access (collaborator invite)",
      "Standard production code — Next.js 16 App Router",
      "Supabase Auth + RLS multi-tenancy",
      "Lemon Squeezy fulfillment webhook",
      "Groq AI streaming agent",
      "One production domain",
    ],
    highlighted: false,
    href: LEMON_SQUEEZY_STORE_URL,
    ctaLabel: "Buy Standard — $149",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    priceUsd: 349,
    priceLabel: "$349",
    blurb: "Everything in Standard, plus the Enterprise Asset Bundle.",
    features: [
      "Everything in Standard",
      "Enterprise code — unlimited production apps",
      "10 production .cursorrules files",
      "Multi-tenant caching whitepaper",
      "Agency / client delivery permitted",
      "Unlimited production domains",
    ],
    highlighted: true,
    href: LEMON_SQUEEZY_STORE_URL,
    ctaLabel: "Buy Enterprise — $349",
  },
] as const;
