import { likeArticle } from "@/actions/interaction";
import { Article } from "@/db/schema/article";
import { useArticles } from "@/store/articles";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuthGuard } from "./use-auth-guard";
import { debounce, DebouncedFunc, update } from "lodash";
import { toast } from "sonner";

export const useLikes = (article: Article) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const { session, guard } = useAuthGuard();

  const articles = useArticles((state) => state.articles);
  const setArticles = useArticles((state) => state.setArticles);

  const debouncedLikeRef = useRef<DebouncedFunc<
    (
      shouldLike: boolean,
      isArticleLiked: boolean,
      articleId: number,
      userId: number
    ) => void
  > | null>(null);

  useEffect(() => {
    if (typeof article.isLiked === "boolean") setIsLiked(article.isLiked);
    if (typeof article.likeCount === "number") setLikeCount(article.likeCount);

    debouncedLikeRef.current = debounce(
      (
        shouldLike: boolean,
        isArticleLiked: boolean,
        givenArticleId: number,
        userId: number
      ) => {
        if (shouldLike === isArticleLiked) return;
        const id = toast.loading(
          shouldLike ? "Linking article async" : "Unlinking article async"
        );

        likeArticle(givenArticleId, userId, shouldLike)
          .then((res) => {
            toast.success(
              shouldLike ? "Article liked!" : "Removed from liked!",
              {
                id,
              }
            );
          })
          .catch((err) => {
            setIsLiked(!shouldLike);
            setLikeCount((count) => (shouldLike ? count - 1 : count + 1));
            updateArticleLikeState(givenArticleId, !shouldLike);
            console.log("Error occurred while liking the article:", err);
            toast.error("Error occured while liking the article", { id });
          });
      },
      500
    );
    return () => debouncedLikeRef.current?.cancel(); // clean up on unmount
  }, []);

  const updateArticleLikeState = (
    articleId: number,
    newLikedState: boolean
  ) => {
    const updatedArticles = articles.map((art) => {
      if (art.id === articleId && typeof art.likeCount === "number") {
        return {
          ...art,
          isLiked: newLikedState,
          likeCount: newLikedState
            ? art.likeCount + 1
            : Math.max(art.likeCount - 1, 0),
        };
      }
      return art;
    });
    setArticles(updatedArticles);
  };

  const handleLike = guard(() => {
    const newLikedState = !isLiked;

    setIsLiked(newLikedState);
    setLikeCount((count) => (newLikedState ? count + 1 : count - 1));

    updateArticleLikeState(article.id, newLikedState);

    debouncedLikeRef.current?.(
      newLikedState,
      article.isLiked ?? false,
      article.id,
      Number(session.data?.user?.id)
    );
  });

  return { handleLike, isLiked, likeCount };
};
