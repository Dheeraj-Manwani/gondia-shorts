"use client";

import React, { useState, useRef, useEffect } from "react";
import { v4 as uuid } from "uuid";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";
import { ArticleType } from "@prisma/client/index.js";
import { Article } from "@/db/schema/news";
import CommentModal from "@/components/comments/CommentModal";
// import { useTranslate } from "@/hooks/use-translate";
// import { translateToHindi } from "@/lib/translateService";
import ReactPlayer from "react-player/youtube";
import { Bookmark, Heart, MessageSquareMore, Share2 } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface NewsCardProps {
  isCurrentActive: boolean;
  isPreview?: boolean;
  isPreviewActive?: boolean;
  article: Article;
}

export default function NewsCard({
  isCurrentActive,
  isPreview = false,
  isPreviewActive = false,
  article,
}: NewsCardProps) {
  // const { isHindi } = useTranslate();
  // const [translatedHeadline, setTranslatedHeadline] = useState(article.title);
  // const [translatedSummary, setTranslatedSummary] = useState(article.content);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoMuted, setVideoMuted] = useState(true);

  // Translation effect
  // useEffect(() => {
  //   (async () => {
  //     if (isHindi) {
  //       try {
  //         setTranslatedHeadline(await translateToHindi(article.title));
  //         setTranslatedSummary(await translateToHindi(article.content));
  //       } catch {
  //         /* ignore */
  //       }
  //     } else {
  //       setTranslatedHeadline(article.title);
  //       setTranslatedSummary(article.content);
  //     }
  //   })();
  // }, [isHindi, article.title, article.content]);

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

  // --- IMAGE SLIDER LOGIC ---
  // we track each image's computed width (in px) so that
  // container = 40vh tall, and width = aspectRatio * 40vhPx
  // const [slideWidths, setSlideWidths] = useState<Record<string, number>>({});

  // store computed widths so slides size correctly
  const [slideWidths, setSlideWidths] = useState<Record<string, number>>({});

  // compute width for 40vh based on natural dimensions
  // const handleLoad = (url: string, nw: number, nh: number) => {
  //   const hPx = window.innerHeight * 0.4;
  //   setSlideWidths((w) => ({ ...w, [url]: (nw / nh) * hPx }));
  // };

  const handleLoad = (url: string, nw: number, nh: number) => {
    const hPx = window.innerHeight * 0.4;
    const newWidth = (nw / nh) * hPx;
    setSlideWidths((prev) => {
      if (prev[url] === newWidth) return prev; // Prevent re-renders
      return { ...prev, [url]: newWidth };
    });
  };

  // const handleImageLoad = (
  //   url: string,
  //   naturalWidth: number,
  //   naturalHeight: number
  // ) => {
  //   const vh40px = window.innerHeight * 0.4;
  //   const computedWidth = (naturalWidth / naturalHeight) * vh40px;
  //   setSlideWidths((w) => ({ ...w, [url]: computedWidth }));
  // };

  if (isPreview && !isPreviewActive) return null; // don't render if not active
  const articleIdForPreview = uuid();
  // --- RENDERS ---
  return (
    <article
      key={isPreview ? articleIdForPreview : article.id}
      className="w-full h-full bg-white flex flex-col overflow-hidden"
    >
      {/* MEDIA */}
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

      {/* SOCIAL ACTIONS */}
      <div
        className={twMerge(
          "px-4 py-2 flex items-center justify-between border-b border-gray-700",
          isPreview ? "pointer-events-none cursor-not-allowed" : ""
        )}
      >
        <div className="flex space-x-4">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="cursor-pointer"
          >
            {isLiked ? (
              <Heart size={18} className="fill-red-500 text-red-500" />
            ) : (
              <Heart size={18} className="text-gray-700" />
            )}
          </button>
          <button
            onClick={() => setIsCommentModalOpen(true)}
            className="cursor-pointer"
          >
            <MessageSquareMore size={18} className="text-gray-700" />
          </button>
          <button
            onClick={() =>
              window.open(
                `https://api.whatsapp.com/send?text=${encodeURIComponent(
                  article.title + " " + window.location.href
                )}`,
                "_blank"
              )
            }
            className="text-gray-700 cursor-pointer"
          >
            <Share2 size={18} className="text-gray-700" />
          </button>
        </div>
        <button
          onClick={() => setIsSaved(!isSaved)}
          className="p-1 rounded-full transition-colors cursor-pointer"
          aria-label="Save"
        >
          {
            isSaved ? (
              <Bookmark size={18} className="fill-black text-black" />
            ) : (
              <Bookmark size={18} className="text-gray-700" />
            )
            // (
            //   <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
            //     <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
            //   </svg>
            // ) : (
            //   <svg
            //     className="w-7 h-7"
            //     fill="none"
            //     stroke="currentColor"
            //     viewBox="0 0 24 24"
            //   >
            //     <path
            //       strokeLinecap="round"
            //       strokeLinejoin="round"
            //       strokeWidth="2"
            //       d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            //     />
            //   </svg>
            // )
          }
        </button>
      </div>

      {/* TEXT CONTENT */}
      <div className="p-4 flex-1 flex flex-col">
        <h2 className="font-bold text-xl mb-2">{article.title}</h2>
        <p className="flex-1 text-gray-700">{article.content}</p>
      </div>

      {/* COMMENTS */}
      {isCommentModalOpen && (
        <CommentModal
          article={article}
          isOpen={true}
          onClose={() => setIsCommentModalOpen(false)}
        />
      )}
    </article>
  );
}
