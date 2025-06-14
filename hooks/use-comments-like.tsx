// import { useEffect, useState } from "react";
// import { useAuthGuard } from "./use-auth-guard";
// import chalk from "chalk";
// import { debouncedCommentLike } from "./hook-actions";

// export const useCommentLikes = (
//   articleId: number,
//   commentId: number,
//   isCommentLiked?: boolean,
//   commnetLikeCount?: number
// ) => {
//   const [isLiked, setIsLiked] = useState<undefined | boolean>(undefined);
//   const [likeCount, setLikeCount] = useState<undefined | number>(undefined);
//   const { session, guardAsync } = useAuthGuard();

//   useEffect(() => {
//     // console.log(
//     //   "Syncing like state with comment data in hook use effect",
//     //   isCommentLiked,
//     //   commnetLikeCount,
//     //   isLiked,
//     //   likeCount
//     // );
//     if (typeof isCommentLiked === "boolean" && isLiked === undefined)
//       setIsLiked(isCommentLiked);
//     if (typeof commnetLikeCount === "number" && likeCount === undefined)
//       setLikeCount(commnetLikeCount);
//   }, []);

//   const handleCommentLike = guardAsync(async () => {
//     const newLikedState = !isLiked;

//     // Optimistically update the UI
//     setIsLiked(newLikedState);
//     setLikeCount((count) =>
//       newLikedState ? (count ?? 0) + 1 : (count ?? 0) - 1
//     );

//     console.log(chalk.blueBright("Optimistically updated like state"));

//     const res = await debouncedCommentLike(
//       newLikedState,
//       isCommentLiked ?? false,
//       articleId,
//       commentId,
//       Number(session.data?.user?.id)
//     );

//     if (!res) {
//       // reverting optimistic update
//       console.log(chalk.blueBright("Reverted optimistic updates", res));

//       setIsLiked(!newLikedState);
//       setLikeCount((count) =>
//         newLikedState ? (count ?? 0) - 1 : (count ?? 0) + 1
//       );
//     }
//   });

//   return { handleCommentLike, isLiked, likeCount };
// };
