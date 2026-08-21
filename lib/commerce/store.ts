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
    blurb: "One production SaaS. Ship this weekend.",
    features: [
      "Full source — Next.js 16, Supabase, Stripe",
      "Exactly one production domain",
      "Auth, RLS tenancy, billing webhooks",
      "Lifetime updates for this copy",
    ],
    highlighted: false,
    href: LEMON_SQUEEZY_STORE_URL,
    ctaLabel: "Buy Standard",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    priceUsd: 349,
    priceLabel: "$349",
    blurb: "Unlimited apps. Client and agency work included.",
    features: [
      "Everything in Standard",
      "Unlimited production domains",
      "Agency / client delivery permitted",
      "Enterprise Cursor rules + whitepapers",
    ],
    highlighted: true,
    href: LEMON_SQUEEZY_STORE_URL,
    ctaLabel: "Buy Enterprise",
  },
] as const;
