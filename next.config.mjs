/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Disable client-side router cache for dynamic pages so that navigating
    // back to /staff always makes a fresh server request (with cookie) instead
    // of serving a cached redirect from a previous unauthenticated visit.
    staleTimes: {
      dynamic: 0,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

export default nextConfig
