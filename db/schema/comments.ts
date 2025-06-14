import { z } from "zod";

export type SortOption = "top" | "newest" | "oldest";

export interface Comment {
  id?: number;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
  articleId: number;
  authorId: number;
  parentId?: number | null;

  likeCount: number;
  isLiked?: boolean;

  dislikeCount: number;
  isDisliked?: boolean;

  author: {
    id: number;
    name: string;
    profilePic?: string | null;
  };

  replies?: Comment[];
  repliesCount: number;
}

export const CommentSchema: z.ZodType<Comment> = z.lazy(() =>
  z.object({
    id: z.number().optional(),
    content: z.string().min(1),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),

    articleId: z.number(),
    authorId: z.number(),
    parentId: z.number().nullable().optional(),

    likeCount: z.number(),
    isLiked: z.boolean().optional(),

    dislikeCount: z.number(),
    isDisliked: z.boolean().optional(),

    author: z.object({
      id: z.number(),
      name: z.string(),
      profilePic: z.string().optional().nullable(),
    }),

    replies: z.array(CommentSchema).optional(),
    repliesCount: z.number(),
  })
);

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
