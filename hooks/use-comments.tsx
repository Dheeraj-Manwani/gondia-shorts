"use client";

import { createComment, fetchComments } from "@/actions/comments";
import { Comment, SortOption } from "@/db/schema/comments";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuthGuard } from "./use-auth-guard";
import chalk from "chalk";
import { debouncedCommentInteraction, sleep } from "./hook-actions";

export const useComments = (articleId: number) => {
  const { session, guardAsync } = useAuthGuard();
  const [comments, setComments] = useState<Comment[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>("top");
  const [isLoading, setIsLoading] = useState(false);
  const [isReplyLoading, setIsReplyLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const [nextId, setNextId] = useState(1);

  useEffect(() => {
    console.log(chalk.redBright("Use Comments Hook Initialized"));
  }, []);

  // Sort comments when sortOption changes
  // useEffect(() => {
  //   let sortedComments = [...comments];

  //   switch (sortOption) {
  //     case "top":
  //       sortedComments.sort((a, b) => b.likes - a.likes);
  //       break;
  //     case "newest":
  //       // Since we don't have actual dates, we'll sort by ID in reverse (assuming higher ID = newer)
  //       sortedComments.sort((a, b) => b.id - a.id);
  //       break;
  //     case "oldest":
  //       // Since we don't have actual dates, we'll sort by ID (assuming lower ID = older)
  //       sortedComments.sort((a, b) => a.id - b.id);
  //       break;
  //   }

  //   setComments(sortedComments);
  // }, [sortOption]);

  const getComments = (parentId: string | undefined) => {
    if (!isLoading) {
      setIsLoading((oldstate) => true);
      const toastId = toast.loading("Fetching comments...");
      console.log(
        "Fetching comments for articleId in get comments ========== ",
        articleId
      );
      fetchComments({
        articleId,
        parentId: Number(parentId) ?? undefined,
        userId: Number(session.data?.user?.id),
      })
        .then((fetchedComments) => {
          console.log(
            chalk.greenBright("Fetched comments successfully:"),
            fetchedComments
          );
          setComments(fetchedComments);
          toast.success("Comments fetched successfully", { id: toastId });
        })
        .catch((error) => {
          toast.error("Failed to fetch comments", { id: toastId });
          setError("Failed to fetch comments" + error);
          console.error("Error fetching comments:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    // ! for dev
    // if (!isLoading) {
    //   setIsLoading(true);
    //   const id = toast.info("Sleeping.......");
    //   sleep(2000).then(() => {
    //     setComments([
    //       {
    //         id: 4,
    //         content: "New comment",
    //         createdAt: new Date("2025-06-12T14:31:50.755Z"),
    //         updatedAt: new Date("2025-06-12T15:18:58.171Z"),
    //         articleId: 36,
    //         authorId: 4,
    //         parentId: null,
    //         likeCount: 0,
    //         dislikeCount: 1,
    //         author: {
    //           id: 4,
    //           name: "Dheeraj Manwani",
    //           profilePic:
    //             "https://lh3.googleusercontent.com/a/ACg8ocJ0vh6A_VHuszJ_LaA3y1iN4C5jdY0aJgJOvJqYAniQ2OQRhg=s96-c",
    //         },
    //         isLiked: false,
    //         isDisliked: false,
    //         repliesCount: 0,
    //       },
    //       {
    //         id: 1,
    //         content: "dcvfsd",
    //         createdAt: new Date("2025-06-08T08:26:38.159Z"),
    //         updatedAt: new Date("2025-06-12T14:27:59.175Z"),
    //         articleId: 36,
    //         authorId: 4,
    //         parentId: null,
    //         likeCount: 0,
    //         dislikeCount: 0,
    //         author: {
    //           id: 4,
    //           name: "Dheeraj Manwani",
    //           profilePic:
    //             "https://lh3.googleusercontent.com/a/ACg8ocJ0vh6A_VHuszJ_LaA3y1iN4C5jdY0aJgJOvJqYAniQ2OQRhg=s96-c",
    //         },
    //         isLiked: false,
    //         isDisliked: false,
    //         repliesCount: 2,
    //       },
    //     ]);
    //     setIsLoading(false);
    //   });
    //   toast.success("Done ", { id });
    // }
  };

  // Get replies for a comment
  const getReplies = (parentId: number) => {
    const toastId = toast.loading("Fetching comment replies...");
    setIsReplyLoading(true);
    fetchComments({
      articleId,
      parentId: Number(parentId),
      userId: Number(session.data?.user?.id),
    })
      .then((fetchedComments) => {
        setComments((prevComments) => {
          // Find the parent comment and update its replies
          const updatedComments = prevComments.map((comment) => {
            if (comment.id === parentId) {
              return {
                ...comment,
                replies: fetchedComments,
              };
            }
            return comment;
          });
          return updatedComments;
        });
        console.log(
          chalk.greenBright("Fetched replies successfully:"),
          fetchedComments
        );

        toast.success("Replies fetched successfully", { id: toastId });
      })
      .catch((error) => {
        toast.error("Failed to fetch replies", { id: toastId });
      })
      .finally(() => {
        setIsReplyLoading(false);
      });
  };

  // Create a new comment
  const addComment = async (text: string, parentId?: number) => {
    let toastId;
    try {
      toastId = toast.loading("Adding comment...");

      const userId = Number(session.data?.user?.id);
      if (!userId) throw new Error("User not logged in");

      const newComment = await createComment(text, articleId, userId, parentId);

      if (!parentId) {
        setComments((prevComments) => [...prevComments, newComment]);
      } else {
        setComments((prevComments) =>
          prevComments.map((comm) =>
            comm.id === parentId
              ? {
                  ...comm,
                  repliesCount: comm.repliesCount + 1,
                  replies: [newComment, ...(comm.replies ?? [])],
                }
              : comm
          )
        );
      }

      toast.success("Comment added successfully", { id: toastId });
    } catch (e) {
      toast.error("Failed to add comment", { id: toastId });
      setError(
        "Failed to add comment: " + (e instanceof Error ? e.message : String(e))
      );
      console.error("Error adding comment:", e);
    }
  };

  const toggleCommentInteraction = guardAsync(
    async ({
      commentId,
      type,
      replyId,
    }: {
      commentId: number;
      type: "LIKE" | "DISLIKE";
      replyId?: number;
    }) => {
      const isLike = type === "LIKE";
      const targetField = isLike ? "isLiked" : "isDisliked";
      const targetCountField = isLike ? "likeCount" : "dislikeCount";
      const otherField = isLike ? "isDisliked" : "isLiked";
      const otherCountField = isLike ? "dislikeCount" : "likeCount";

      let oldState: boolean = false,
        newState: boolean = false;
      const updatedComments = comments.map((comment) => {
        if (comment.id !== commentId) return comment;

        const newComment = { ...comment };

        // Working on a reply?
        if (replyId) {
          const newReplies = newComment.replies?.map((reply) => {
            if (reply.id !== replyId) return reply;

            const updatedReply = { ...reply };
            oldState = updatedReply[targetField] ?? false;
            newState = !oldState;

            // Toggle opposite state off if it was on
            if (newState && updatedReply[otherField]) {
              updatedReply[otherField] = false;
              updatedReply[otherCountField] = Math.max(
                0,
                updatedReply[otherCountField] - 1
              );
            }

            updatedReply[targetField] = newState;
            updatedReply[targetCountField] += newState ? 1 : -1;

            return updatedReply;
          });

          newComment.replies = newReplies;
        } else {
          oldState = newComment[targetField] ?? false;
          newState = !oldState;

          if (newState && newComment[otherField]) {
            newComment[otherField] = false;
            newComment[otherCountField] = Math.max(
              0,
              newComment[otherCountField] - 1
            );
          }

          newComment[targetField] = newState;
          newComment[targetCountField] += newState ? 1 : -1;
        }
        console.log(
          "old comment =====",
          comment,
          "new comment ========",
          newComment
        );
        return newComment;
      });

      setComments(updatedComments);

      console.log(
        chalk.blueBright(`Optimistically updated ${type.toLowerCase()} state`)
      );

      try {
        // const current = comments.find((c) => c.id === commentId);
        // const isNowLiked =
        //   replyId != null
        //     ? current?.replies?.find((r) => r.id === replyId)?.[targetField]
        //     : current?.[targetField];

        await debouncedCommentInteraction(
          newState,
          oldState,
          articleId,
          replyId ?? commentId,
          Number(session.data?.user?.id),
          type
        );
      } catch (error) {
        console.error(`Failed to sync comment ${type.toLowerCase()}:`, error);
        // TODO: Optional rollback logic
      }
    }
  );

  return {
    session,
    isLoading,
    isReplyLoading,
    error,
    getComments,
    getReplies,
    comments,
    addComment,
    toggleCommentInteraction,
    // likeComment,
    // dislikeComment,
    sortOption,
    setSortOption,
  };
};
