"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function ProductDetails({ description, category, stock }: { description: string | null; category: string; stock: number }) {
  const [open, setOpen] = useState<string | null>("description");
  const items = [
    { id: "description", title: "Product description", content: description || "A considered addition to your everyday beauty ritual." },
    { id: "delivery", title: "Delivery and returns", content: "Orders are prepared with care. Contact the team if your order arrives damaged or you need help with a return." },
    { id: "care", title: "Care notes", content: stock > 0 ? "Available to order while stock lasts." : "This product is currently unavailable." },
  ];

  return (
    <div className="divide-y divide-[#dfd1d0] border-y border-[#dfd1d0]">
      {items.map((item) => {
        const expanded = open === item.id;
        return <div key={item.id}>
          <button type="button" onClick={() => setOpen(expanded ? null : item.id)} aria-expanded={expanded} className="flex w-full items-center justify-between py-5 text-left font-display text-lg font-semibold text-primary-950"><span>{item.title}</span><ChevronDown size={18} className={`transition-transform ${expanded ? "rotate-180" : ""}`} /></button>
          {expanded && <p className="max-w-2xl pb-5 text-sm leading-7 text-[#6e5b69]">{item.content}</p>}
        </div>;
      })}
      <p className="py-5 text-xs uppercase tracking-[0.14em] text-[#806d78]">Category · {category}</p>
    </div>
  );
}