# Personal Blog - Duc Nguyen

Welcome to my personal blog! 🚀  
This website is a place where I share my journey, interests, and technical passions.

## About Me

Hi, my name is **Duc Nguyen** and I'm a highly ambitious, self-motivated, and driven indie software engineer.

I graduated from **École Polytechnique**, Palaiseau, France in 2024 with a **Bachelor of Science in Computer Science and Mathematics**. Ever since I discovered the beauty of mathematics, I’ve been passionate about tinkering, solving problems, and exploring the world of technology.

I have a wide range of hobbies and interests, including:

- Algorithm design
- Keeping up with the latest tech trends
- Listening to philosophy podcasts
- Walking, coding, and reading tech blogs

I firmly believe in lifelong learning — never stopping, never settling. I'm passionate about technology and constantly pushing the boundaries of what’s possible. I'm excited about what the future holds and always open to new opportunities! 🙂

## My Skills

Here are some of the technologies and tools I work with:

- **JavaScript**
- **TypeScript**
- **React**
- **Next.js**
- **Python**
- **FastAPI**
- **C**
- **C++**
- **Git**

---

Thanks for visiting my blog! Feel free to connect or reach out if you'd like to chat about tech, philosophy, or anything interesting. 🚀

---

## 📝 TODO
- [X] Code highlighting feature.
- [X] Blog router (use other method other than slug of the blog title)
- [X] Implement router for CRUD functionality.
- [X] Fix math view problem.
- [X] Put more consideration for the page front-end.
- [X] Blog preview feature.
- [X] Blog inline preview feature.
- [X] Blog draft saving method.
- [X] Blog comment feature.
- [X] Blogs fetch everytime going to blogs endpoint (currently failing when going to blogs after editing prisma studio)
- [X] Image gallery with self-hosted S3 storage.
- [X] Projects page and studio CRUD.
- [ ] Query optimization.
    - [X] `/blogs?tags=`: push filter to DB with `hasEvery` instead of loading all rows.
    - [X] Cache tag counts with `unstable_cache` + `revalidateTag('blogs')` so `/blogs` skips the tag rollup query on cache hits.
    - [X] Batch `findMany + count` into one `$transaction` on `/blogs`.
    - [X] Parallelize blog + comments fetch on `/blogs/[id]`.
    - [X] Drop the pre-check in `createComment`; rely on the FK and catch `P2003`.
    - [X] Add indexes on `Blog.updatedAt`, `Project.createdAt`, `Comment(blogId, timestamp)` — requires `prisma migrate dev` to apply.
    - [X] `/projects`: swap presigned URLs for stable public S3 URLs and drop `unoptimized` so `next/image` can resize, encode webp, and long-cache.
    - [ ] Move to Prisma Accelerate or a pooled connection string.
