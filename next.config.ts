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
    domains: ["lh3.googleusercontent.com", "your-image-domain.com"], // 👈 add all required domains here
  },
};

export default nextConfig;
