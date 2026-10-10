-- Lets newsletter campaigns continue across days within the email provider's daily allowance:
-- PAUSED status, plus a record of who each campaign was sent to so nobody receives it twice.


-- AlterEnum
ALTER TYPE "NewsletterCampaignStatus" ADD VALUE 'PAUSED' AFTER 'SENDING';

-- CreateTable
CREATE TABLE "NewsletterDelivery" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewsletterDelivery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "NewsletterDelivery_sentAt_idx" ON "NewsletterDelivery"("sentAt");

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterDelivery_campaignId_email_key" ON "NewsletterDelivery"("campaignId", "email");

-- AddForeignKey
ALTER TABLE "NewsletterDelivery" ADD CONSTRAINT "NewsletterDelivery_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "NewsletterCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

