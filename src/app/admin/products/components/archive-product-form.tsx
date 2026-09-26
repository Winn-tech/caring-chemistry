"use client";

import { archiveProduct } from "../actions";

export function ArchiveProductForm({ id, name }: { id: string; name: string }) {
  return <form action={archiveProduct} onSubmit={(event) => { if (!window.confirm(`Archive “${name}”? It will be removed from the storefront but preserved for order history.`)) event.preventDefault(); }}><input name="id" type="hidden" value={id} /><button className="text-sm font-medium text-red-700 hover:text-red-900" type="submit">Archive</button></form>;
}
