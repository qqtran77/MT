/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/:path*`,
      },
    ];
  },
  images: {
    domains: ['localhost', 'via.placeholder.com', 'picsum.photos'],
  },
};

module.exports = nextConfig;
