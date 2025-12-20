/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.fillout.com',
      },
      {
        protocol: 'https',
        hostname: 'ratings.discover-nocode.com',
      },
    ],
  },
}

module.exports = nextConfig

