import { z, defineCollection, reference } from "astro:content";

export const collections = {
  course_chapters: defineCollection({
    type: "data",
    schema: z.object({
      title: z.string(),
      index: z.number(),
    }),
  }),
  course_lessons: defineCollection({
    type: "content",
    schema: z.object({
      title: z.string(),
      description: z.string(),
      image: z
        .object({
          src: z.string(),
          alt: z.string(),
        })
        .optional(),
      index: z.number(),
      chapter: reference("course_chapters"),
      pubDate: z
        .string()
        .or(z.date())
        .transform((val) => new Date(val)),
      isPaid: z.boolean().optional(),
    }),
  }),
  blogs: defineCollection({
    type: "content",
    schema: z.object({
      title: z.string(),
      description: z.string(),
      image: z.object({
        src: z.string(),
        alt: z.string(),
      }),
      pubDate: z
        .string()
        .or(z.date())
        .transform((val) => new Date(val)),
    }),
  }),
};
