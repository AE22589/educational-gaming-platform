import type { Metadata } from "next";
import { MyFriend } from "./MyFriend";

export const metadata: Metadata = { title: "My Little Friend · Chispitas" };

export default function MyFriendPage() {
  return <MyFriend basePath={process.env.NEXT_PUBLIC_BASE_PATH ?? ""} />;
}
