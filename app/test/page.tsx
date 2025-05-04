"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules"; // ← note: import modules from 'swiper', not 'swiper/modules'
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";
import { useState } from "react";

const article = {
  imageUrls: [
    "https://d7z3col9dhc88.cloudfront.net/54317f98-097d-40b9-ad1a-0a7a1a825991_resource-group-default-cover.jpeg",
    "https://d7z3col9dhc88.cloudfront.net/75a0e0ca-a307-4258-90e3-4620810d1892_default-folder.jpeg",
    "https://d7z3col9dhc88.cloudfront.net/fc5fdede-bdfa-4b30-84d9-4290b43ce3b8_4a0fdd13-6fdc-48ce-b0d8-56f243ce5da6.webp",
    "https://d7z3col9dhc88.cloudfront.net/3a11e0c7-51b4-42de-862e-78a69696ae20_d1abb0ea-3c25-4269-aba9-5fc5fe556caa.webp",
  ],
};

export default function NewsSlider() {
  const [slideWidths, setSlideWidths] = useState<Record<string, number>>({});
  const handleLoad = (url: string, nw: number, nh: number) => {
    const hPx = window.innerHeight * 0.4;
    setSlideWidths((w) => ({ ...w, [url]: (nw / nh) * hPx }));
  };
  return (
    <div className="w-full h-screen overflow-hidden">
      <Swiper
        modules={[Pagination, Autoplay]}
        slidesPerView={1}
        centeredSlides
        loop
        pagination={{ clickable: true }}
        autoplay={false}
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

      {/* <Swiper
        slidesPerView={1}
        loop
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        modules={[Autoplay, Pagination]}
        className="w-full h-full"
      >
        {imageUrls?.map((imageUrl, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-screen overflow-hidden">

              <img
                src={imageUrl}
                alt="blur-background"
                className="absolute w-full h-full object-cover blur-2xl scale-110"
              />

              
              <img
                src={imageUrl}
                alt={"title"}
                className="relative z-10 max-h-[90vh] max-w-full mx-auto my-auto object-contain"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper> */}
    </div>
  );
}
