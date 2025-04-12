//@ts-check
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require("@nx/next");
const createNextIntlPlugin = require("next-intl/plugin");
const withNextIntl = createNextIntlPlugin();
/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  reactStrictMode: false,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript type checking errors during build
  },
  webpack(config, { dev }) {
    if (dev) {
      // Enable parallelization for faster compilation
      config.parallelism = 4;

      // Enable persistent caching to speed up incremental builds
      config.cache = {
        type: "filesystem",
        buildDependencies: {
          config: [__filename],
        },
      };
      config.resolve = {
        ...config.resolve,
        symlinks: false, // Prevents Webpack from following symlinks in node_modules
      };
    }

    return config;
  },
  transpilePackages: ["lucide-react"],
  cacheHandler: process.env.CACHE_MEMORY === "REDIS" ? require.resolve("./cache-handler.mjs") : undefined,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(self), fullscreen=(self), geolocation=(self)",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/:locale/robots.txt",
        destination: "/api/robots",
      },
      {
        source: "/:locale/:slug.xml",
        destination: "/api/sitemap",
      },
    ];
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(withNextIntl(nextConfig));
