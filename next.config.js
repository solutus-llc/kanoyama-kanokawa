/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/kanoyama-kanokawa' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/kanoyama-kanokawa/' : '',
}

module.exports = nextConfig