/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "i.ibb.co",
      "velog.velcdn.com", // ✅ 여기에 추가됨
    ],
  },
  reactStrictMode: false,
};

module.exports = nextConfig;
