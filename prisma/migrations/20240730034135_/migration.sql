/*
  Warnings:

  - You are about to drop the column `userId` on the `links` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "links" DROP CONSTRAINT "links_userId_fkey";

-- AlterTable
ALTER TABLE "links" DROP COLUMN "userId";
