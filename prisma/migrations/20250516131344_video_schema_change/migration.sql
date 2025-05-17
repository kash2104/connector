/*
  Warnings:

  - You are about to drop the column `description` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnailUrl` on the `Video` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Video" DROP COLUMN "description",
DROP COLUMN "status",
DROP COLUMN "tags",
DROP COLUMN "thumbnailUrl";
