import { useEffect, useState } from "react";
import { useAuthGuard } from "./use-auth-guard";
import chalk from "chalk";
import { debouncedLike } from "./hook-actions";

export const useLikes = (
  articleId: number,
  isArticleLiked?: boolean,
  articleLikeCount?: number
) => {
  const [isLiked, setIsLiked] = useState<undefined | boolean>(undefined);
  const [likeCount, setLikeCount] = useState<undefined | number>(undefined);
  const { session, guardAsync } = useAuthGuard();

  useEffect(() => {
    // console.log(
    //   "Syncing like state with article data in hook use effect",
    //   isArticleLiked,
    //   articleLikeCount,
    //   isLiked,
    //   likeCount
    // );
    if (typeof isArticleLiked === "boolean" && isLiked === undefined)
      setIsLiked(isArticleLiked);
    if (typeof articleLikeCount === "number" && likeCount === undefined)
      setLikeCount(articleLikeCount);
  }, []);

  const handleLike = guardAsync(async () => {
    const newLikedState = !isLiked;

    // Optimistically update the UI
    setIsLiked(newLikedState);
    setLikeCount((count) =>
      newLikedState ? (count ?? 0) + 1 : (count ?? 0) - 1
    );

    console.log(chalk.blueBright("Optimistically updated like state"));

    const res = await debouncedLike(
      newLikedState,
      isArticleLiked ?? false,
      articleId,
      Number(session.data?.user?.id)
    );

    // if (!res) {
    //   // reverting optimistic update
    //   console.log(chalk.blueBright("Reverted optimistic updates", res));

    //   setIsLiked(!newLikedState);
    //   setLikeCount((count) =>
    //     newLikedState ? (count ?? 0) - 1 : (count ?? 0) + 1
    //   );
    // }
  });

  return { handleLike, isLiked, likeCount };
};
