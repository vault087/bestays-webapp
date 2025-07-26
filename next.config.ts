import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const config: NextConfig = {
  allowedDevOrigins: ["local-origin.dev", "*.local-origin.dev"],
  compiler: {
    // Enable React optimizations
    reactRemoveProperties: process.env.NODE_ENV === "production",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn-cms.pgimgs.com",
        pathname: "/static/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    // Use the correct value for cssChunking: true, false, or 'strict'
    cssChunking: true, // default value

    // If you want to disable CSS optimization entirely:
    optimizeCss: false,
  },
};

const withNextIntl = createNextIntlPlugin("src/modules/i18n/core/request.ts");
export default withNextIntl(config);
