/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    api: 'modern',
    silenceDeprecations: ['legacy-js-api'],
  },
  // Configure for Netlify deployment
  output: 'standalone',
  images: {
    unoptimized: false,
  },
  // Ensure proper handling of environment variables
  env: {
    NEXT_PUBLIC_NETLIFY_API_URL: process.env.NEXT_PUBLIC_NETLIFY_API_URL,
  },
}

export default nextConfig
