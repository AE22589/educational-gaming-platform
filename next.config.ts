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
};
export default config;
