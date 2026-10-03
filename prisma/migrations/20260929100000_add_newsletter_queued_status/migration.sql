-- A campaign waiting for its send job to start (DRAFT -> QUEUED -> SENDING).
ALTER TYPE "NewsletterCampaignStatus" ADD VALUE 'QUEUED' AFTER 'DRAFT';
