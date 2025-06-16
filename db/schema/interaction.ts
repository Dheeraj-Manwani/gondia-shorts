export type InteractionType = "LIKE" | "SAVE" | "DISLIKE" | "SHARE";

export interface InteractionMap {
  articleId: number;
  isLiked: boolean;
  isSaved: boolean;
  likeCount: number;
}
