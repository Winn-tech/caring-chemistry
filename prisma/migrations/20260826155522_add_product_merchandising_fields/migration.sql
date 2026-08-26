-- CreateEnum
CREATE TYPE "ProductBadge" AS ENUM ('NEW', 'BESTSELLER');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "badge" "ProductBadge",
ADD COLUMN     "compareAtPrice" DECIMAL(12,2),
ADD COLUMN     "isBestSeller" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "rating" DECIMAL(2,1),
ADD COLUMN     "reviewCount" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Product_isBestSeller_status_idx" ON "Product"("isBestSeller", "status");
