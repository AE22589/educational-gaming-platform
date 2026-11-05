import type { NextConfig } from "next";
const config: NextConfig = {
  poweredByHeader: false,
  agentRules: false,
  output: "export",
  trailingSlash: true,
  ...(process.env.NODE_ENV === "development" && process.env.NEXT_DEV_DIST_DIR
    ? { distDir: process.env.NEXT_DEV_DIST_DIR }
    : {}),
  ...(process.env.GITHUB_ACTIONS === "true"
    ? { basePath: "/educational-gaming-platform" }
    : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH:
      process.env.GITHUB_ACTIONS === "true" ? "/educational-gaming-platform" : "",
  },
};
export default config;
