import Link from "next/link";

interface BreadcrumbProps {
  category?: string;
}

export function Breadcrumb({ category }: BreadcrumbProps) {
  const items = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    ...(category ? [{ name: category, href: "#" }] : []),
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.href !== "#" ? item.href : undefined,
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="pt-5 text-xs">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ol className="flex items-center gap-1.5 text-[#6c5d6e]">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.name} className="flex items-center gap-1.5">
              {isLast ? (
                <span aria-current="page" className="text-[#2e2032]">
                  {item.name}
                </span>
              ) : (
                <Link href={item.href} className="transition-colors hover:text-[#2e2032]">
                  {item.name}
                </Link>
              )}
              {!isLast && <span aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
