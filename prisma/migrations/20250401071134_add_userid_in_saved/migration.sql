/*
  Warnings:

  - Added the required column `userId` to the `saved` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "saved" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "saved" ADD CONSTRAINT "saved_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
