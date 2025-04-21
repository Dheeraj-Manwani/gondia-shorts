import React, { useState, useEffect } from "react";
import { formatDate } from "@/lib/helpers";
import { translateUiText } from "@/lib/translateService";
import type { Article } from "@/db/schema/news";

interface Comment {
  id: number;
  username: string;
  avatarUrl: string;
  text: string;
  timestamp: string; // ISO string from API
  likes: number;
}

interface CommentModalProps {
  article: Article;
  isOpen: boolean;
  onClose: () => void;
}

export default function CommentModal({
  article,
  isOpen,
  onClose,
}: CommentModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetch(`/api/comments?articleId=${article.id}`)
      .then((res) => res.json())
      .then((data: Comment[]) => {
        setComments(data);
      })
      .catch((err) => {
        console.error("Failed to load comments:", err);
        setComments([]);
      })
      .finally(() => setLoading(false));
  }, [isOpen, article.id]);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    const text = newComment.trim();
    if (!text) return;

    const temp: Comment = {
      id: Date.now(),
      username: "you",
      avatarUrl: "https://images.unsplash.com/photo-1633332755192-727a05c4013d",
      text,
      timestamp: new Date().toISOString(),
      likes: 0,
    };
    setComments([temp, ...comments]);
    setNewComment("");

    fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ articleId: article.id, text }),
    }).catch((err) => {
      console.error("Failed to post comment:", err);
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg max-h-[85vh] w-full max-w-xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800">
            {translateUiText("Comments")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 p-2 rounded-full hover:bg-gray-200"
            aria-label={translateUiText("Close comments")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          <div className="flex items-start space-x-4 mb-6 pb-4 border-b">
            {article.imageUrls?.[0] && (
              <img
                src={article.imageUrls[0]}
                alt={article.title}
                className="w-20 h-20 object-cover rounded-md shadow-sm"
              />
            )}
            <div>
              <h3 className="font-semibold text-gray-900 text-base line-clamp-2">
                {article.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {article.sourceText} •{" "}
                {formatDate(article.publishedAt ?? new Date())}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <svg
                className="animate-spin h-10 w-10 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            </div>
          ) : comments.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              {translateUiText("No comments yet. Be the first to comment!")}
            </p>
          ) : (
            <div className="space-y-6">
              {comments.map((c) => (
                <div key={c.id} className="flex space-x-4">
                  <img
                    src={c.avatarUrl}
                    alt={c.username}
                    className="w-10 h-10 rounded-full object-cover shadow-sm"
                  />
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-lg px-4 py-3 shadow-sm">
                      <div className="flex justify-between items-start">
                        <p className="font-medium text-gray-800 text-sm">
                          {c.username}
                        </p>
                        <span className="text-xs text-gray-500">
                          {formatDate(new Date(c.timestamp))}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm mt-2">{c.text}</p>
                    </div>
                    <div className="flex items-center space-x-4 mt-2 px-2">
                      <button className="text-xs text-gray-600 hover:text-gray-800">
                        {translateUiText("Like")}
                      </button>
                      <button className="text-xs text-gray-600 hover:text-gray-800">
                        {translateUiText("Reply")}
                      </button>
                      {c.likes > 0 && (
                        <span className="text-xs text-gray-500">
                          {c.likes} {translateUiText("likes")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t sticky bottom-0 bg-white">
          <form
            onSubmit={handleSubmitComment}
            className="flex items-center space-x-4"
          >
            <img
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d"
              alt={translateUiText("Your avatar")}
              className="w-10 h-10 rounded-full object-cover shadow-sm"
            />
            <input
              type="text"
              placeholder={translateUiText("Add a comment...")}
              className="flex-1 border rounded-full px-4 py-2 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              type="submit"
              className={`text-blue-600 font-medium text-sm px-4 py-2 rounded-full shadow-sm transition-opacity duration-200 ${
                !newComment.trim()
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-100"
              }`}
              disabled={!newComment.trim()}
            >
              {translateUiText("Post")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
