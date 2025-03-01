"use server";

import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation";

export async function createBlog(formData: FormData) {
    await prisma.blog.create({
        data: {
            title: formData.get("title") as string,
            slug: (formData.get("title") as string)
                .replace(/\s+/g, "-")
                .toLowerCase(),
            content: formData.get("content") as string,
            excerpt: formData.get("summary") as string,
            tags: (formData.get("tags") as string)
                .split(',')
                .map((tag: string) => tag.trim())
                .filter((tag: string) => tag !== '')
        }
    });
    redirect("/blogs");
}