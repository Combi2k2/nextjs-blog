import { prisma } from '@/lib/prisma';

// In-memory cache for tag counts
let tagCountCache: { [key: string]: number } | null = null;
let cacheTimestamp: number = 0;
let isFirstDeploy: boolean = true;

// Cache TTL (5 minutes)
const CACHE_TTL = 5 * 60 * 1000;

/**
 * Get tag counts from cache or database
 */
export async function getTagCounts(): Promise<{ [key: string]: number }> {
  const now = Date.now();
  
  // On first deploy, always load from database
  if (isFirstDeploy || !tagCountCache) {
    console.log('First deploy or empty cache - loading all blogs to count tags...');
    await refreshTagCountCache();
    isFirstDeploy = false;
    return tagCountCache!;
  }
  
  // Return cached data if it's still valid
  if ((now - cacheTimestamp) < CACHE_TTL) {
    return tagCountCache;
  }
  
  // Cache expired, refresh it
  await refreshTagCountCache();
  return tagCountCache!;
}

/**
 * Refresh tag count cache from database
 */
async function refreshTagCountCache(): Promise<void> {
  console.log('Refreshing tag count cache...');
  const blogs = await prisma.blog.findMany({
    select: { tags: true }
  });
  
  const tagCounts: { [key: string]: number } = {};
  
  blogs.forEach((blog) => {
    blog.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  
  // Update cache
  tagCountCache = tagCounts;
  cacheTimestamp = Date.now();
}

/**
 * Add tags to the cache when a blog is created
 */
export function addTagsToCache(tags: string[]): void {
  if (!tagCountCache) return;
  
  console.log('Adding tags to cache:', tags);
  tags.forEach(tag => {
    tagCountCache![tag] = (tagCountCache![tag] || 0) + 1;
  });
}

/**
 * Update tags in cache when a blog is updated
 */
export function updateTagsInCache(oldTags: string[], newTags: string[]): void {
  if (!tagCountCache) return;
  
  console.log('Updating tags in cache - old:', oldTags, 'new:', newTags);
  
  // Remove old tags
  oldTags.forEach(tag => {
    if (tagCountCache![tag]) {
      tagCountCache![tag]--;
      if (tagCountCache![tag] === 0) {
        delete tagCountCache![tag];
      }
    }
  });
  
  // Add new tags
  newTags.forEach(tag => {
    tagCountCache![tag] = (tagCountCache![tag] || 0) + 1;
  });
}

/**
 * Remove tags from cache when a blog is deleted
 */
export function removeTagsFromCache(tags: string[]): void {
  if (!tagCountCache) return;
  
  console.log('Removing tags from cache:', tags);
  tags.forEach(tag => {
    if (tagCountCache![tag]) {
      tagCountCache![tag]--;
      if (tagCountCache![tag] === 0) {
        delete tagCountCache![tag];
      }
    }
  });
}

/**
 * Invalidate the tag count cache (fallback method)
 * Call this when you want to force a complete refresh
 */
export function invalidateTagCountCache(): void {
  console.log('Invalidating tag count cache...');
  tagCountCache = null;
  cacheTimestamp = 0;
}

/**
 * Get total blog count from database
 */
export async function getTotalBlogCount(): Promise<number> {
  return await prisma.blog.count();
}

