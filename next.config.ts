import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com"], // allow Cloudinary domain
  },
};

export default nextConfig;
