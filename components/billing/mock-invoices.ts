import type { Invoice } from "@/types/billing";

export const MOCK_INVOICES: Invoice[] = [
  {
    id: "in_mock_004",
    number: "INV-2026-004",
    issuedAt: "2026-07-01",
    amountCents: 4900,
    currency: "usd",
    status: "paid",
    hostedUrl: null,
    isMock: true,
  },
  {
    id: "in_mock_003",
    number: "INV-2026-003",
    issuedAt: "2026-06-01",
    amountCents: 4900,
    currency: "usd",
    status: "paid",
    hostedUrl: null,
    isMock: true,
  },
  {
    id: "in_mock_002",
    number: "INV-2026-002",
    issuedAt: "2026-05-01",
    amountCents: 4900,
    currency: "usd",
    status: "paid",
    hostedUrl: null,
    isMock: true,
  },
  {
    id: "in_mock_001",
    number: "INV-2026-001",
    issuedAt: "2026-04-01",
    amountCents: 2900,
    currency: "usd",
    status: "void",
    hostedUrl: null,
    isMock: true,
  },
];
