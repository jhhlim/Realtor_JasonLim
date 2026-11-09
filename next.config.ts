import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.simplyrets.com" },
      { protocol: "http", hostname: "cdn.simplyrets.com" },
      { protocol: "https", hostname: "s3-us-west-2.amazonaws.com" },
      { protocol: "https", hostname: "**.amazonaws.com" },
      { protocol: "https", hostname: "photos.prod.cirrussystem.net" },
      { protocol: "https", hostname: "**.realtourvision.com" },
      { protocol: "https", hostname: "**.mlsgrid.com" },
      { protocol: "https", hostname: "**.rdx.com" },
    ],
  },
};

export default nextConfig;
