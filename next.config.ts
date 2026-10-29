import type { NextConfig } from "next";
const config: NextConfig = {
  poweredByHeader: false,
  agentRules: false,
  output: "export",
  trailingSlash: true,
  ...(process.env.GITHUB_ACTIONS === "true"
    ? { basePath: "/educational-gaming-platform" }
    : {}),
};
export default config;
