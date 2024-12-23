/*
  Warnings:

  - You are about to drop the column `cloudStoragePath` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `filename` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Workspace` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Workspace` table. All the data in the column will be lost.
  - Added the required column `description` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnailUrl` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `videoUrl` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Video" DROP COLUMN "cloudStoragePath",
DROP COLUMN "filename",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "thumbnailUrl" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "videoUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Workspace" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";
