"use client";

import React from "react";
import { v4 as uuid } from "uuid";
import NewArticle from "@/components/form/NewArticle";
import NewsCard from "@/components/news-card/NewsCard";
import { CreateArticle } from "@/db/schema/article";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { createArticle } from "@/actions/articles";
import { twMerge } from "tailwind-merge";
import { useSession } from "next-auth/react";
import { appSession } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function Page() {
  const session = useSession() as unknown as appSession;
  const router = useRouter();
  const [isPreviewMode, setIsPreviewMode] = React.useState<boolean>(false);
  const [currentArticle, setCurrentArticle] =
    React.useState<null | CreateArticle>(null);

  const { execute, isLoading } = useAction<CreateArticle, { data: "" }>(
    createArticle,
    {
      toastMessages: {
        loading: "Creating article...",
        success: "Article created successfully!",
        error: "Error creating article",
      },
    }
  );

  const handleSubmit = async () => {
    if (currentArticle) {
      const res = await execute(currentArticle);
      console.log("routing to ", "/feed?article=" + res.routeParam);
      router.push("/feed?article=" + res.routeParam);
    }
  };
  const articleId = uuid();

  // console.log("page render", currentArticle, isPreviewMode);

  // console.log("session inside new page", session);
  if (session.status === "loading") return null;
  if (session.status === "unauthenticated") return <div>Unauthorized</div>;
  if (session?.data.user?.role != "ADMIN") return <div>No Access</div>;
  return (
    <div
      className={twMerge("flex flex-col mt-16", isLoading ? "opacity-50" : "")}
    >
      <>
        {isPreviewMode ? (
          <>
            <div className="bg-amber-400 text-black text-center px-3 py-1 flex justify-between">
              <Button
                onClick={() => setIsPreviewMode(false)}
                className="p-1.5 text-xs position-absolute top-2 left-2 h-7 my-auto"
              >
                Back
              </Button>
              <span className="m-auto">
                Preview your article before publishing.
              </span>
              <Button
                onClick={handleSubmit}
                className="p-1.5 text-xs position-absolute top-2 left-2 h-7 my-auto"
              >
                Done
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className=" text-2xl font-semibold text-center mt-4">
              New Article
            </div>
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
        <NewsCard
          article={
            currentArticle
              ? {
                  ...currentArticle,
                  id: articleId,
                  categoryId: 1,
                  sourceText: "Gondia ",
                  submittedById: 5,
                }
              : {
                  id: articleId,
                  categoryId: 1,
                  sourceText: "Gondia ",
                  submittedById: 5,
                  title: "",
                  content: "",
                  type: "IMAGE_N_TEXT",
                  imageUrls: [""],
                }
          }
          isPreview={true}
          isPreviewActive={isPreviewMode}
          isCurrentActive={true}
        />
      </>
    </div>
  );
}
