-- WhatsApp / email checkout, BDT pricing, store settings, rate limiting.
-- Written by hand (not `migrate dev`) so it is safe on a database that already has orders.

-- CreateEnum
CREATE TYPE "OrderChannel" AS ENUM ('WHATSAPP', 'EMAIL', 'WEB');
CREATE TYPE "PaymentMethod" AS ENUM ('COD', 'BANGLA_QR');
CREATE TYPE "PaymentStatus" AS ENUM ('UNPAID', 'PAID', 'REFUNDED');
CREATE TYPE "DeliveryZone" AS ENUM ('INSIDE_DHAKA', 'OUTSIDE_DHAKA');

-- AlterEnum (the new value is not used elsewhere in this migration)
ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'CONFIRMED' AFTER 'PENDING';

-- User
ALTER TABLE "User" ADD COLUMN "phone" TEXT;

-- Product: widen money columns, add denormalized filter/sort columns
ALTER TABLE "Product"
  ADD COLUMN "discountPercent" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "ratingAvg" DOUBLE PRECISION NOT NULL DEFAULT 0,
  ADD COLUMN "ratingCount" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "soldCount" INTEGER NOT NULL DEFAULT 0,
  ALTER COLUMN "price" SET DATA TYPE DECIMAL(12,2),
  ALTER COLUMN "comparePrice" SET DATA TYPE DECIMAL(12,2);

-- Prices were stored in USD and displayed x110. Store BDT directly from now on.
UPDATE "Product" SET
  "price" = ROUND("price" * 110),
  "comparePrice" = CASE WHEN "comparePrice" IS NULL THEN NULL ELSE ROUND("comparePrice" * 110) END;

UPDATE "Product" SET "discountPercent" =
  CASE WHEN "comparePrice" IS NOT NULL AND "comparePrice" > "price" AND "comparePrice" > 0
       THEN FLOOR((("comparePrice" - "price") / "comparePrice") * 100)::INTEGER
       ELSE 0 END;

UPDATE "Product" p SET
  "ratingAvg" = COALESCE(r.avg, 0),
  "ratingCount" = COALESCE(r.cnt, 0)
FROM (SELECT "productId", AVG("rating")::DOUBLE PRECISION AS avg, COUNT(*)::INTEGER AS cnt
      FROM "Review" GROUP BY "productId") r
WHERE r."productId" = p."id";

-- Order
DROP INDEX IF EXISTS "Order_stripePaymentId_key";
DROP INDEX IF EXISTS "Order_userId_idx";

ALTER TABLE "Order"
  DROP COLUMN "stripePaymentId",
  ADD COLUMN "orderNumber" TEXT,
  ADD COLUMN "channel" "OrderChannel" NOT NULL DEFAULT 'WHATSAPP',
  ADD COLUMN "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'COD',
  ADD COLUMN "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
  ADD COLUMN "paymentRef" TEXT,
  ADD COLUMN "subtotal" DECIMAL(12,2),
  ADD COLUMN "deliveryFee" DECIMAL(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN "customerName" TEXT,
  ADD COLUMN "customerPhone" TEXT,
  ADD COLUMN "customerEmail" TEXT,
  ADD COLUMN "address" TEXT,
  ADD COLUMN "district" TEXT,
  ADD COLUMN "deliveryZone" "DeliveryZone",
  ADD COLUMN "note" TEXT,
  ADD COLUMN "confirmedAt" TIMESTAMP(3),
  ADD COLUMN "confirmedById" TEXT,
  ADD COLUMN "cancelledAt" TIMESTAMP(3),
  ADD COLUMN "adminNote" TEXT,
  ALTER COLUMN "total" SET DATA TYPE DECIMAL(12,2);

UPDATE "Order" SET "total" = ROUND("total" * 110);

UPDATE "Order" o SET
  "orderNumber" = 'VL-LEGACY-' || UPPER(o."id"), -- full id: guaranteed unique
  "subtotal" = o."total",
  "customerName" = COALESCE(u."name", u."email"),
  "customerPhone" = COALESCE(u."phone", ''),
  "customerEmail" = u."email",
  "address" = COALESCE(o."shippingAddress"->>'street', ''),
  "district" = COALESCE(o."shippingAddress"->>'city', ''),
  "deliveryZone" = 'INSIDE_DHAKA',
  "paymentStatus" = CASE WHEN o."status" IN ('PROCESSING', 'SHIPPED', 'DELIVERED') THEN 'PAID'::"PaymentStatus" ELSE 'UNPAID'::"PaymentStatus" END,
  "channel" = 'WEB'
FROM "User" u
WHERE u."id" = o."userId";

ALTER TABLE "Order"
  ALTER COLUMN "orderNumber" SET NOT NULL,
  ALTER COLUMN "subtotal" SET NOT NULL,
  ALTER COLUMN "customerName" SET NOT NULL,
  ALTER COLUMN "customerPhone" SET NOT NULL,
  ALTER COLUMN "address" SET NOT NULL,
  ALTER COLUMN "district" SET NOT NULL,
  ALTER COLUMN "deliveryZone" SET NOT NULL;

-- OrderItem
ALTER TABLE "OrderItem"
  ADD COLUMN "name" TEXT NOT NULL DEFAULT '',
  ALTER COLUMN "price" SET DATA TYPE DECIMAL(12,2);

UPDATE "OrderItem" SET "price" = ROUND("price" * 110);
UPDATE "OrderItem" oi SET "name" = p."name" FROM "Product" p WHERE p."id" = oi."productId";

-- Sold counts from orders that were not cancelled
UPDATE "Product" p SET "soldCount" = s.qty
FROM (SELECT oi."productId", SUM(oi."quantity")::INTEGER AS qty
      FROM "OrderItem" oi JOIN "Order" o ON o."id" = oi."orderId"
      WHERE o."status" <> 'CANCELLED' AND o."status" <> 'PENDING'
      GROUP BY oi."productId") s
WHERE s."productId" = p."id";

-- CreateTable
CREATE TABLE "StoreSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "whatsappNumber" TEXT NOT NULL DEFAULT '+8801999398675',
    "orderEmail" TEXT,
    "deliveryFeeInside" INTEGER NOT NULL DEFAULT 60,
    "deliveryFeeOutside" INTEGER NOT NULL DEFAULT 120,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoreSettings_pkey" PRIMARY KEY ("id")
);

INSERT INTO "StoreSettings" ("id", "orderEmail", "updatedAt")
VALUES ('default', 'asifuddinahmed123@gmail.com', CURRENT_TIMESTAMP) ON CONFLICT DO NOTHING;

CREATE TABLE "RateLimit" (
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "windowStart" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RateLimit_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE INDEX "Product_isArchived_price_idx" ON "Product"("isArchived", "price");
CREATE INDEX "Product_isArchived_createdAt_idx" ON "Product"("isArchived", "createdAt");
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");
CREATE UNIQUE INDEX "Order_paymentRef_key" ON "Order"("paymentRef");
CREATE INDEX "Order_userId_createdAt_idx" ON "Order"("userId", "createdAt");
CREATE INDEX "Order_status_createdAt_idx" ON "Order"("status", "createdAt");
