"use client";

import NewsCard from "@/components/NewsCard";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const imageUrls = [
  "https://d7z3col9dhc88.cloudfront.net/54317f98-097d-40b9-ad1a-0a7a1a825991_resource-group-default-cover.jpeg",
  "https://d7z3col9dhc88.cloudfront.net/75a0e0ca-a307-4258-90e3-4620810d1892_default-folder.jpeg",
  "https://d7z3col9dhc88.cloudfront.net/fc5fdede-bdfa-4b30-84d9-4290b43ce3b8_4a0fdd13-6fdc-48ce-b0d8-56f243ce5da6.webp",
  "https://d7z3col9dhc88.cloudfront.net/3a11e0c7-51b4-42de-862e-78a69696ae20_d1abb0ea-3c25-4269-aba9-5fc5fe556caa.webp",
];

const newImageUrl = [
  "https://images.unsplash.com/photo-1549366021-9f761d450615?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1535941339077-2dd1c7963098?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1543682704-15fd2a5b320d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",
];

export default function Test() {
  return (
    <div className="bg-violet-400 h-screen w-screen">
      <article className="news-card w-full h-full bg-white overflow-hidden relative flex flex-col">
        <div className="h-[40vh] relative bg-gray-200 m-auto">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: true }}
            className="h-full w-full"
            onClick={(swiper, e) => e.stopPropagation()}
          >
            {newImageUrl.map((imgUrl, index) => (
              <SwiperSlide key={index}>
                <img
                  height={500}
                  width={500}
                  src={imgUrl}
                  alt={`Image ${index}`}
                  className="w-full h-full object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="absolute bottom-0 left-0 right-0 z-10 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center"></div>
          </div>
        </div>
      </article>
    </div>
  );
}
