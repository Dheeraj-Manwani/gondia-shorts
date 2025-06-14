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
    // if (!isLoading) {
    //   setIsLoading((oldstate) => true);
    //   const toastId = toast.loading("Fetching comments...");
    //   console.log(
    //     "Fetching comments for articleId in get comments ========== ",
    //     articleId
    //   );
    //   fetchComments({
    //     articleId,
    //     parentId: Number(parentId) ?? undefined,
    //     userId: Number(session.data?.user?.id),
    //   })
    //     .then((fetchedComments) => {
    //       console.log(
    //         chalk.greenBright("Fetched comments successfully:"),
    //         fetchedComments
    //       );
    //       setComments(fetchedComments);
    //       toast.success("Comments fetched successfully", { id: toastId });
    //     })
    //     .catch((error) => {
    //       toast.error("Failed to fetch comments", { id: toastId });
    //       setError("Failed to fetch comments" + error);
    //       console.error("Error fetching comments:", error);
    //     })
    //     .finally(() => {
    //       setIsLoading(false);
    //     });
    // }

    if (!isLoading) {
      setIsLoading(true);
      const id = toast.info("Sleeping.......");
      sleep(2000).then(() => {
        setComments([
          {
            id: 4,
            content: "New comment",
            createdAt: new Date("2025-06-12T14:31:50.755Z"),
            updatedAt: new Date("2025-06-12T15:18:58.171Z"),
            articleId: 36,
            authorId: 4,
            parentId: null,
            likeCount: 0,
            dislikeCount: 1,
            author: {
              id: 4,
              name: "Dheeraj Manwani",
              profilePic:
                "https://lh3.googleusercontent.com/a/ACg8ocJ0vh6A_VHuszJ_LaA3y1iN4C5jdY0aJgJOvJqYAniQ2OQRhg=s96-c",
            },
            isLiked: false,
            isDisliked: false,
            repliesCount: 0,
          },
          {
            id: 1,
            content: "dcvfsd",
            createdAt: new Date("2025-06-08T08:26:38.159Z"),
            updatedAt: new Date("2025-06-12T14:27:59.175Z"),
            articleId: 36,
            authorId: 4,
            parentId: null,
            likeCount: 0,
            dislikeCount: 0,
            author: {
              id: 4,
              name: "Dheeraj Manwani",
              profilePic:
                "https://lh3.googleusercontent.com/a/ACg8ocJ0vh6A_VHuszJ_LaA3y1iN4C5jdY0aJgJOvJqYAniQ2OQRhg=s96-c",
            },
            isLiked: false,
            isDisliked: false,
            repliesCount: 2,
          },
        ]);
        setIsLoading(false);
      });
      toast.success("Done ", { id });
    }
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
  const addComment = async (text: string, parentId: number | undefined) => {
    let toastId;
    try {
      toastId = toast.loading("Adding comment...");
      const newComment = await createComment(
        text,
        articleId,
        Number(session.data?.user?.id),
        parentId
      );
      setComments((prevComments) => [...prevComments, newComment]);
      toast.success("Comment added successfully", { id: toastId });
    } catch (e) {
      toast.error("Failed to add comment", { id: toastId });
      setError("Failed to add comment" + e);
      console.error("Error adding comment:", e);
    }
    // setComments((prevComments) => {
    //   let updatedComments;
    //   if (sortOption === "newest") {
    //     updatedComments = [newComment, ...prevComments];
    //   } else {
    //     updatedComments = [...prevComments, newComment];
    //   }
    //   return updatedComments;
    // });

    // setNextId(nextId + 1);
  };

  const toggleCommentInteraction = guardAsync(
    async ({
      commentId,
      type,
    }: {
      commentId: number;
      type: "LIKE" | "DISLIKE";
    }) => {
      const existingComment = comments.find((com) => com.id === commentId);
      if (!existingComment) return;

      const isLikedField = type === "LIKE" ? "isLiked" : "isDisliked";
      const countField = type === "LIKE" ? "likeCount" : "dislikeCount";
      const otherIsLikedField = type === "LIKE" ? "isDisliked" : "isLiked";
      const otherCountField = type === "LIKE" ? "dislikeCount" : "likeCount";

      const currentState: boolean | undefined = existingComment[isLikedField];
      const newState = !currentState;

      const updatedComments = comments.map((comm) => {
        if (comm.id !== commentId) return comm;

        const newComm = { ...comm };
        if (newState && comm[otherIsLikedField]) {
          newComm[otherIsLikedField] = false;
          newComm[otherCountField] = Math.max(0, newComm[otherCountField] - 1);
        }

        newComm[isLikedField] = newState;
        newComm[countField] += newState ? 1 : -1;

        return newComm;
      });

      setComments(updatedComments);
      console.log(
        chalk.blueBright(`Optimistically updated ${type.toLowerCase()} state`)
      );

      try {
        await debouncedCommentInteraction(
          newState,
          !!currentState,
          articleId,
          commentId,
          Number(session.data?.user?.id),
          type
        );
      } catch (error) {
        console.error(`Failed to sync comment ${type.toLowerCase()}:`, error);
        // Optionally revert
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
