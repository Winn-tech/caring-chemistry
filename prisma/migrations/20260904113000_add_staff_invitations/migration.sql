-- AlterTable
ALTER TABLE "User" ADD COLUMN "invitationTokenHash" TEXT,
ADD COLUMN "invitationExpiresAt" TIMESTAMP(3),
ADD COLUMN "invitationAcceptedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "User_invitationTokenHash_key" ON "User"("invitationTokenHash");
