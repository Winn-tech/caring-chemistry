/*
  Warnings:

  - The `direction` column on the `AnnouncementBar` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "AnnouncementDirection" AS ENUM ('LEFT', 'RIGHT');

-- AlterTable
ALTER TABLE "AnnouncementBar" DROP COLUMN "direction",
ADD COLUMN     "direction" "AnnouncementDirection" NOT NULL DEFAULT 'LEFT';
