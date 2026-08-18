import type { Metadata } from "next";
import { BillingPanel } from "@/components/billing/billing-panel";

export const metadata: Metadata = {
  title: "Demo billing",
  robots: { index: false, follow: false },
};

export default function DemoBillingPage() {
  return <BillingPanel />;
}
