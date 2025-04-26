"use client";

import { Comment, SortOption } from "@/db/schema/comments";
import { useState, useEffect } from "react";

export const useComments = (articleId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>("top");
  const [nextId, setNextId] = useState(1);

  // Sort comments when sortOption changes
  useEffect(() => {
    let sortedComments = [...comments];

    switch (sortOption) {
      case "top":
        sortedComments.sort((a, b) => b.likes - a.likes);
        break;
      case "newest":
        // Since we don't have actual dates, we'll sort by ID in reverse (assuming higher ID = newer)
        sortedComments.sort((a, b) => b.id - a.id);
        break;
      case "oldest":
        // Since we don't have actual dates, we'll sort by ID (assuming lower ID = older)
        sortedComments.sort((a, b) => a.id - b.id);
        break;
    }

    setComments(sortedComments);
  }, [sortOption]);

  const addComment = (text: string) => {
    const newComment: Comment = {
      id: nextId,
      username: "@currentUser",
      timeAgo: "just now",
      text,
      likes: 0,
      dislikes: 0,
      liked: false,
      disliked: false,
    };

    setComments((prevComments) => {
      let updatedComments;
      if (sortOption === "newest") {
        updatedComments = [newComment, ...prevComments];
      } else {
        updatedComments = [...prevComments, newComment];
      }
      return updatedComments;
    });

    setNextId(nextId + 1);
  };

  const likeComment = (id: number) => {
    setComments((prevComments) =>
      prevComments.map((comment) => {
        if (comment.id === id) {
          // If already liked, unlike it
          if (comment.liked) {
            return {
              ...comment,
              liked: false,
              likes: comment.likes - 1,
            };
          }

          // If disliked, remove dislike and add like
          if (comment.disliked) {
            return {
              ...comment,
              liked: true,
              disliked: false,
              likes: comment.likes + 1,
              dislikes: comment.dislikes - 1,
            };
          }

          // If neither liked nor disliked, add like
          return {
            ...comment,
            liked: true,
            likes: comment.likes + 1,
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
          // If already disliked, remove dislike
          if (comment.disliked) {
            return {
              ...comment,
              disliked: false,
              dislikes: comment.dislikes - 1,
            };
          }

          // If liked, remove like and add dislike
          if (comment.liked) {
            return {
              ...comment,
              liked: false,
              disliked: true,
              likes: comment.likes - 1,
              dislikes: comment.dislikes + 1,
            };
          }

          // If neither liked nor disliked, add dislike
          return {
            ...comment,
            disliked: true,
            dislikes: comment.dislikes + 1,
          };
        }
        return comment;
      })
    );
  };

  return {
    comments,
    addComment,
    likeComment,
    dislikeComment,
    sortOption,
    setSortOption,
  };
};
