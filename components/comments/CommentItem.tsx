import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Comment } from "@/db/schema/comments";
import { ThumbsUp, ThumbsDown, MoreVertical } from "lucide-react";
import { useState } from "react";
// import { Comment } from "@/data/comments";

interface CommentItemProps {
  comment: Comment;
  onLike: () => void;
  onDislike: () => void;
}

const CommentItem = ({ comment, onLike, onDislike }: CommentItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shortText =
    comment.text.length > 100 && !isExpanded
      ? comment.text.slice(0, 100) + "..."
      : comment.text;

  const shouldShowReadMore = comment.text.length > 100;

  const getInitial = (username: string) => {
    return username.charAt(1).toUpperCase(); // Skip the @ symbol
  };

  const getAvatarColor = (username: string) => {
    const colors = [
      "bg-teal-600",
      "bg-blue-600",
      "bg-red-600",
      "bg-green-600",
      "bg-yellow-600",
      "bg-purple-600",
      "bg-pink-600",
      "bg-indigo-600",
    ];
    const index = username.charCodeAt(1) % colors.length;
    return colors[index];
  };

  return (
    <div className="mb-6">
      <div className="flex gap-3">
        <Avatar className={`w-10 h-10 ${getAvatarColor(comment.username)}`}>
          <AvatarFallback className="text-white">
            {getInitial(comment.username)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{comment.username}</span>
              <span className="text-xs text-zinc-400">{comment.timeAgo}</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-zinc-400 hover:text-white">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-[#18181B] border-[#27272A] text-white"
              >
                <DropdownMenuItem className="hover:bg-zinc-700 focus:bg-zinc-700">
                  Report
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-zinc-700 focus:bg-zinc-700">
                  Block User
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <p className="text-sm my-2">{shortText}</p>

          {shouldShowReadMore && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-zinc-400 hover:text-white mb-2"
            >
              {isExpanded ? "Read less" : "Read more"}
            </button>
          )}

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <button
                className={`p-1 hover:bg-zinc-800 rounded-sm group ${
                  comment.liked ? "text-primary" : ""
                }`}
                onClick={onLike}
              >
                <ThumbsUp className="h-4 w-4 text-zinc-400 group-hover:text-white" />
              </button>
              <span className="text-xs text-zinc-400">
                {comment.likes > 0 ? comment.likes : ""}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                className={`p-1 hover:bg-zinc-800 rounded-sm group ${
                  comment.disliked ? "text-primary" : ""
                }`}
                onClick={onDislike}
              >
                <ThumbsDown className="h-4 w-4 text-zinc-400 group-hover:text-white" />
              </button>
              <span className="text-xs text-zinc-400">
                {comment.dislikes > 0 ? comment.dislikes : ""}
              </span>
            </div>

            <button className="text-xs text-zinc-400 hover:text-white">
              Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
