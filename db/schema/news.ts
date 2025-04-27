import { z } from "zod";

export const insertUserSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  role: z.enum(["USER", "ADMIN"]).optional().default("USER"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export const insertCategorySchema = z.object({
  name: z.string().min(1),
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;

export const ArticleTypeEnum = z.enum([
  "IMAGE_N_TEXT",
  "VIDEO_N_TEXT",
  "FULL_IMAGE",
  "FULL_VIDEO",
  "YOUTUBE",
]);
export type ArticleType = z.infer<typeof ArticleTypeEnum>;

export const articleSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  content: z.string().min(1),
  imageUrls: z.array(z.string().url()).default([]).optional(),
  videoUrl: z.string().url().optional(),
  type: ArticleTypeEnum,
  sourceText: z.string().min(1),
  sourceLogoUrl: z.string().url().optional(),
  author: z.string().optional(),
  publishedAt: z.date().optional(),
  categoryId: z.number(),
  submittedById: z.number(),
});
export type Article = z.infer<typeof articleSchema>;

export const createArticleSchema = z.object({
  type: ArticleTypeEnum,
  title: z.string().min(1),
  content: z.string().min(1),
  imageUrls: z.array(z.string().url()).default([]).optional(),
  videoUrl: z.string().url().optional(),
  sourceText: z.string().min(1).optional(),
  sourceLogoUrl: z.string().url().optional(),
  author: z.string().optional(),
  categoryId: z.number().optional(),
  submittedById: z.number().optional(),
});

export type CreateArticle = z.infer<typeof createArticleSchema>;
