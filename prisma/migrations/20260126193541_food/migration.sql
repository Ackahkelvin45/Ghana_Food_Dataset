/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - Added the required column `fullName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserTypes" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "DishTypes" AS ENUM ('YAM', 'PLANTAIN', 'KENKEY', 'BANKU', 'KOKONTE', 'FUFU', 'JOLLOF', 'PLAIN_RICE', 'WAAKYE', 'BREAD', 'KOKO', 'BEANS');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "userType" "UserTypes" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "Submission" (
    "id" SERIAL NOT NULL,
    "dishName" "DishTypes" NOT NULL,
    "noPersonInImage" BOOLEAN NOT NULL DEFAULT false,
    "region" TEXT NOT NULL,
    "town" TEXT,
    "foodObtained" TEXT NOT NULL,
    "foodObtainedOther" TEXT,
    "wantsAcknowledgement" BOOLEAN NOT NULL DEFAULT false,
    "acknowledgedName" TEXT,
    "acknowledgedEmail" TEXT,
    "acknowledgedPhone" TEXT,
    "accuracyConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiceYamPlantainMeta" (
    "id" SERIAL NOT NULL,
    "submissionId" INTEGER NOT NULL,
    "stew" TEXT,
    "stewOther" TEXT,
    "extraItems" TEXT[],
    "extraItemsOther" TEXT,
    "proteinContext" TEXT[],
    "proteinContextOther" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RiceYamPlantainMeta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KokoMeta" (
    "id" SERIAL NOT NULL,
    "submissionId" INTEGER NOT NULL,
    "kokoItems" TEXT[],
    "kokoItemsOther" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KokoMeta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankuFufuKokonteKenkeyMeta" (
    "id" SERIAL NOT NULL,
    "submissionId" INTEGER NOT NULL,
    "soupContext" TEXT,
    "soupContextOther" TEXT,
    "pepper" TEXT[],
    "pepperOther" TEXT,
    "proteinContext" TEXT[],
    "proteinContextOther" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankuFufuKokonteKenkeyMeta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BreadMeta" (
    "id" SERIAL NOT NULL,
    "submissionId" INTEGER NOT NULL,
    "breadType" TEXT,
    "breadTypeOther" TEXT,
    "breadServedWith" TEXT[],
    "breadServedWithOther" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BreadMeta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gob3Meta" (
    "id" SERIAL NOT NULL,
    "submissionId" INTEGER NOT NULL,
    "gob3ServedWith" TEXT[],
    "gob3ServedWithOther" TEXT,
    "proteinContext" TEXT[],
    "proteinContextOther" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gob3Meta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "submissionId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "size" INTEGER,
    "mimeType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Submission_dishName_idx" ON "Submission"("dishName");

-- CreateIndex
CREATE INDEX "Submission_region_idx" ON "Submission"("region");

-- CreateIndex
CREATE INDEX "Submission_createdAt_idx" ON "Submission"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "RiceYamPlantainMeta_submissionId_key" ON "RiceYamPlantainMeta"("submissionId");

-- CreateIndex
CREATE UNIQUE INDEX "KokoMeta_submissionId_key" ON "KokoMeta"("submissionId");

-- CreateIndex
CREATE UNIQUE INDEX "BankuFufuKokonteKenkeyMeta_submissionId_key" ON "BankuFufuKokonteKenkeyMeta"("submissionId");

-- CreateIndex
CREATE UNIQUE INDEX "BreadMeta_submissionId_key" ON "BreadMeta"("submissionId");

-- CreateIndex
CREATE UNIQUE INDEX "Gob3Meta_submissionId_key" ON "Gob3Meta"("submissionId");

-- CreateIndex
CREATE INDEX "Image_submissionId_idx" ON "Image"("submissionId");

-- CreateIndex
CREATE INDEX "Image_type_idx" ON "Image"("type");

-- AddForeignKey
ALTER TABLE "RiceYamPlantainMeta" ADD CONSTRAINT "RiceYamPlantainMeta_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KokoMeta" ADD CONSTRAINT "KokoMeta_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankuFufuKokonteKenkeyMeta" ADD CONSTRAINT "BankuFufuKokonteKenkeyMeta_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BreadMeta" ADD CONSTRAINT "BreadMeta_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gob3Meta" ADD CONSTRAINT "Gob3Meta_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
