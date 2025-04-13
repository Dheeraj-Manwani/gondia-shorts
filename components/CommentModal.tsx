import React, { useState } from "react";
// import { Article } from '@shared/schema';
import { formatDate } from "@/lib/helpers";
// import { useTranslate } from "@/hooks/use-translate";
import { translateUiText } from "@/lib/translateService";
import { Article } from "@/db/schema/news";

interface CommentModalProps {
  article: Article;
  isOpen: boolean;
  onClose: () => void;
}

interface Comment {
  id: number;
  username: string;
  avatarUrl: string;
  text: string;
  timestamp: Date;
  likes: number;
}

const CommentModal: React.FC<CommentModalProps> = ({
  article,
  isOpen,
  onClose,
}) => {
  // const { isHindi } = useTranslate();
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      username: "local_user",
      avatarUrl:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
      text: "This is really interesting news!",
      timestamp: new Date(Date.now() - 3600000),
      likes: 5,
    },
    {
      id: 2,
      username: "news_fan",
      avatarUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
      text: "Thanks for sharing this update.",
      timestamp: new Date(Date.now() - 7200000),
      likes: 3,
    },
  ]);

  const [newComment, setNewComment] = useState("");

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now(),
      username: "you",
      avatarUrl:
        "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
      text: newComment.trim(),
      timestamp: new Date(),
      likes: 0,
    };

    setComments([comment, ...comments]);
    setNewComment("");
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold">
            {translateUiText("Comments")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-700 p-2 rounded-full hover:bg-gray-100"
            aria-label={translateUiText("Close comments")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content area with scrolling */}
        <div className="overflow-y-auto flex-1 p-4">
          {/* Article reference */}
          <div className="flex items-start space-x-3 mb-6 pb-4 border-b border-gray-200">
            {article.imageUrls && (
              <img
                src={article.imageUrls[0]}
                alt={article.title}
                className="w-16 h-16 object-cover rounded-md"
              />
            )}
            <div>
              <h3 className="font-medium text-sm line-clamp-2">
                {article.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {article.sourceText} •{" "}
                {formatDate(article.publishedAt ?? new Date())}
              </p>
            </div>
          </div>

          {/* Comments list */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {translateUiText("No comments yet. Be the first to comment!")}
                </p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <img
                    src={comment.avatarUrl}
                    alt={comment.username}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-2xl px-4 py-2">
                      <div className="flex justify-between items-start">
                        <p className="font-medium text-sm">
                          {comment.username}
                        </p>
                        <span className="text-xs text-gray-500">
                          {formatDate(comment.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{comment.text}</p>
                    </div>

                    <div className="flex items-center space-x-4 mt-1 px-2">
                      <button className="text-xs text-gray-500 hover:text-gray-700">
                        {translateUiText("Like")}
                      </button>
                      <button className="text-xs text-gray-500 hover:text-gray-700">
                        {translateUiText("Reply")}
                      </button>
                      <span className="text-xs text-gray-500">
                        {comment.likes > 0
                          ? `${comment.likes} ${translateUiText("likes")}`
                          : ""}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Comment input */}
        <div className="px-4 py-3 border-t border-gray-200 sticky bottom-0 bg-white">
          <form
            onSubmit={handleSubmitComment}
            className="flex items-center space-x-3"
          >
            <img
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
              alt={translateUiText("Your avatar")}
              className="w-8 h-8 rounded-full object-cover"
            />
            <input
              type="text"
              placeholder={translateUiText("Add a comment...")}
              className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              type="submit"
              className={`text-blue-600 font-medium text-sm ${
                !newComment.trim() ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!newComment.trim()}
            >
              {translateUiText("Post")}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CommentModal;
