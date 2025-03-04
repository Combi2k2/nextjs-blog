"use server";

import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createBlog(formData: FormData) {
    const title = formData.get("title") as string;
    const slug = title.replace(/\s+/g, "-").toLowerCase();

    await prisma.blog.create({
        data: {
            title: title,
            slug: slug,
            content: formData.get("content") as string,
            excerpt: formData.get("summary") as string,
            tags: (formData.get("tags") as string)
                .split(',')
                .map((tag: string) => tag.trim())
                .filter((tag: string) => tag !== '')
        }
    });

    revalidatePath("/blogs");
    revalidatePath(`/blogs/${slug}`);
    redirect("/blogs");
}

export async function updateBlog(id: string, formData: FormData) {
    const title = formData.get("title") as string;
    const slug = title.replace(/\s+/g, "-").toLowerCase();

    await prisma.blog.update({
        where: {
            id: id,
        },
        data: {
            title: title,
            slug: slug,
            content: formData.get("content") as string,
            excerpt: formData.get("summary") as string,
            tags: (formData.get("tags") as string)
                .split(',')
                .map((tag: string) => tag.trim())
                .filter((tag: string) => tag !== '')
        }
    });

    revalidatePath("/blogs");
    revalidatePath(`/blogs/${slug}`);
    redirect("/blogs");
}

export async function deleteBlog(id: string) {
    await prisma.blog.delete({
        where: {
            id: id,
        },
    });

    revalidatePath("/blogs");
    redirect("/blogs");
}
