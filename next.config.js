/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Exclude test and debug files from build
  experimental: {
    serverComponentsExternalPackages: [],
  },
}

module.exports = nextConfig
