// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Avatar } from "../Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Comment } from "@/db/schema/comments";
import { getTimeDifference } from "@/lib/utils";
import { ThumbsUp, ThumbsDown, MoreVertical } from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
// import { Comment } from "@/data/comments";

interface CommentItemProps {
  comment: Comment;
  isLiked: boolean;
  likeCount: number;
  onLike: () => void;
}

const CommentItem = ({
  comment,
  isLiked,
  likeCount,
  onLike,
}: CommentItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shortText =
    comment.content.length > 100 && !isExpanded
      ? comment.content.slice(0, 100) + "..."
      : comment.content;

  const shouldShowReadMore = comment.content.length > 100;

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
    <div className="mb-6 ml-2">
      <div className="flex gap-2">
        {/* <Avatar className={`w-10 h-10 ${getAvatarColor("Someone wiffienv")}`}>
          <AvatarFallback className="text-white">
            {getInitial("Someone wiffienv")}
          </AvatarFallback>
        </Avatar> */}
        <div className="flex">
          <Avatar
            profileImage={comment.author.profilePic ?? ""}
            name={comment.author.name ?? ""}
            className="w-7 h-7"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="font-medium text-sm">{comment.author.name}</span>
              <span className="text-xs text-zinc-400">
                {getTimeDifference(comment.createdAt)}
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-zinc-400 cursor-pointer">
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

          <p className="text-sm mb-2 mt-0.5">{shortText}</p>

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
                className={`p-1 hover:text-gray-800 rounded-sm group ${
                  comment.isLiked ? "text-primary" : ""
                }`}
                onClick={onLike}
              >
                <ThumbsUp
                  className={twMerge(
                    "h-4 w-4 text-zinc-400",
                    isLiked && "text-gray-800"
                  )}
                />
                <span
                  className={twMerge(
                    "text-zinc-400 text-sm",
                    isLiked && "text-gray-800"
                  )}
                >
                  {likeCount}
                </span>
              </button>
              <span className="text-xs text-zinc-400">
                {comment.likeCount > 0 ? comment.likeCount : ""}
              </span>
            </div>

            {/* <div className="flex items-center gap-1">
              <button
                className={`p-1 hover:bg-zinc-800 rounded-sm group ${
                  comment.isDisliked ? "text-primary" : ""
                }`}
                onClick={onDislike}
              >
                <ThumbsDown className="h-4 w-4 text-zinc-400" />
              </button>
              <span className="text-xs text-zinc-400">
                {comment.dislikeCount > 0 ? comment.dislikeCount : ""}
              </span>
            </div> */}

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
