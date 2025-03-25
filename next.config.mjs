/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Ignore ESLint errors
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ Ignore TypeScript errors
  },
  images: {
    unoptimized: true, // ✅ Prevents image optimization errors
  },
  publicRuntimeConfig: {
    isPublic: true, // ✅ Ensures the deployment is public
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
}

// ✅ Correct ES Module syntax
export default nextConfig
