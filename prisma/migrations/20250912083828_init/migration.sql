/*
  Warnings:

  - The primary key for the `blog` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[slug]` on the table `blog` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `content` to the `blog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `excerpt` to the `blog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `blog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `blog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."blog" DROP CONSTRAINT "blog_pkey",
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "excerpt" TEXT NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "blog_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "blog_slug_key" ON "public"."blog"("slug");
