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
    ],
  },
};

const withNextIntl = createNextIntlPlugin("src/modules/i18n/libs/core/request.ts");
export default withNextIntl(config);
