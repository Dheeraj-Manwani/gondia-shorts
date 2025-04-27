import { ArticleAttachment } from "@/components/form/ArticleAttachment";
import NewArticle from "@/components/form/NewArticle";

export default function () {
  return (
    <div className="flex flex-col gap-1 mt-20">
      <div className=" text-2xl font-semibold text-center">New Article</div>
      <div className="text-sm text-muted-foreground text-center">
        Add a new article to Gondia Shorts.
      </div>
      <NewArticle />
    </div>
  );
}
