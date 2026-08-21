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
    blurb: "The production core — clone, configure, ship.",
    features: [
      "GitHub Repo Access",
      "Next.js + Supabase Core",
      "Stripe SaaS Billing & Webhooks",
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
    blurb: "The agency kit — rules, whitepaper, unlimited apps.",
    features: [
      "Everything in Standard",
      "Premium UI Components",
      "10x .cursorrules files",
      "Advanced Caching Whitepaper",
    ],
    highlighted: true,
    href: LEMON_SQUEEZY_STORE_URL,
    ctaLabel: "Buy Enterprise — $349",
  },
] as const;
