import { Article } from "@/db/schema/article";
import Image from "next/image";
import React, { useState } from "react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const ImageTextMedia = ({ article }: { article: Article }) => {
  const [slideWidths, setSlideWidths] = useState<Record<string, number>>({});

  const handleLoad = (url: string, nw: number, nh: number) => {
    const hPx = window.innerHeight * 0.4;
    const newWidth = (nw / nh) * hPx;
    setSlideWidths((prev) => {
      if (prev[url] === newWidth) return prev; // Prevent re-renders
      return { ...prev, [url]: newWidth };
    });
  };
  return (
    <>
      {/* IMAGE CAROUSEL */}
      {article.imageUrls?.length && article.imageUrls?.length > 1 && (
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
      {article.imageUrls?.length === 1 && (
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
      {(!article.imageUrls || article.imageUrls.length === 1) && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
      )}
    </>
  );
};

export const ImageText = React.memo(ImageTextMedia, () => {
  return true;
});
ImageText.displayName = "ImageText";
