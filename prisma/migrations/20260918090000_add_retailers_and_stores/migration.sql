CREATE TYPE "RetailerType" AS ENUM ('ONLINE');

CREATE TABLE "Retailer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "RetailerType" NOT NULL DEFAULT 'ONLINE',
    "country" TEXT,
    "websiteUrl" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Retailer_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProductRetailer" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "retailerId" TEXT NOT NULL,
    "externalProductUrl" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "externalPrice" DECIMAL(12,2),
    "lastCheckedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ProductRetailer_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Store" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "latitude" DECIMAL(9,6),
    "longitude" DECIMAL(9,6),
    "openingHours" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ProductRetailer_productId_retailerId_key" ON "ProductRetailer"("productId", "retailerId");
CREATE INDEX "Retailer_isActive_priority_name_idx" ON "Retailer"("isActive", "priority", "name");
CREATE INDEX "ProductRetailer_productId_isAvailable_idx" ON "ProductRetailer"("productId", "isAvailable");
CREATE INDEX "ProductRetailer_retailerId_isAvailable_idx" ON "ProductRetailer"("retailerId", "isAvailable");
CREATE INDEX "Store_isActive_country_state_city_name_idx" ON "Store"("isActive", "country", "state", "city", "name");

ALTER TABLE "ProductRetailer" ADD CONSTRAINT "ProductRetailer_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProductRetailer" ADD CONSTRAINT "ProductRetailer_retailerId_fkey" FOREIGN KEY ("retailerId") REFERENCES "Retailer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
