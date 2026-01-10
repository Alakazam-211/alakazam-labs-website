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
  // Exclude React Three Fiber from server-side bundle (works with both webpack and turbopack)
  serverExternalPackages: ['@react-three/fiber', '@react-three/drei', 'three'],
  // Add empty turbopack config to allow webpack config to work
  turbopack: {},
  webpack: (config, { isServer }) => {
    // Exclude React Three Fiber from server-side bundle
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        '@react-three/fiber': 'commonjs @react-three/fiber',
        '@react-three/drei': 'commonjs @react-three/drei',
        'three': 'commonjs three',
      });
    } else {
      // For client-side, mark these as external to prevent SSR issues
      // They'll be loaded dynamically at runtime
      config.resolve.alias = config.resolve.alias || {};
      // Don't alias, but ensure they're treated as external dependencies
    }
    return config;
  },
}

module.exports = nextConfig

