import { KDRAMA_PHRASES, KDRAMA_CATEGORIES } from "@/lib/kdrama-phrases";
import KDramaClient from "@/components/kdrama/KDramaClient";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "K-Drama Korean Phrases: Iconic Lines Explained",
  description: "Learn Korean through iconic K-drama and movie expressions, with meanings, romanization and audio.",
  path: "/kdrama",
});

export default function KDramaPage() {
  return (
    <KDramaClient phrases={KDRAMA_PHRASES} categories={KDRAMA_CATEGORIES} />
  );
}
