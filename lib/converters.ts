import { Article } from "@/db/schema/article";
import { InteractionMap } from "@/db/schema/interaction";

export const getInteractionsFromArticles = (
  articles: Article[]
): InteractionMap[] => {
  return articles.map((art) => ({
    articleId: art.id,
    isLiked: art.isLiked ?? false,
    isSaved: art.isSaved ?? false,
    likeCount: art.likeCount ?? 0,
  }));
};
