import { likeArticle } from "@/actions/interaction/articleInteractions";
import { Article } from "@/db/schema/article";
import { useEffect, useRef, useState } from "react";
import { useAuthGuard } from "./use-auth-guard";
import { debounce, DebouncedFunc } from "lodash";
import { toast } from "sonner";
import chalk from "chalk";

export const useLikes = (article: Article) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const { session, guard } = useAuthGuard();

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

    if (!debouncedLikeRef.current) {
      console.log("Initializing debouncedLikeRef");
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
            .then((res: boolean) => {
              if (res)
                toast.success(
                  shouldLike ? "Article liked!" : "Removed from liked!",
                  {
                    id,
                  }
                );
              else {
                // setIsLiked(!shouldLike);
                setLikeCount((count) => (shouldLike ? count - 1 : count + 1));
                console.log(
                  chalk.redBright("Error liking article, reverting state")
                );
              }
            })
            .catch((err) => {
              setIsLiked(!shouldLike);
              setLikeCount((count) => (shouldLike ? count - 1 : count + 1));
              //   updateArticleLikeState(givenArticleId, !shouldLike);
              console.log("Error occurred while liking the article:", err);
              toast.error("Error occured while liking the article", { id });
            });
        },
        1000
      );
    }
    return () => {
      // Only runs on unmount
      console.log("Cleaning up debouncedLikeRef");
      debouncedLikeRef.current?.cancel();
    };
  }, []);

  const handleLike = guard(() => {
    if (!debouncedLikeRef.current) return;

    const newLikedState = !isLiked;

    setIsLiked(newLikedState);
    setLikeCount((count) => (newLikedState ? count + 1 : count - 1));

    debouncedLikeRef.current?.(
      newLikedState,
      article.isLiked ?? false,
      article.id,
      Number(session.data?.user?.id)
    );
  });

  return { handleLike, isLiked, likeCount };
};
