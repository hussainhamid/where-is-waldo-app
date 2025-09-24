/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Characters` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Characters_name_key" ON "public"."Characters"("name");
