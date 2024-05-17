const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  mode: 'production',
});

/** @type {import('next').NextConfig} */
module.exports = withPWA({
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com',
      },
      {
        protocol: 'https',
        hostname: 'seeklogo.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/auth/signin',
        permanent: true,
      },
    ];
  },
});
