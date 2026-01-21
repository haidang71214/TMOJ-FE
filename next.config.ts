// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    useLightningcss: true, // Kích hoạt Lightning CSS cho Tailwind v4 + Next.js 15
    // Các experimental khác nếu có (ví dụ: turbo: { ... } cho Turbopack)
  },
  images: {
    domains: [
      "assets.leetcode.com",
      "fpt.edu.vn",
      "images.unsplash.com",
      "res.cloudinary.com",
      "firebasestorage.googleapis.com",
    ],
  },
  // Các config khác (ví dụ: images, env,...)
};

module.exports = nextConfig;
