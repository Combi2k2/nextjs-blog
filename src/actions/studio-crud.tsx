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

// Project Management Actions

async function resolveProjectThumbnail(formData: FormData): Promise<string | null> {
    const file = formData.get("thumbnailFile") as File | null;
    if (file && file.size > 0) {
        const timestamp = Date.now();
        const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const key = `projects/${timestamp}-${cleanName}`;
        const buffer = Buffer.from(await file.arrayBuffer());
        await uploadFile(key, buffer, file.type);
        return key;
    }
    return (formData.get("thumbnailKey") as string) || null;
}

export async function createProject(formData: FormData) {
    const name = formData.get("name") as string;
    const desc = formData.get("desc") as string;
    const link = (formData.get("link") as string) || null;
    const thumbnailKey = await resolveProjectThumbnail(formData);

    await prisma.project.create({
        data: { name, desc, thumbnailKey, link }
    });

    revalidatePath("/projects");
    revalidatePath("/studio/projects");
    redirect("/studio/projects");
}

export async function updateProject(id: string, formData: FormData) {
    const name = formData.get("name") as string;
    const desc = formData.get("desc") as string;
    const link = (formData.get("link") as string) || null;
    const thumbnailKey = await resolveProjectThumbnail(formData);

    await prisma.project.update({
        where: { id },
        data: { name, desc, thumbnailKey, link }
    });

    revalidatePath("/projects");
    revalidatePath("/studio/projects");
    redirect("/studio/projects");
}

export async function deleteProject(id: string) {
    await prisma.project.delete({ where: { id } });
    revalidatePath("/projects");
    revalidatePath("/studio/projects");
    redirect("/studio/projects");
}

// Gallery Management Actions

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
            const fileSizeMB = (file.size / 1024 / 1024).toFixed(2);
            throw new Error(`File size too large (${fileSizeMB}MB). Maximum size is 50MB.`);
        }

        // Check file type for images
        const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
        if (!imageTypes.includes(file.type)) {
            throw new Error(`Unsupported file type: ${file.type}. Please upload an image file (JPEG, PNG, GIF, WebP, or SVG).`);
        }

        // Create file key
        const timestamp = Date.now();
        const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const baseFolder = folder || 'gallery';
        const key = `${baseFolder}/${timestamp}-${cleanFileName}`;

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

export async function getGalleryImagesWithUrls(folder: string = 'gallery', maxKeys: number = 1000) {
    try {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
        const rawImages = await listFiles(folder, maxKeys, imageExtensions);
        const images = rawImages.sort((a, b) => (b.lastModified?.getTime() ?? 0) - (a.lastModified?.getTime() ?? 0));

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

