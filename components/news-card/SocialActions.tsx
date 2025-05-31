import { Article } from "@/db/schema/article";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { useLikes } from "@/hooks/use-likes";
import { useSave } from "@/hooks/use-saves";
import { useArticles } from "@/store/articles";
import { debounce } from "lodash";
import { Bookmark, Heart, MessageSquareMore, Share2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

interface SocialActionsProps {
  article: Article;
  setIsCommentModalOpen: (open: boolean) => void;
  isPreview: boolean;
}

export const SocialActions = ({
  article,
  setIsCommentModalOpen,
  isPreview,
}: SocialActionsProps) => {
  const articles = useArticles((state) => state.articles);
  const setArticles = useArticles((state) => state.setArticles);
  const { session } = useAuthGuard();

  // const [isSaved, setIsSaved] = useState(false);
  // const [saveCount, setSaveCount] = useState(0);

  const { isLiked, likeCount, handleLike } = useLikes(article);
  const { isSaved, handleSave } = useSave(article);

  // const handleSave = useCallback((e) => {
  //   e.preventDefault();
  //   // if (session.status === "authenticated") {
  //   setIsSaved((prev) => !prev);
  //   debounce(async () => {
  //     toast.success(isSaved ? "Article saved!" : "Removed from saved!");
  //   }, 500)();
  //   // } else {
  //   //   toast.error("Please login to like the article.");
  //   // }
  // }, []);

  const handleLikeButton = (
    e: React.MouseEvent<HTMLButtonElement> | undefined
  ) => {
    e?.preventDefault();
    const res = handleLike();

    if (typeof res === "boolean" && !res) return;

    // TODO: To check whether this logic is correct
    const newLikedState = !isLiked;

    const updatedArticles = articles.map((art) => {
      if (art.id === article.id) {
        return {
          ...art,
          isLiked: newLikedState,
          likeCount: newLikedState
            ? art.likeCount ?? 0 + 1
            : Math.max(art.likeCount ?? 0 - 1, 0),
        };
      }
      return art;
    });
    setArticles(updatedArticles);
  };

  const handleSaveButton = (
    e: React.MouseEvent<HTMLButtonElement> | undefined
  ) => {
    e?.preventDefault();
    const res = handleSave();

    if (typeof res === "boolean" && !res) return;

    // TODO: To check whether this logic is correct
    const newSaveState = !isSaved;

    const updatedArticles = articles.map((art) => {
      if (art.id === article.id) {
        return {
          ...art,
          isSaved: newSaveState,
        };
      }
      return art;
    });
    setArticles(updatedArticles);
  };

  // useEffect(() => {
  //   if (typeof article.isSaved === "boolean") setIsSaved(article.isSaved);
  //   if (typeof article.saveCount === "number") setSaveCount(article.saveCount);
  // }, []);

  return (
    <div
      className={twMerge(
        "px-4 py-2 flex items-center justify-between border-b border-gray-700",
        isPreview ? "pointer-events-none cursor-not-allowed" : ""
      )}
    >
      <div className="flex space-x-4">
        <button
          onClick={handleLikeButton}
          className="cursor-pointer flex gap-0.5"
          aria-pressed={isLiked}
          aria-label={isLiked ? "Unlike this post" : "Like this post"}
        >
          {isLiked ? (
            <Heart size={18} className="fill-red-500 text-red-500" />
          ) : (
            <Heart size={18} className="text-gray-700" />
          )}
          <span className="text-red-500 text-[10px]">
            {likeCount != 0 && likeCount}
          </span>
        </button>
        <button
          onClick={() => setIsCommentModalOpen(true)}
          className="cursor-pointer"
          aria-pressed={isSaved}
          aria-label={isSaved ? "Unsave this post" : "Save this post"}
        >
          <MessageSquareMore size={18} className="text-gray-700" />
        </button>
        <button
          onClick={() =>
            window.open(
              `https://api.whatsapp.com/send?text=${encodeURIComponent(
                article.title + " " + window.location.href
              )}`,
              "_blank"
            )
          }
          className="text-gray-700 cursor-pointer"
        >
          <Share2 size={18} className="text-gray-700" />
        </button>
      </div>
      <button
        onClick={handleSaveButton}
        className="p-1 rounded-full transition-colors cursor-pointer"
        aria-label="Save"
      >
        {isSaved ? (
          <Bookmark size={18} className="fill-black text-black" />
        ) : (
          <Bookmark size={18} className="text-gray-700" />
        )}
      </button>
    </div>
  );
};
