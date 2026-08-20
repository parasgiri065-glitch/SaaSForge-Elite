import type { Invoice } from "@/types/billing";
import { formatUsd } from "@/types/billing";
import { IconExternal } from "@/components/ui/icons";
import { invoiceStatusClasses, layoutClasses } from "@/lib/ui/layout-classes";
import { cn } from "@/lib/ui/cn";

interface InvoiceTableProps {
  invoices: Invoice[];
}

/**
 * Responsive invoice history (table on desktop, list on mobile).
 *
 * @param props.invoices - Rows to render (may include mock samples).
 * @returns A glass section with invoice history.
 */
export function InvoiceTable({ invoices }: InvoiceTableProps) {
  const hasMockInvoices = invoices.some((invoice) => invoice.isMock);

  return (
    <section className={`${layoutClasses.glassCard} overflow-hidden`}>
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
        <h2 className="text-sm font-semibold">Invoice history</h2>
        {hasMockInvoices ? (
          <p className="text-xs text-white/40">Sample data until Stripe invoices sync</p>
        ) : null}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <thead className="bg-white/5 text-xs tracking-wide text-white/40 uppercase">
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
              <tr key={invoice.id} className="border-t border-white/10">
                <td className="px-5 py-3 font-medium">{invoice.number}</td>
                <td className="px-5 py-3 text-white/50">{invoice.issuedAt}</td>
                <td
                  className={cn(
                    "px-5 py-3 capitalize",
                    invoiceStatusClasses[invoice.status],
                  )}
                >
                  {invoice.status}
                </td>
                <td className="px-5 py-3 tabular-nums">
                  {formatUsd(invoice.amountCents)}
                </td>
                <td className="px-5 py-3 text-right">
                  {invoice.hostedUrl ? (
                    <a
                      href={invoice.hostedUrl}
                      className="inline-flex items-center gap-1 text-violet-300"
                    >
                      View
                      <IconExternal className="h-3.5 w-3.5" />
                    </a>
                  ) : (
                    <span className="text-white/25">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="divide-y divide-white/10 md:hidden">
        {invoices.map((invoice) => (
          <li
            key={invoice.id}
            className="flex items-start justify-between gap-3 px-5 py-4"
          >
            <div>
              <p className="text-sm font-medium">{invoice.number}</p>
              <p className="text-xs text-white/40">{invoice.issuedAt}</p>
              <p
                className={cn(
                  "mt-1 text-xs capitalize",
                  invoiceStatusClasses[invoice.status],
                )}
              >
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
