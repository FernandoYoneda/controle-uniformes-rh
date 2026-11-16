-- CreateTable
CREATE TABLE "uniform_products" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "uniform_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "uniform_sizes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "uniform_sizes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "uniform_variants" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sizeId" TEXT NOT NULL,
    "stockNew" INTEGER NOT NULL DEFAULT 0,
    "stockUsed" INTEGER NOT NULL DEFAULT 0,
    "stockDiscarded" INTEGER NOT NULL DEFAULT 0,
    "averageCost" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "uniform_variants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uniform_products_code_key" ON "uniform_products"("code");

-- CreateIndex
CREATE UNIQUE INDEX "uniform_sizes_name_key" ON "uniform_sizes"("name");

-- CreateIndex
CREATE INDEX "uniform_variants_sizeId_idx" ON "uniform_variants"("sizeId");

-- CreateIndex
CREATE UNIQUE INDEX "uniform_variants_productId_sizeId_key" ON "uniform_variants"("productId", "sizeId");

-- AddForeignKey
ALTER TABLE "uniform_variants" ADD CONSTRAINT "uniform_variants_productId_fkey" FOREIGN KEY ("productId") REFERENCES "uniform_products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "uniform_variants" ADD CONSTRAINT "uniform_variants_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "uniform_sizes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
