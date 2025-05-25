"use client";

import { createComment, fetchComments } from "@/actions/comments";
import { Comment, SortOption } from "@/db/schema/comments";
import { useState } from "react";
import { toast } from "sonner";

export const useComments = (articleId: number, userId: number) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>("top");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const [nextId, setNextId] = useState(1);

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

  // Fetch comments when the component mounts
  // useEffect(() => {
  const getComments = (parentId: string | undefined) => {
    if (!isLoading) {
      setIsLoading((oldstate) => true);
      const toastId = toast.loading("Fetching comments...");
      console.log(
        "Fetching comments for articleId in get comments ========== ",
        articleId
      );
      fetchComments({ articleId, parentId: Number(parentId) ?? undefined })
        .then((fetchedComments) => {
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
  };

  const addComment = async (text: string, parentId: number | undefined) => {
    let toastId;
    try {
      toastId = toast.loading("Adding comment...");
      const newComment = await createComment(text, articleId, userId, parentId);
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

  const likeComment = (id: number) => {
    setComments((prevComments) =>
      prevComments.map((comment) => {
        if (comment.id === id) {
          // If already isLiked, unlike it
          if (comment.isLiked) {
            return {
              ...comment,
              isLiked: false,
              likes: comment.likeCount - 1,
            };
          }

          // If isDisliked, remove dislike and add like
          if (comment.isDisliked) {
            return {
              ...comment,
              isLiked: true,
              isDisliked: false,
              likes: comment.likeCount + 1,
              dislikes: comment.dislikeCount - 1,
            };
          }

          // If neither isLiked nor isDisliked, add like
          return {
            ...comment,
            isLiked: true,
            likes: comment.likeCount + 1,
          };
        }
        return comment;
      })
    );
  };

  const dislikeComment = (id: number) => {
    setComments((prevComments) =>
      prevComments.map((comment) => {
        if (comment.id === id) {
          // If already isDisliked, remove dislike
          if (comment.isDisliked) {
            return {
              ...comment,
              isDisliked: false,
              dislikes: comment.dislikeCount - 1,
            };
          }

          // If isLiked, remove like and add dislike
          if (comment.isLiked) {
            return {
              ...comment,
              isLiked: false,
              isDisliked: true,
              likes: comment.likeCount - 1,
              dislikes: comment.dislikeCount + 1,
            };
          }

          // If neither isLiked nor isDisliked, add dislike
          return {
            ...comment,
            isDisliked: true,
            dislikes: comment.dislikeCount + 1,
          };
        }
        return comment;
      })
    );
  };

  return {
    getComments,
    comments,
    addComment,
    likeComment,
    dislikeComment,
    sortOption,
    setSortOption,
    isLoading,
    error,
  };
};
