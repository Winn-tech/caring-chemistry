-- Checkout happens on retail partners' sites, so orders no longer carry a Paystack reference.
-- DropIndex
DROP INDEX "Order_paystackRef_key";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "paystackRef";
