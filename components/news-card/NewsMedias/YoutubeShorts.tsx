import { Article } from "@/db/schema/article";
import React from "react";
import ReactPlayer from "react-player/youtube";

const YoutubeShortsMedia = ({
  article,
  isCurrentActive,
}: {
  article: Article;
  isCurrentActive: boolean;
}) => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <ReactPlayer
        url={article.videoUrl ?? ""}
        playing={isCurrentActive}
        controls={true}
        width="100%"
        height="100vh"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
        config={{
          playerVars: {
            start: 0,
            modestbranding: 1, // hides YouTube logo in controls
            rel: 0, // disables showing related videos from other channels
            showinfo: 0, // hides video title and uploader
          },
        }}
      />
    </div>
  );
};

export const YoutubeShorts = React.memo(YoutubeShortsMedia, () => {
  return true;
});
YoutubeShorts.displayName = "YoutubeShorts";
