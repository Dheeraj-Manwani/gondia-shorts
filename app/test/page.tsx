"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules"; // ← note: import modules from 'swiper', not 'swiper/modules'
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";

const imageUrls = [
  "https://d7z3col9dhc88.cloudfront.net/54317f98-097d-40b9-ad1a-0a7a1a825991_resource-group-default-cover.jpeg",
  "https://d7z3col9dhc88.cloudfront.net/75a0e0ca-a307-4258-90e3-4620810d1892_default-folder.jpeg",
  "https://d7z3col9dhc88.cloudfront.net/fc5fdede-bdfa-4b30-84d9-4290b43ce3b8_4a0fdd13-6fdc-48ce-b0d8-56f243ce5da6.webp",
  "https://d7z3col9dhc88.cloudfront.net/3a11e0c7-51b4-42de-862e-78a69696ae20_d1abb0ea-3c25-4269-aba9-5fc5fe556caa.webp",
];

// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";

export default function NewsSlider({ data }: { data: any[] }) {
  return (
    <div className="w-full h-screen overflow-hidden">
      <Swiper
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
              {/* Blurred Background Image */}
              <img
                src={imageUrl}
                alt="blur-background"
                className="absolute w-full h-full object-cover blur-2xl scale-110"
              />

              {/* Foreground Image */}
              <img
                src={imageUrl}
                alt={"title"}
                className="relative z-10 max-h-[90vh] max-w-full mx-auto my-auto object-contain"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
