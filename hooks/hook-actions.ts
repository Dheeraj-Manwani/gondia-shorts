import {
  likeArticle,
  saveArticle,
} from "@/actions/interaction/article-interactions";
import { handleInteraction } from "@/actions/interaction/comment-interactions";
import chalk from "chalk";
import { debounce } from "lodash";
import { toast } from "sonner";

export const debouncedLike = debounce(
  async (
    shouldLike: boolean,
    isArticleLiked: boolean,
    givenArticleId: number,
    userId: number
  ) => {
    if (shouldLike === isArticleLiked)
      return console.log(
        chalk.redBright("No change in like state, skipping debounce")
      );

    console.log(chalk.blueBright("Inside debounce function"));

    const id = toast.loading(
      shouldLike ? "Linking article async" : "Unlinking article async"
    );

    const res = await likeArticle(givenArticleId, userId, shouldLike);
    console.log(chalk.redBright("Async like call completed"), res);

    if (res) {
      toast.success(shouldLike ? "Article liked!" : "Removed from liked!", {
        id,
      });
    } else {
      toast.warning("Already in given state or error occured", { id });
    }

    return res;
  },
  1200
);

export const debouncedSave = debounce(
  async (
    shouldSave: boolean,
    isArticleSaved: boolean,
    articleId: number,
    userId: number
  ) => {
    if (shouldSave === isArticleSaved) return;
    const id = toast.loading(
      shouldSave ? "Saving article..." : "Removing from saved..."
    );

    console.log(chalk.blueBright("Inside debounce function"));

    const res = await saveArticle(articleId, userId, shouldSave);
    if (res) {
      toast.success(shouldSave ? "Article saved!" : "Removed from saved!", {
        id,
      });
    } else {
      // setIsSaved(!shouldSave); // rollback
      // console.error("Save toggle error:", err);
      toast.error("Already saved or error occured", { id });
    }
    console.log(chalk.blueBright(res ? "saved" : "Already saved", res));
  },
  1200
);

// for dev only
export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// export const debouncedCommentLike = debounce(
//   async (
//     shouldLike: boolean,
//     isCommentLiked: boolean,
//     articleId: number,
//     commentId: number,
//     userId: number
//   ) => {
//     if (shouldLike === isCommentLiked) return;

//     console.log(chalk.blueBright("Inside comment debounce function"));

//     const id = toast.loading(
//       shouldLike ? "Linking comment async" : "Unlinking comment async"
//     );

//     const res = await handleInteraction(
//       articleId,
//       userId,
//       commentId,
//       shouldLike
//     );
//     console.log(chalk.redBright("Async like call completed"), res);

//     if (res) {
//       toast.success(shouldLike ? "Article liked!" : "Removed from liked!", {
//         id,
//       });
//     } else {
//       toast.warning("Already in given state or error occured", { id });
//     }

//     return res;
//   },
//   1200
// );

// export const debouncedCommentDisike = debounce(
//   async (
//     shouldDislike: boolean,
//     isCommentDisLiked: boolean,
//     articleId: number,
//     commentId: number,
//     userId: number
//   ) => {
//     if (shouldDislike === isCommentDisLiked) return;

//     console.log(chalk.blueBright("Inside comment debounce function"));

//     const id = toast.loading(
//       shouldDislike ? "Linking comment async" : "Unlinking comment async"
//     );

//     const res = await handleInteraction(
//       articleId,
//       userId,
//       commentId,
//       shouldDislike
//     );
//     console.log(chalk.redBright("Async like call completed"), res);

//     if (res) {
//       toast.success(shouldDislike ? "Article liked!" : "Removed from liked!", {
//         id,
//       });
//     } else {
//       toast.warning("Already in given state or error occured", { id });
//     }

//     return res;
//   },
//   1200
// );

export const debouncedCommentInteraction = debounce(
  async (
    newState: boolean,
    oldState: boolean,
    articleId: number,
    commentId: number,
    userId: number,
    type: "LIKE" | "DISLIKE"
  ) => {
    console.log(
      "params in debounce ==     newState: boolean, oldState: boolean,articleId: number,commentId: number,userId: number,type: LIKE | DISLIKE",
      newState,
      oldState,
      articleId,
      commentId,
      userId,
      type
    );
    if (newState === oldState) return;

    console.log(chalk.blueBright("Inside comment debounce function"));

    const id = toast.loading(
      newState ? `${type} comment async` : `Removing ${type} comment async`
    );

    const res = await handleInteraction(
      articleId,
      userId,
      commentId,
      type,
      newState
    );
    console.log(chalk.redBright("Async like call completed"), res);

    if (res) {
      toast.success(newState ? `Article ${type}!` : `Removed from ${type}!`, {
        id,
      });
    } else {
      toast.warning("Already in given state or error occured", { id });
    }

    return res;
  },
  1200
);
