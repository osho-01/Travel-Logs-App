/** @type {import('next').NextConfig} */

let userConfig = {}

import('./v0-user-next.config.mjs')
  .then((config) => {
    userConfig = config.default || config
  })
  .catch(() => {
    console.log("⚠️  No custom user config found. Using default settings.")
  })

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  publicRuntimeConfig: {
    isPublic: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
}

export default mergeConfig(nextConfig, userConfig)

function mergeConfig(defaultConfig, userConfig) {
  if (!userConfig) {
    return defaultConfig
  }

  return {
    ...defaultConfig,
    ...userConfig,
  }
}
