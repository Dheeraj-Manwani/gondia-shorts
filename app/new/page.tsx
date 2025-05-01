"use client";

import React from "react";
import { v4 as uuid } from "uuid";
import NewArticle from "@/components/form/NewArticle";
import NewsCard from "@/components/NewsCard";
import { CreateArticle } from "@/db/schema/news";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { createArticle } from "@/actions/articles/articles";
import { twMerge } from "tailwind-merge";
import { useSession } from "next-auth/react";
import { appSession, authConfig } from "@/lib/auth";

export default function () {
  // @ts-expect-error to be taken care of
  const session: appSession = useSession(authConfig);
  const [isPreviewMode, setIsPreviewMode] = React.useState<boolean>(false);
  const [currentArticle, setCurrentArticle] =
    React.useState<null | CreateArticle>(null);

  const { execute, isLoading } = useAction<CreateArticle, {}>(createArticle, {
    toastMessages: {
      loading: "Creating article...",
      success: "Article created successfully!",
      error: "Error creating article",
    },
  });

  const handleSubmit = async () => {
    if (currentArticle) await execute(currentArticle);
  };

  console.log("page render", currentArticle, isPreviewMode);

  console.log("session inside new page", session);
  if (session.status === "loading") return null;
  if (session.status === "unauthenticated") return <div>Unauthorized</div>;
  if (session?.data.user?.role != "ADMIN") return <div>No Access</div>;
  return (
    <div
      className={twMerge(
        "flex flex-col gap-1 mt-20",
        isLoading ? "opacity-50 pointer-events-none" : ""
      )}
    >
      {isPreviewMode ? (
        <>
          <div className="bg-amber-400 text-black text-center px-3 py-1 flex justify-between">
            <Button
              onClick={() => setIsPreviewMode(false)}
              className="p-0 text-sm position-absolute top-2 left-2"
            >
              Back
            </Button>
            Preview your article before publishing.
            <Button
              onClick={handleSubmit}
              className="p-0 text-sm position-absolute top-2 left-2"
            >
              Done
            </Button>
          </div>
          {currentArticle && (
            <NewsCard
              article={{
                ...currentArticle,
                id: uuid(),
                categoryId: 1,
                sourceText: "Gondia ",
                submittedById: 5,
              }}
              isPreview={true}
              isCurrentActive={true}
            />
          )}
        </>
      ) : (
        <>
          <div className=" text-2xl font-semibold text-center">New Article</div>
          <div className="text-sm text-muted-foreground text-center">
            Add a new article to Gondia Shorts.
          </div>
          <NewArticle
            article={currentArticle}
            setArticle={setCurrentArticle}
            togglePreviewMode={setIsPreviewMode}
          />
        </>
      )}

      {isLoading && (
        <div className="absolute inset-0 bg-black/50">Submitting...</div>
      )}
    </div>
  );
}
