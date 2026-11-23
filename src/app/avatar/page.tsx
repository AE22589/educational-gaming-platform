import { CompanionArea } from "@/features/avatar/ui/CompanionArea";
export default function Avatar() { return <CompanionArea basePath={process.env.NEXT_PUBLIC_BASE_PATH ?? ""} />; }
