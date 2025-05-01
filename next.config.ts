// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//   images: {
//     remotePatterns: [new URL("https://lh3.googleusercontent.com/*")],
//   },
// };

// export default nextConfig;

// next.config.js or next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // domains: [
    //   "lh3.googleusercontent.com",
    //   "your-image-domain.com",
    //   "d7z3col9dhc88.cloudfront.net",
    // ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "d7z3col9dhc88.cloudfront.net",
      },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
};

export default nextConfig;
