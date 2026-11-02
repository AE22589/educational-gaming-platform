import { CaveRoom } from "@/features/avatar/ui/CaveRoom";

export default function Avatar() {
  const basePath =
    process.env.GITHUB_ACTIONS === "true" ? "/educational-gaming-platform" : "";

  return <CaveRoom basePath={basePath} />;
}
