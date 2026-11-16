/** @type {import('next').NextConfig} */
/* const nextConfig = {}

module.exports = nextConfig
 */

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

module.exports = withPWA({
  // Tu configuración existente de Next.js
  experimental: {
    serverActions: {
      allowedOrigin: ['cajeroenlinea.celtatsas.com.ar', 'celtatsas.com.ar'],
    }
  }
});