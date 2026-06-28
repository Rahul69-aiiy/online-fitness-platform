/*
  Warnings:

  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SessionEnrollment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_trainerId_fkey";

-- DropForeignKey
ALTER TABLE "SessionEnrollment" DROP CONSTRAINT "SessionEnrollment_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "SessionEnrollment" DROP CONSTRAINT "SessionEnrollment_studentId_fkey";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "SessionEnrollment";

-- DropEnum
DROP TYPE "SessionType";
