"use server";

import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { listFiles, uploadFile, deleteFile, getFileUrl } from "@/lib/aws-s3";
import { addTagsToCache, updateTagsInCache, removeTagsFromCache } from "@/utils/tag-cache";

export async function createBlog(formData: FormData) {
    const title = formData.get("title") as string;
    const tags = (formData.get("tags") as string)
        .split(',')
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag !== '');

    const blog = await prisma.blog.create({
        data: {
            title: title,
            content: formData.get("content") as string,
            excerpt: formData.get("summary") as string,
            tags: tags
        }
    });

    // Add new tags to cache
    addTagsToCache(tags);
    
    revalidatePath("/blogs");
    revalidatePath(`/blogs/${blog.id}`);
    revalidatePath("/studio/blogs");
    redirect("/studio/blogs");
}

export async function updateBlog(id: string, formData: FormData) {
    const title = formData.get("title") as string;
    const newTags = (formData.get("tags") as string)
        .split(',')
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag !== '');

    // Get old tags before updating
    const oldBlog = await prisma.blog.findUnique({
        where: { id },
        select: { tags: true }
    });

    const blog = await prisma.blog.update({
        where: {
            id: id,
        },
        data: {
            title: title,
            content: formData.get("content") as string,
            excerpt: formData.get("summary") as string,
            tags: newTags
        }
    });

    // Update tags in cache
    if (oldBlog) {
        updateTagsInCache(oldBlog.tags, newTags);
    }
    
    revalidatePath("/blogs");
    revalidatePath(`/blogs/${blog.id}`);
    revalidatePath("/studio/blogs");
    redirect("/studio/blogs");
}

export async function deleteBlog(id: string) {
    // Get tags before deleting
    const blog = await prisma.blog.findUnique({
        where: { id },
        select: { tags: true }
    });

    await prisma.blog.delete({
        where: {
            id: id,
        },
    });

    // Remove tags from cache
    if (blog) {
        removeTagsFromCache(blog.tags);
    }
    
    revalidatePath("/blogs");
    revalidatePath("/studio/blogs");
    redirect("/studio/blogs");
}

// Gallery Management Actions

export async function getGalleryImages(folder: string = '', maxKeys: number = 1000) {
    try {
        // Filter for image files only
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
        return await listFiles(folder, maxKeys, imageExtensions);
    } catch (error) {
        console.error('Error fetching gallery images:', error);
        throw new Error('Failed to fetch gallery images');
    }
}

export async function uploadGalleryFile(formData: FormData) {
    try {
        const file = formData.get('file') as File;
        const folder = formData.get('folder') as string || '';
        
        if (!file) {
            throw new Error('No file provided');
        }

        // Validate file size (max 50MB for general files)
        const maxSize = 50 * 1024 * 1024; // 50MB
        if (file.size > maxSize) {
            throw new Error('File size too large. Maximum size is 50MB.');
        }

        // Create file key
        const timestamp = Date.now();
        const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const key = folder ? `${folder}/${timestamp}-${cleanFileName}` : `${timestamp}-${cleanFileName}`;

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to S3
        await uploadFile(key, buffer, file.type);

        revalidatePath('/gallery');
        revalidatePath('/studio/gallery');
        return { success: true, key, message: 'File uploaded successfully' };
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
}

// Legacy function for backward compatibility
export async function uploadGalleryImage(formData: FormData) {
    return uploadGalleryFile(formData);
}

export async function deleteGalleryFile(key: string) {
    try {
        await deleteFile(key);
        revalidatePath('/gallery');
        revalidatePath('/studio/gallery');
        return { success: true, message: 'File deleted successfully' };
    } catch (error) {
        console.error('Error deleting file:', error);
        throw new Error('Failed to delete file');
    }
}

// Legacy function for backward compatibility
export async function deleteGalleryImage(key: string) {
    return deleteGalleryFile(key);
}

export async function getGalleryFileUrl(key: string) {
    try {
        return await getFileUrl(key);
    } catch (error) {
        console.error('Error getting file URL:', error);
        throw new Error('Failed to get file URL');
    }
}

// Legacy function for backward compatibility
export async function getGalleryImageUrl(key: string) {
    return getGalleryFileUrl(key);
}

// Enhanced function to get images with their URLs
export async function getGalleryImagesWithUrls(folder: string = '', maxKeys: number = 1000) {
    try {
        // Filter for image files only
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
        const images = await listFiles(folder, maxKeys, imageExtensions);
        
        // Get URLs for all images
        const imagesWithUrls = await Promise.all(
            images.map(async (image) => {
                try {
                    const url = await getFileUrl(image.key);
                    return { ...image, url };
                } catch (error) {
                    console.error(`Error getting URL for ${image.key}:`, error);
                    return { ...image, url: null };
                }
            })
        );

        return imagesWithUrls;
    } catch (error) {
        console.error('Error fetching gallery images with URLs:', error);
        throw new Error('Failed to fetch gallery images');
    }
}

