import { saveArticle } from "@/actions/interaction/articleInteractions";
import { Article } from "@/db/schema/article";
import { useEffect, useRef, useState } from "react";
import { useAuthGuard } from "./use-auth-guard";
import { debounce, DebouncedFunc } from "lodash";
import { toast } from "sonner";

export const useSave = (article: Article) => {
  const [isSaved, setIsSaved] = useState(false);
  const { session, guard } = useAuthGuard();

  const debouncedSaveRef = useRef<DebouncedFunc<
    (
      shouldSave: boolean,
      isArticleSaved: boolean,
      articleId: number,
      userId: number
    ) => void
  > | null>(null);

  useEffect(() => {
    if (typeof article.isSaved === "boolean") setIsSaved(article.isSaved);

    if (!debouncedSaveRef.current) {
      debouncedSaveRef.current = debounce(
        (
          shouldSave: boolean,
          isArticleSaved: boolean,
          articleId: number,
          userId: number
        ) => {
          if (shouldSave === isArticleSaved) return;
          const id = toast.loading(
            shouldSave ? "Saving article..." : "Removing from saved..."
          );

          saveArticle(articleId, userId, shouldSave)
            .then((res: boolean) => {
              toast.success(
                shouldSave ? "Article saved!" : "Removed from saved!",
                { id }
              );
              console.log(res ? "Actually saved" : "Already saved");
            })
            .catch((err) => {
              setIsSaved(!shouldSave); // rollback
              console.error("Save toggle error:", err);
              toast.error("Could not update saved status", { id });
            });
        },
        1000
      );
    }

    return () => {
      debouncedSaveRef.current?.cancel();
    };
  }, []);

  const handleSave = guard(() => {
    if (!debouncedSaveRef.current) return;

    const newSavedState = !isSaved;

    setIsSaved(newSavedState);

    debouncedSaveRef.current?.(
      newSavedState,
      article.isSaved ?? false,
      article.id,
      Number(session.data?.user?.id)
    );
  });

  return { isSaved, handleSave };
};
