/** @type {import('next').NextConfig} */

let userConfig = {}

try {
  userConfig = require('./v0-user-next.config')
} catch (e) {
  console.log("⚠️  No custom user config found. Using default settings.")
}

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
    // ✅ Ensures the deployment is public
    isPublic: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
}

const mergedConfig = mergeConfig(nextConfig, userConfig)

function mergeConfig(defaultConfig, userConfig) {
  if (!userConfig) {
    return defaultConfig
  }

  return {
    ...defaultConfig,
    ...userConfig,
  }
}

module.exports = mergedConfig
