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
  experimental: {
    // undici (dependencia de @vercel/blob) usa sintaxis que el webpack de
    // Next 14 no puede parsear si se intenta bundlear; se deja como
    // require nativo de Node en vez de pasar por el compilador.
    serverComponentsExternalPackages: ["@vercel/blob"],
  },
});