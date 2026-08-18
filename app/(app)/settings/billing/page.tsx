import type { Metadata } from "next";
import { BillingPanel } from "@/components/billing/billing-panel";

export const metadata: Metadata = {
  title: "Billing",
  robots: { index: false, follow: false },
};

export default function BillingSettingsPage() {
  return <BillingPanel />;
}
