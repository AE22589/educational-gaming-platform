import type { Metadata } from "next";
import { homepageSampleData } from "@/features/homepage/data";
import { HomepageContent } from "@/features/homepage/ui/HomepageContent";

export const metadata: Metadata = {
  title: "CHISPITAS | Learning Platform for Bilingual Schools",
  description:
    "A bilingual English and Science learning adventure for primary school children.",
};

export default function Home() {
  return <HomepageContent data={homepageSampleData} />;
}
