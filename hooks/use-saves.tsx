import { saveArticle } from "@/actions/interaction/article-interactions";
import { Article } from "@/db/schema/article";
import { useEffect, useRef, useState } from "react";
import { useAuthGuard } from "./use-auth-guard";
import { debounce, DebouncedFunc } from "lodash";
import { toast } from "sonner";
import { debouncedSave } from "./hook-actions";
import chalk from "chalk";

export const useSave = (articleId: number, isArticleSaved?: boolean) => {
  const [isSaved, setIsSaved] = useState(false);
  const { session, guardAsync } = useAuthGuard();

  // const debouncedSaveRef = useRef<DebouncedFunc<
  //   (
  //     shouldSave: boolean,
  //     isArticleSaved: boolean,
  //     articleId: number,
  //     userId: number
  //   ) => void
  // > | null>(null);

  useEffect(() => {
    // console.log(
    //   "Syncing save state with article data in hook use effect",
    //   isArticleSaved,
    //   isSaved
    // );
    if (typeof isArticleSaved === "boolean") setIsSaved(isArticleSaved);

    // if (!debouncedSaveRef.current) {
    //   // debouncedSaveRef.current =

    // return () => {
    //   debouncedSaveRef.current?.cancel();
    // };
  }, []);

  const handleSave = guardAsync(async () => {
    const newSavedState = !isSaved;

    // Optimistically update the UI
    setIsSaved(newSavedState);

    const res = await debouncedSave(
      newSavedState,
      isArticleSaved ?? false,
      articleId,
      Number(session.data?.user?.id)
    );

    // if (!res) {
    //   // reverting optimistic update
    //   console.log(chalk.blueBright("Reverted optimistic save", res));

    //   setIsSaved(!newSavedState);
    // }
  });

  return { isSaved, handleSave };
};
