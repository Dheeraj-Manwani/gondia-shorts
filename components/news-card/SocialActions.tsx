import { useLikes } from "@/hooks/use-likes";
import { useSave } from "@/hooks/use-saves";
import { cn, isTextContentRequired } from "@/lib/utils";
import { useArticles } from "@/store/articles";
import { useInteractions } from "@/store/interaction";
import { ArticleType } from "@prisma/client";
// import chalk from "chalk";

import { Bookmark, Heart, MessageSquareMore, Share2 } from "lucide-react";
import React from "react";

import { twMerge } from "tailwind-merge";

interface SocialActionsProps {
  articleId: number;
  articleType: ArticleType;
  setIsCommentModalOpen: (open: boolean) => void;
  isPreview: boolean;
}

export function triggerHaptic(duration: number = 50) {
  if (typeof window !== "undefined" && navigator.vibrate) {
    navigator.vibrate(duration);
  }
}

const SocialActionsComp = ({
  articleId,
  articleType,
  setIsCommentModalOpen,
  isPreview,
}: SocialActionsProps) => {
  const articles = useArticles((state) => state.articles);
  const article = articles.find((art) => art.id === articleId);
  // const setArticles = useArticles((state) => state.setArticles);

  const interactions = useInteractions((state) => state.interactions);
  const setInteractions = useInteractions((state) => state.setInteractions);
  const interaction = interactions.find(
    (inter) => inter.articleId == articleId
  );
  const { isLiked, likeCount, handleLike } = useLikes(
    interaction?.articleId ?? 0,
    interaction?.isLiked,
    interaction?.likeCount
  );
  const { isSaved, handleSave } = useSave(
    interaction?.articleId ?? 0,
    interaction?.isSaved
  );

  const handleLikeButton = (
    e: React.MouseEvent<HTMLButtonElement> | undefined
  ) => {
    e?.preventDefault();
    e?.stopPropagation();
    const res = handleLike();

    if (typeof res === "boolean" && !res) return;

    // TODO: To check whether this logic is correct
    const newLikedState = !isLiked;

    const updatedInteractions = interactions.map((inter) => {
      if (inter.articleId === articleId) {
        console.log("new interaction state => ", {
          ...inter,
          isLiked: newLikedState,
          likeCount: newLikedState
            ? inter.likeCount + 1
            : Math.max(inter.likeCount - 1, 0),
        });
        return {
          ...inter,
          isLiked: newLikedState,
          likeCount: newLikedState
            ? inter.likeCount + 1
            : Math.max(inter.likeCount - 1, 0),
        };
      }
      return inter;
    });
    setInteractions(updatedInteractions);
  };

  const handleSaveButton = (
    e: React.MouseEvent<HTMLButtonElement> | undefined
  ) => {
    e?.stopPropagation();
    e?.preventDefault();
    const res = handleSave();

    if (typeof res === "boolean" && !res) return;

    // TODO: To check whether this logic is correct
    const newSaveState = !isSaved;

    const updatedInteractins = interactions.map((inter) => {
      if (inter.articleId === articleId) {
        console.log("new interaction state => ", {
          ...inter,
          isSaved: newSaveState,
        });
        return {
          ...inter,
          isSaved: newSaveState,
        };
      }
      return inter;
    });

    setInteractions(updatedInteractins);

    //     return {
    //       ...art,
    //       isSaved: newSaveState,
    //     };
    //   }
    //   return art;
    // });
    // setArticles(updatedArticles);
    // console.log("Updating article state ", updatedArticles);
  };

  // useEffect(() => {
  // console.log(chalk.bgBlack("SocialActions component mounted"));
  // }, []);

  if (!interaction || !article)
    return <div className="p-4 text-gray-500">Article not found</div>;

  return (
    <div
      id="social-actions"
      className={twMerge(
        " py-2 flex items-center justify-between border-b border-gray-700",
        isPreview ? "pointer-events-none cursor-not-allowed" : "",
        !isTextContentRequired(articleType)
          ? "absolute bottom-36 right-3.5 z-10 bg-gray-800/40 flex-col rounded-sm justify-center align-baseline px-2 py-4"
          : "px-4"
      )}
    >
      <div
        className={twMerge(
          "flex ",
          !isTextContentRequired(articleType)
            ? "flex-col space-y-8 mb-8"
            : "space-x-4"
        )}
      >
        <button
          onClick={handleLikeButton}
          className={cn(
            "cursor-pointer flex gap-0.5",
            !isTextContentRequired(articleType) && "flex-col"
          )}
          aria-pressed={isLiked}
          aria-label={isLiked ? "Unlike this post" : "Like this post"}
        >
          {isLiked ? (
            <Heart
              size={isTextContentRequired(articleType) ? 18 : 24}
              className="fill-red-500 text-red-500"
            />
          ) : (
            <Heart
              size={isTextContentRequired(articleType) ? 18 : 24}
              className={cn(
                isTextContentRequired(articleType)
                  ? "text-gray-700"
                  : "text-gray-400"
              )}
            />
          )}
          <span
            className={cn(
              " text-[10px]",
              isLiked
                ? "text-red-500"
                : isTextContentRequired(articleType)
                ? "text-gray-700"
                : "text-gray-400"
            )}
          >
            {likeCount}
          </span>
        </button>
        <button
          onClick={() => setIsCommentModalOpen(true)}
          className="cursor-pointer"
        >
          <MessageSquareMore
            size={isTextContentRequired(articleType) ? 18 : 24}
            className={cn(
              isTextContentRequired(articleType)
                ? "text-gray-700"
                : "text-gray-400"
            )}
          />
        </button>
        <button
          onClick={() =>
            window.open(
              `https://api.whatsapp.com/send?text=${encodeURIComponent(
                article.title +
                  " " +
                  // window.location.href +
                  "https://gondia-shorts.vercel.app" +
                  "/article/" +
                  article.slug
              )}`,
              "_blank"
            )
          }
          className="text-gray-700 cursor-pointer"
        >
          <Share2
            size={isTextContentRequired(articleType) ? 18 : 24}
            className={cn(
              isTextContentRequired(articleType)
                ? "text-gray-700"
                : "text-gray-400"
            )}
          />
        </button>
      </div>
      <button
        onClick={handleSaveButton}
        className="p-1 rounded-full transition-colors cursor-pointer"
        aria-label="Save"
      >
        {isSaved ? (
          <Bookmark
            size={isTextContentRequired(articleType) ? 18 : 24}
            className={cn(
              isTextContentRequired(articleType)
                ? "fill-black text-black"
                : "fill-gray-400 text-gray-400"
            )}
          />
        ) : (
          <Bookmark
            size={isTextContentRequired(articleType) ? 18 : 24}
            className={cn(
              isTextContentRequired(articleType)
                ? "text-gray-700"
                : "text-gray-400"
            )}
          />
        )}
      </button>
    </div>
  );
};

export const SocialActions = React.memo(
  SocialActionsComp,
  (prevProps, nextProps) => {
    // Prevent re-render if article id is the same
    return (
      prevProps.articleId === nextProps.articleId &&
      prevProps.isPreview === nextProps.isPreview &&
      prevProps.setIsCommentModalOpen === nextProps.setIsCommentModalOpen
    );
  }
);
SocialActions.displayName = "SocialActions";
