/** @type {import('next').NextConfig} */
const nextConfig = {
  // ...existing config...
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'accelerometer=*, autoplay=*, clipboard-write=*, encrypted-media=*, gyroscope=*, picture-in-picture=*' 
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://www.youtube.com"
          }
        ],
      }
    ];
  }
};

module.exports = nextConfig;
