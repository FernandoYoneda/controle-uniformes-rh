-- CreateEnum
CREATE TYPE "UniformMovementType" AS ENUM ('PURCHASE', 'DELIVERY', 'RETURN', 'DISCARD', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "UniformCondition" AS ENUM ('NEW', 'USED');

-- CreateEnum
CREATE TYPE "UniformMovementStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "uniform_stock_movements" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "employeeId" TEXT,
    "type" "UniformMovementType" NOT NULL,
    "condition" "UniformCondition" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitCost" DECIMAL(12,2),
    "status" "UniformMovementStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "requestedBy" TEXT,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "uniform_stock_movements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "uniform_stock_movements_variantId_createdAt_idx" ON "uniform_stock_movements"("variantId", "createdAt");

-- CreateIndex
CREATE INDEX "uniform_stock_movements_employeeId_idx" ON "uniform_stock_movements"("employeeId");

-- CreateIndex
CREATE INDEX "uniform_stock_movements_status_idx" ON "uniform_stock_movements"("status");

-- AddForeignKey
ALTER TABLE "uniform_stock_movements" ADD CONSTRAINT "uniform_stock_movements_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "uniform_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "uniform_stock_movements" ADD CONSTRAINT "uniform_stock_movements_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;
