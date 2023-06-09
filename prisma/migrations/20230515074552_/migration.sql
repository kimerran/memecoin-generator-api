-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "mobile" TEXT,
    "twitter" TEXT,
    "walletAddress" TEXT NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoinInstance" (
    "id" SERIAL NOT NULL,
    "creatorId" INTEGER NOT NULL,
    "imageUrl" TEXT,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "contractAddress" TEXT,
    "supplyInEth" TEXT NOT NULL,

    CONSTRAINT "CoinInstance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_walletAddress_key" ON "Account"("walletAddress");

-- AddForeignKey
ALTER TABLE "CoinInstance" ADD CONSTRAINT "CoinInstance_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
