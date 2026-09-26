"use client";

import { motion } from "framer-motion";
import { ProductCard } from "./product-card";
import type { ProductCardData } from "@/lib/shop/types";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
};

interface ProductGridProps {
  products: ProductCardData[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4"
    >
      {products.map((product, i) => (
        <motion.div key={product.id} variants={item}>
          <ProductCard product={product} priority={i < 4} />
        </motion.div>
      ))}
    </motion.div>
  );
}
