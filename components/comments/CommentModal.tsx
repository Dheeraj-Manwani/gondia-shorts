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
import { Article } from "@/db/schema/news";

interface CommentModalProps {
  article: Article;
  isOpen: boolean;
  onClose: () => void;
}

const CommentModal = ({ article, isOpen, onClose }: CommentModalProps) => {
  const {
    comments,
    addComment,
    likeComment,
    dislikeComment,
    sortOption,
    setSortOption,
  } = useComments(article.id);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="bg-[#ffffff] text-gray-500  max-w-2xl max-h-[90vh] p-0"
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
          <AddComment onAddComment={addComment} />

          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onLike={() => likeComment(comment.id)}
              onDislike={() => dislikeComment(comment.id)}
            />
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CommentModal;
