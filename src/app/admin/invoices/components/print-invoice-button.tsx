"use client";

export function PrintInvoiceButton() {
  return <button className="print:hidden rounded-lg border border-primary-300 px-4 py-2.5 text-sm font-semibold text-primary-800 hover:border-primary-500" onClick={() => window.print()} type="button">Print / save PDF</button>;
}
