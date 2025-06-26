import { Article } from "@/db/schema/article";
import React, { useEffect, useRef, useState } from "react";

const VideoTextMedia = ({ article }: { article: Article }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);

  // Video intersection autoplay
  useEffect(() => {
    if (videoRef.current) {
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            videoRef.current!.play();
            setIsPlaying(true);
          } else {
            videoRef.current!.pause();
            setIsPlaying(false);
          }
        },
        { threshold: 0.5 }
      );
      obs.observe(videoRef.current);
      return () => obs.disconnect();
    }
  }, [article.type]);

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        src={article.videoUrl ?? ""}
        className="w-full h-full object-cover"
        playsInline
        loop
        onClick={() => {
          if (videoRef.current) {
            if (isPlaying) {
              videoRef.current.pause();
            } else {
              videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
          }
        }}
      />
      {/* mute/unmute */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (videoRef.current) {
            videoRef.current.muted = !videoMuted;
            setVideoMuted(!videoMuted);
          }
        }}
        className="absolute bottom-5 right-5 p-2 bg-gray-800/40 rounded-full"
      >
        {videoMuted ? "🔇" : "🔊"}
      </button>
    </div>
  );
};

export const VideoText = React.memo(VideoTextMedia, () => {
  return true;
});
VideoText.displayName = "VideoText";
