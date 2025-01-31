import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 60,
      static: 60,
    },
    optimizeCss: true,
    optimisticClientCache: true,
    webVitalsAttribution: ["CLS", "LCP"],
    optimizePackageImports: ["@/components/ui", "lodash", "framer-motion"],
    optimizeServerReact: true,
    scrollRestoration: true,
    mdxRs: true,
    ppr: true,
    reactCompiler: true,
  },
  bundlePagesRouterDependencies: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  productionBrowserSourceMaps: true,
  compress: true,
  poweredByHeader: false,
  generateEtags: true,

  images: {
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: 'https',
        hostname: 'www.techstart.ps',
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ipsd.ps",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
