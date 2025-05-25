// export type Comment = {
//   id: number;
//   username: string;
//   timeAgo: string; // e.g. "2 hours ago", "just now"
//   text: string;
//   likes: number;
//   dislikes: number;
//   liked: boolean;
//   disliked: boolean;
// };

export type SortOption = "top" | "newest" | "oldest";

import { z } from "zod";

export const CommentSchema = z.object({
  id: z.number().optional(), // usually auto-generated
  content: z.string().min(1),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),

  articleId: z.number(),
  authorId: z.number(),

  parentId: z.number().nullable().optional(),

  likeCount: z.number(),
  dislikeCount: z.number(),

  isLiked: z.boolean().optional(),
  isDisliked: z.boolean().optional(),

  author: z.object({
    id: z.number(),
    name: z.string(),
    profilePic: z.string().optional().nullable(),
  }),
});

export type Comment = z.infer<typeof CommentSchema>;

export const InteractionTypeEnum = z.enum(["LIKE", "DISLIKE"]);

export const InteractionSchema = z.object({
  id: z.number().optional(),
  type: InteractionTypeEnum,

  userId: z.number(),

  articleId: z.number().nullable().optional(),
  commentId: z.number().nullable().optional(),

  createdAt: z.date().optional(),
});

export type InteractionInput = z.infer<typeof InteractionSchema>;

export const ReportSchema = z.object({
  id: z.number().optional(),
  reason: z.string().min(5),

  userId: z.number(),

  articleId: z.number().nullable().optional(),
  commentId: z.number().nullable().optional(),

  createdAt: z.date().optional(),
});

export type ReportInput = z.infer<typeof ReportSchema>;
