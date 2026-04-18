/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    '/api/chat': ['./data/**/*.json'],
  },
}
module.exports = nextConfig
