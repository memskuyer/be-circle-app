-- CreateTable
CREATE TABLE "saved" (
    "id" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "saved_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "saved" ADD CONSTRAINT "saved_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "threads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
