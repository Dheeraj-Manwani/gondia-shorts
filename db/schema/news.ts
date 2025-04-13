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

export const insertArticleSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  imageUrls: z.array(z.string().url()).default([]),
  videoUrl: z.string().url().optional(),
  isVideo: z.boolean().optional().default(false),
  sourceText: z.string().min(1),
  sourceLogoUrl: z.string().url().optional(),
  author: z.string().optional(),
  categoryId: z.number(),
  adminId: z.number(),
});

export type InsertArticle = z.infer<typeof insertArticleSchema>;

export const articleSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  content: z.string().min(1),
  imageUrls: z.array(z.string().url()).default([]),
  videoUrl: z.string().url().optional(),
  isVideo: z.boolean().optional().default(false),
  sourceText: z.string().min(1),
  sourceLogoUrl: z.string().url().optional(),
  author: z.string().optional(),
  publishedAt: z.date().optional(),
  categoryId: z.number(),
  adminId: z.number(),
});
export type Article = z.infer<typeof articleSchema>;
