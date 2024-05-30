-- AlterTable
ALTER TABLE "Product" ADD COLUMN "deleted_at" DATETIME;

-- AlterTable
ALTER TABLE "SMSToken" ADD COLUMN "deleted_at" DATETIME;

-- AlterTable
ALTER TABLE "User" ADD COLUMN "deleted_at" DATETIME;
