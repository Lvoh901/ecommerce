-- AlterTable
ALTER TABLE "Category" ADD COLUMN "description" TEXT;

-- CreateTable
CREATE TABLE "UIContent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "group" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "UIContent_key_key" ON "UIContent"("key");
