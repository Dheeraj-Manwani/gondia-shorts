"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import { useComments } from "@/hooks/use-comments";
// import SortDropdown from "@/components/comments/SortDropdown";
import AddComment from "@/components/comments/AddComment";
import CommentItem from "@/components/comments/CommentItem";
import { Article } from "@/db/schema/article";
import { signIn } from "next-auth/react";
import { useEffect } from "react";
import { BrandLoader } from "../ui/Loaders";

interface CommentModalProps {
  article: Article;
  isOpen: boolean;
  onClose: () => void;
}

const CommentModal = ({ article, isOpen, onClose }: CommentModalProps) => {
  const {
    session,
    isLoading,
    isReplyLoading,
    comments,
    addComment,
    getComments,
    getReplies,
    // likeComment,
    toggleCommentInteraction,
    // sortOption,
    // setSortOption,
    // error,
  } = useComments(Number(article.id));

  useEffect(() => {
    console.log("isOpen ===== ", isOpen);
    console.log("isLoading ====== ", isLoading);
    if (isOpen && !isLoading) {
      getComments(undefined);
    }
  }, []);

  if (session.status === "loading") return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="bg-[#ffffff] text-gray-500 max-w-[95%] max-h-[90dvh] p-0 rounded-md"
        onInteractOutside={(e) => {
          e.preventDefault();
          onClose();
        }}
      >
        <DialogHeader className="flex flex-row items-center justify-between p-4 pb-2 border-b border-gray-500">
          <DialogTitle className="text-lg  text-gray-500 tracking-wide">
            {comments.length} Comments
          </DialogTitle>
          <div className="flex items-center gap-2">
            {/* <SortDropdown
              sortOption={sortOption}
              setSortOption={setSortOption}
            /> */}
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>
        {/* p-4  */}
        <ScrollArea className="max-h-[70dvh] p-2.5">
          {session.status === "authenticated" && (
            <AddComment
              onAddComment={addComment}
              name={session.data.user?.name}
              profilePic={session.data.user?.image}
            />
          )}
          {session.status === "unauthenticated" && (
            <div
              className="flex items-center justify-center gap-1 border-b border-gray-500 -mt-1.5 pb-5
            "
            >
              <p className="text-gray-500 text-base">
                Please
                <button
                  className="cursor-pointer hover:underline text-blue-700 mx-1"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    signIn("google", { redirect: false });
                  }}
                >
                  signin
                </button>
                to add comments.
              </p>
            </div>
          )}

          {isLoading ? (
            // "Loading ..."
            <BrandLoader />
          ) : (
            <div className="mt-4">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    session={session}
                    comment={comment}
                    getReplies={getReplies}
                    isReplyLoading={isReplyLoading}
                    isReply={false}
                    onLike={(givenId) =>
                      toggleCommentInteraction({
                        commentId: Number(comment.id),
                        type: "LIKE",
                        replyId: givenId,
                      })
                    }
                    onDislike={(givenId) =>
                      toggleCommentInteraction({
                        commentId: Number(comment.id),
                        type: "DISLIKE",
                        replyId: givenId,
                      })
                    }
                    onReply={(text: string, parentId: number) =>
                      addComment(text, parentId)
                    }
                  />
                ))
              ) : (
                <div className="text-center pb-3">
                  Be the first to comment on this Article.
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CommentModal;
