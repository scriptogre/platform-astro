import { z, defineCollection, reference } from "astro:content";

export const collections = {
    course_chapters: defineCollection({
        type: 'data',
        schema: z.object({
            title: z.string(),
            index: z.number(),
        }),
    }),
    course_lessons: defineCollection({
        type: 'content',
        schema: z.object({
            title: z.string(),
            index: z.number(),
            chapter: reference('course_chapters'),
        })
    }),
    blogs: defineCollection({
        type: 'content',
        schema: z.object({
            title: z.string()
        })
    })
}
