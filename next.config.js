const withPWA = require("next-pwa");

module.exports = withPWA({
  // module.exports = {
  i18n: {
    locales: ["es"],
    defaultLocale: "es",
  },
  reactStrictMode: true,
  output: 'standalone',
  // swcMinify: true,
  compiler: {
    removeConsole: true,
  },
  images: {
    domains: ["robohash.org", "res.cloudinary.com"],
  },
  pwa: {
    dest: "public",
    skipWaiting: true,
    disable: true,
  },
  // };
});
