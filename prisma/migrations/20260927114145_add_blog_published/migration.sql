-- AlterTable
ALTER TABLE "blogs" ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "blogs_updatedAt_idx" ON "blogs"("updatedAt" DESC);

-- CreateIndex
CREATE INDEX "comments_blogId_timestamp_idx" ON "comments"("blogId", "timestamp" DESC);

-- CreateIndex
CREATE INDEX "projects_createdAt_idx" ON "projects"("createdAt" DESC);
