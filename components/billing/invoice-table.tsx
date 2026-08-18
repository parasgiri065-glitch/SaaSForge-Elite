import type { Invoice } from "@/types/billing";
import { formatUsd } from "@/types/billing";
import { IconExternal } from "@/components/ui/icons";

interface InvoiceTableProps {
  invoices: Invoice[];
}

const STATUS_CLASS: Record<Invoice["status"], string> = {
  paid: "text-emerald-700 dark:text-emerald-300",
  open: "text-amber-700 dark:text-amber-300",
  void: "text-zinc-500",
  uncollectible: "text-red-600 dark:text-red-400",
};

export function InvoiceTable({ invoices }: InvoiceTableProps) {
  const hasMocks = invoices.some((invoice) => invoice.isMock);

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between gap-3 border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
        <h2 className="text-sm font-semibold">Invoice history</h2>
        {hasMocks ? (
          <p className="text-xs text-zinc-500">Sample data until Stripe invoices sync</p>
        ) : null}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <thead className="bg-zinc-50 text-xs tracking-wide text-zinc-500 uppercase dark:bg-zinc-900/80">
            <tr>
              <th className="px-5 py-3 font-medium">Invoice</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Amount</th>
              <th className="px-5 py-3 font-medium">
                <span className="sr-only">Receipt</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr
                key={invoice.id}
                className="border-t border-zinc-100 dark:border-zinc-800"
              >
                <td className="px-5 py-3 font-medium">{invoice.number}</td>
                <td className="px-5 py-3 text-zinc-600 dark:text-zinc-400">
                  {invoice.issuedAt}
                </td>
                <td className={`px-5 py-3 capitalize ${STATUS_CLASS[invoice.status]}`}>
                  {invoice.status}
                </td>
                <td className="px-5 py-3 tabular-nums">
                  {formatUsd(invoice.amountCents)}
                </td>
                <td className="px-5 py-3 text-right">
                  {invoice.hostedUrl ? (
                    <a
                      href={invoice.hostedUrl}
                      className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400"
                    >
                      View
                      <IconExternal className="h-3.5 w-3.5" />
                    </a>
                  ) : (
                    <span className="text-zinc-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="divide-y divide-zinc-100 md:hidden dark:divide-zinc-800">
        {invoices.map((invoice) => (
          <li
            key={invoice.id}
            className="flex items-start justify-between gap-3 px-5 py-4"
          >
            <div>
              <p className="text-sm font-medium">{invoice.number}</p>
              <p className="text-xs text-zinc-500">{invoice.issuedAt}</p>
              <p className={`mt-1 text-xs capitalize ${STATUS_CLASS[invoice.status]}`}>
                {invoice.status}
              </p>
            </div>
            <p className="text-sm font-medium tabular-nums">
              {formatUsd(invoice.amountCents)}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
