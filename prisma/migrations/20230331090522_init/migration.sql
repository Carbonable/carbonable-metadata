/*
  Warnings:

  - You are about to drop the column `collectionId` on the `Token` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[collectionSlot]` on the table `Token` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `collectionSlot` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Token" DROP CONSTRAINT "Token_collectionId_fkey";

-- DropIndex
DROP INDEX "Token_collectionId_key";

-- AlterTable
ALTER TABLE "Token" DROP COLUMN "collectionId",
ADD COLUMN     "collectionSlot" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Token_collectionSlot_key" ON "Token"("collectionSlot");

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_collectionSlot_fkey" FOREIGN KEY ("collectionSlot") REFERENCES "Collection"("slot") ON DELETE RESTRICT ON UPDATE CASCADE;
