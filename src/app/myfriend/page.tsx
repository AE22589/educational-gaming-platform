import { CompanionArea } from "@/features/avatar/ui/CompanionArea";
export default function MyFriendPage() { return <CompanionArea basePath={process.env.NEXT_PUBLIC_BASE_PATH ?? ""} />; }
