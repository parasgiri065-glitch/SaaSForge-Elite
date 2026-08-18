import type { ComponentType } from "react";
import { IconCard, IconLayout, IconSpark, IconUsers } from "@/components/ui/icons";

export type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

export const APP_NAV: readonly NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: IconLayout },
  { href: "/agents", label: "AI Agent", icon: IconSpark },
  { href: "/settings/billing", label: "Billing", icon: IconCard },
  { href: "/settings/team", label: "Team", icon: IconUsers },
];
