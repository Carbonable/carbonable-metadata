/*
  Warnings:

  - A unique constraint covering the columns `[slot]` on the table `Collection` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slot` to the `Collection` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Collection" ADD COLUMN     "slot" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Collection_slot_key" ON "Collection"("slot");
