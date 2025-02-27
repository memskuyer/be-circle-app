/*
  Warnings:

  - Made the column `content` on table `threads` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "threads_userId_key";

-- AlterTable
ALTER TABLE "threads" ALTER COLUMN "content" SET NOT NULL;
