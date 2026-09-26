-- CreateTable
CREATE TABLE "RetailerClick" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "retailerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RetailerClick_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RetailerClick_createdAt_idx" ON "RetailerClick"("createdAt");

-- CreateIndex
CREATE INDEX "RetailerClick_retailerId_createdAt_idx" ON "RetailerClick"("retailerId", "createdAt");

-- CreateIndex
CREATE INDEX "RetailerClick_productId_createdAt_idx" ON "RetailerClick"("productId", "createdAt");

-- AddForeignKey
ALTER TABLE "RetailerClick" ADD CONSTRAINT "RetailerClick_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RetailerClick" ADD CONSTRAINT "RetailerClick_retailerId_fkey" FOREIGN KEY ("retailerId") REFERENCES "Retailer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
