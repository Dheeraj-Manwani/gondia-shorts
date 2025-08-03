import React from "react";
import "swiper/css";
import "swiper/css/pagination";
import { ArticleType } from "@prisma/client/index.js";
import { Article } from "@/db/schema/article";
import { VideoText } from "./NewsMedias/VideoText";
import { ImageText } from "./NewsMedias/ImageText";
import { Youtube } from "./NewsMedias/Youtube";
import { FullImage } from "./NewsMedias/FullImage";
import { cn, isTextContentRequired } from "@/lib/utils";
import { YoutubeShorts } from "./NewsMedias/YoutubeShorts";
// import chalk from "chalk";

interface NewsMediaProp {
  article: Article;
  isCurrentActive: boolean;
}

const NewsMediaComp = ({ article, isCurrentActive }: NewsMediaProp) => {
  // useEffect(() => {
  //   console.log(
  //     chalk.red("News MEdia component re rendered ::::::::::: ======= ")
  //   );
  // }, []);

  return (
    <div
      className={cn(
        "flex items-center justify-center bg-gray-200 relative",
        isTextContentRequired(article.type) ? "h-[40dvh] mt-12" : "h-[100dvh]"
      )}
    >
      {/* Video + Text*/}
      {article.type === ArticleType.VIDEO_N_TEXT && article.videoUrl && (
        <VideoText article={article} />
      )}

      {/* Image + Text */}
      {article.type == ArticleType.IMAGE_N_TEXT && (
        <ImageText article={article} />
      )}

      {/* Full Image */}
      {article.type == ArticleType.FULL_IMAGE && (
        <FullImage article={article} />
      )}

      {/* Full Video */}
      {article.type == ArticleType.FULL_VIDEO && (
        <VideoText article={article} />
      )}

      {/* Youtube */}
      {article.type == ArticleType.YOUTUBE && article.videoUrl && (
        <Youtube article={article} isCurrentActive={isCurrentActive} />
      )}

      {/* Youtube Shorts */}
      {article.type == ArticleType.YOUTUBE_SHORTS && article.videoUrl && (
        <YoutubeShorts article={article} isCurrentActive={isCurrentActive} />
      )}
    </div>
  );
};

export const NewsMedia = React.memo(NewsMediaComp, () => {
  return true;
});
NewsMedia.displayName = "NewsMedia";
