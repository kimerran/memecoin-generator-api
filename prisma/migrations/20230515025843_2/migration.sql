/*
  Warnings:

  - Added the required column `status` to the `CoinInstance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CoinInstance" ADD COLUMN     "status" TEXT NOT NULL;
