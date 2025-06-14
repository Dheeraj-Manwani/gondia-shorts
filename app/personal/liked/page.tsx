import InteractedNewsFeed from "@/components/news-feeds/InteractedNewsFeed";
import { InteractionType } from "@prisma/client/index-browser";

const LikedArticles = () => {
  return (
    <div className="mt-20 mb-16">
      <div className="text-2xl font-semibold tracking-wider w-full text-center flex gap-1 justify-center">
        <div>
          <h2 className="pb-0.5 mb-0">Liked</h2>
          <div className="h-1 bg-red-500 rounded-md -mt-1"></div>
        </div>
        <span>Articles</span>
      </div>

      <InteractedNewsFeed interactionType={InteractionType.LIKE} />
    </div>
  );
};

export default LikedArticles;
