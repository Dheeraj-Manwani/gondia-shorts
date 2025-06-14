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
import {
  ThumbsUp,
  ThumbsDown,
  MoreVertical,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { appSession } from "@/lib/auth";
import ReplyComment from "./ReplyComment";
import { MiniBrandLoader } from "../ui/Loaders";
// import { Comment } from "@/data/comments";

interface CommentItemProps {
  session: appSession;
  comment: Comment;
  isReply: boolean;
  onLike: () => void;
  onDislike: () => void;
  onReply: (text: string, parentId: number) => void;
  getReplies?: (parentId: number) => void;
  isReplyLoading: boolean;
}

const CommentItem = ({
  session,
  comment,
  isReply,
  onLike,
  onDislike,
  onReply,
  getReplies,
  isReplyLoading,
}: CommentItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [isShowReplies, setIsShowReplies] = useState(false);
  const shortText =
    comment.content.length > 100 && !isExpanded
      ? comment.content.slice(0, 100) + "..."
      : comment.content;

  const shouldShowReadMore = comment.content.length > 100;

  // const getInitial = (username: string) => {
  //   return username.charAt(1).toUpperCase();
  // };

  // const getAvatarColor = (username: string) => {
  //   const colors = [
  //     "bg-teal-600",
  //     "bg-blue-600",
  //     "bg-red-600",
  //     "bg-green-600",
  //     "bg-yellow-600",
  //     "bg-purple-600",
  //     "bg-pink-600",
  //     "bg-indigo-600",
  //   ];
  //   const index = username.charCodeAt(1) % colors.length;
  //   return colors[index];
  // };

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

          <div className="flex items-center gap-2">
            <div className="flex items-center  gap-1.5">
              <span className="flex items-center">
                <button
                  className={`p-1 hover:text-gray-800 rounded-sm group ${
                    comment.isLiked ? "text-primary" : ""
                  }`}
                  onClick={onLike}
                >
                  <ThumbsUp
                    className={twMerge("h-4 w-4 cursor-pointer")}
                    stroke={"#1e2939"}
                    fill={comment.isLiked ? "#1e2939" : "white"}
                  />
                </button>
                <span
                  className={twMerge(
                    "text-xs text-white",
                    comment.likeCount > 0 && "text-zinc-400",
                    comment.isLiked && "text-black"
                  )}
                >
                  {comment.likeCount}
                </span>
              </span>
              <span className="flex items-center">
                <button
                  className={`p-1 hover:text-gray-800 rounded-sm group ${
                    comment.isDisliked ? "text-primary" : ""
                  }`}
                  onClick={onDislike}
                >
                  <ThumbsDown
                    className={twMerge("h-4 w-4 cursor-pointer")}
                    stroke={"#1e2939"}
                    fill={comment.isDisliked ? "#1e2939" : "white"}
                  />
                </button>
                <span
                  className={twMerge(
                    "text-xs text-white",
                    comment.dislikeCount > 0 && "text-zinc-400",
                    comment.isDisliked && "text-black"
                  )}
                >
                  {comment.dislikeCount}
                </span>
              </span>
            </div>

            {!isReplyOpen && session.status == "authenticated" && (
              <button
                className="text-xs text-zinc-400 hover:text-gray-800 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsReplyOpen(true);
                }}
              >
                Reply
              </button>
            )}
          </div>
          {!isReply && comment.repliesCount > 0 && (
            <button
              className="text-xs text-zinc-500  cursor-pointer flex gap-1 ml-2 mt-1.5"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!comment.replies?.length) getReplies?.(comment.id ?? -1);
                setIsShowReplies(!isShowReplies);
              }}
            >
              <span>Show Replies({comment.repliesCount}) </span>
              {isShowReplies ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>
          )}

          {isShowReplies && comment.repliesCount > 0 && (
            <div className="mt-2">
              {isReplyLoading ? (
                <MiniBrandLoader />
              ) : comment.replies && comment.replies.length > 0 ? (
                <div className="mt-3.5">
                  {comment.replies.map((reply) => (
                    <CommentItem
                      key={reply.id}
                      session={session}
                      comment={reply}
                      isReply={true}
                      onLike={() => {
                        console.log("Liking reply:", reply.id);
                        onLike();
                      }}
                      onDislike={() => onDislike()}
                      onReply={(text, parentId) => {
                        console.log("Replying to reply:", text, parentId);
                        onReply(text, reply.id ?? -1);
                      }}
                      isReplyLoading={false}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-sm text-zinc-400">
                  No replies yet. Be the first to reply!
                </div>
              )}
            </div>
          )}

          {/* Form to post a reply */}
          {isReplyOpen && (
            <ReplyComment
              parentId={comment.id ?? -1}
              onClose={() => setIsReplyOpen(false)}
              onReply={(text, parentId) => {
                console.log("Replying with:", text, "to parent ID:", parentId);
                onReply(text, parentId);
                setIsReplyOpen(false);
              }}
            />
            // <div
            //   className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            //   onClick={() => setIsReplyOpen(false)}
            // >
            //   <div
            //     className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm"
            //     onClick={(e) => e.stopPropagation()}
            //   >
            //     <div> Reply here </div>
            //     <button
            //       onClick={() => setIsReplyOpen(false)}
            //       className="mt-4 text-sm text-gray-500 hover:underline"
            //     >
            //       Close
            //     </button>
            //   </div>
            // </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
