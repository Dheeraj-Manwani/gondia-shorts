import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import ReactPlayer from "react-player/youtube";
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";
import { ArticleType } from "@prisma/client/index.js";
import { Article } from "@/db/schema/article";
import chalk from "chalk";

interface NewsMediaProp {
  article: Article;
  isCurrentActive: boolean;
}

const NewsMediaComp = ({ article, isCurrentActive }: NewsMediaProp) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoMuted, setVideoMuted] = useState(true);
  const [slideWidths, setSlideWidths] = useState<Record<string, number>>({});

  const handleLoad = (url: string, nw: number, nh: number) => {
    const hPx = window.innerHeight * 0.4;
    const newWidth = (nw / nh) * hPx;
    setSlideWidths((prev) => {
      if (prev[url] === newWidth) return prev; // Prevent re-renders
      return { ...prev, [url]: newWidth };
    });
  };

  // Video intersection autoplay
  useEffect(() => {
    if (article.type === ArticleType.VIDEO_N_TEXT && videoRef.current) {
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

  useEffect(() => {
    console.log(
      chalk.red("News MEdia component re rendered ::::::::::: ======= ")
    );
  }, []);

  return (
    <div className="h-[40vh] flex items-center justify-center bg-gray-200 relative">
      {/* Video */}
      {article.type === ArticleType.VIDEO_N_TEXT && article.videoUrl && (
        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            src={article.videoUrl}
            className="w-full h-full object-cover"
            muted
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
            className="absolute bottom-4 right-4 p-2 bg-black/40 rounded-full"
          >
            {videoMuted ? "🔇" : "🔊"}
          </button>
        </div>
      )}

      {/* IMAGE CAROUSEL */}
      {article.type === ArticleType.IMAGE_N_TEXT &&
        article.imageUrls?.length &&
        article.imageUrls?.length > 1 && (
          <Swiper
            modules={[Pagination, Autoplay, Navigation]}
            slidesPerView={1}
            centeredSlides
            loop
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000 }}
            spaceBetween={2}
            className="w-full h-full"
          >
            {article.imageUrls.map((url, idx) => {
              const width = slideWidths[url];
              return (
                <SwiperSlide
                  key={idx}
                  className="relative w-full h-full overflow-hidden flex items-center justify-center"
                >
                  {/* Blurred Background */}
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={url}
                      alt={`bg ${idx}`}
                      fill
                      priority={false}
                      style={{
                        objectFit: "cover",
                        filter: "blur(20px)",
                        transform: "scale(1.1)",
                      }}
                      onLoadingComplete={({ naturalWidth, naturalHeight }) =>
                        handleLoad(url, naturalWidth, naturalHeight)
                      }
                    />
                  </div>

                  {/* Foreground */}
                  <div
                    className="relative z-10 m-auto"
                    style={{
                      height: "40vh",
                      width: width ? `${width}px` : "auto",
                    }}
                  >
                    <Image
                      src={url}
                      alt={`slide ${idx}`}
                      fill
                      priority
                      style={{ objectFit: "contain" }}
                      onLoadingComplete={({ naturalWidth, naturalHeight }) =>
                        handleLoad(url, naturalWidth, naturalHeight)
                      }
                    />
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}

      {/* SINGLE IMAGE */}
      {article.type === ArticleType.IMAGE_N_TEXT &&
        article.imageUrls?.length === 1 && (
          <div className="relative h-[40vh] w-full">
            <Image
              src={article.imageUrls[0]}
              alt="Cover"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        )}

      {/* Image gradient overlay - only for single image */}
      {article.type == ArticleType.IMAGE_N_TEXT &&
        (!article.imageUrls || article.imageUrls.length === 1) && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        )}
      {/* YOUTUBE */}
      {article.type == ArticleType.YOUTUBE && article.videoUrl && (
        <div
          style={{
            width: "100vw",
            height: "40vh",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <ReactPlayer
            url={article.videoUrl}
            playing={isCurrentActive}
            controls={true}
            width="100%"
            height="100%"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
            }}
            config={{
              playerVars: {
                start: 15,
                modestbranding: 1, // hides YouTube logo in controls
                rel: 0, // disables showing related videos from other channels
                showinfo: 0, // hides video title and uploader
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export const NewsMedia = React.memo(NewsMediaComp, () => {
  return true;
});
NewsMedia.displayName = "NewsMedia";
