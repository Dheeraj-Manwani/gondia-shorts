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
import SortDropdown from "@/components/comments/SortDropdown";
import AddComment from "@/components/comments/AddComment";
import CommentItem from "@/components/comments/CommentItem";
import { Article } from "@/db/schema/article";
import { signIn } from "next-auth/react";
import { Button } from "../ui/button";
import { appSession } from "@/lib/auth";
import { useEffect } from "react";

interface CommentModalProps {
  article: Article;
  isOpen: boolean;
  onClose: () => void;
  session: appSession;
}

const CommentModal = ({
  article,
  isOpen,
  onClose,
  session,
}: CommentModalProps) => {
  const {
    comments,
    addComment,
    getComments,
    likeComment,
    dislikeComment,
    sortOption,
    setSortOption,
    isLoading,
    error,
  } = useComments(Number(article.id), Number(session.data?.user?.id ?? 0));

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
        className="bg-[#ffffff] text-gray-500 max-w-[95%] max-h-[90vh] p-0"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="flex flex-row items-center justify-between p-4 pb-2 border-b border-gray-500">
          <DialogTitle className="text-lg  text-gray-500 tracking-wide">
            {comments.length} Comments
          </DialogTitle>
          <div className="flex items-center gap-2">
            <SortDropdown
              sortOption={sortOption}
              setSortOption={setSortOption}
            />
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>

        <ScrollArea className="p-4 max-h-[70vh]">
          {session.status === "authenticated" && (
            <>
              <AddComment
                onAddComment={addComment}
                name={session.data.user?.name}
                profilePic={session.data.user?.image}
              />

              {isLoading
                ? "Loading ..."
                : comments.map((comment) => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      onLike={() => likeComment(Number(comment.id))}
                      onDislike={() => dislikeComment(Number(comment.id))}
                    />
                  ))}
            </>
          )}
          {session.status === "unauthenticated" && (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-gray-500 text-sm">
                Please sign in to add comments.
              </p>
              <Button
                className="mt-2 cursor-pointer text-gray-600 hover:underline px-1"
                onClick={() => signIn("google")}
                variant={"ghost"}
              />
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CommentModal;
