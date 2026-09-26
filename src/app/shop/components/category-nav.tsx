import Link from "next/link";
import { CATEGORY_NAV } from "@/lib/shop/constants";

interface CategoryNavProps {
  activeSlug: string;
}

export function CategoryNav({ activeSlug }: CategoryNavProps) {
  return (
    <nav aria-label="Shop categories" className="border-b border-[#e7dfe5] pb-1">
      <ul className="flex gap-6 overflow-x-auto no-scrollbar scroll-px-4">
        {CATEGORY_NAV.map((category) => {
          const isActive = category.slug === activeSlug;
          const href = category.slug === "all" ? "/shop" : `/shop?category=${category.slug}`;
          return (
            <li key={category.slug} className="shrink-0">
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`relative inline-flex py-3 text-sm transition-colors ${
                  isActive
                    ? "text-[#2e2032] font-medium"
                    : "text-[#5b4d5f] hover:text-[#2e2032]"
                }`}
              >
                {category.label}
                {isActive && (
                  <span className="absolute -bottom-px left-0 right-0 h-[2px] bg-[#c88041] rounded-full" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
