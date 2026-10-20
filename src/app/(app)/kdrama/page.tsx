import { KDRAMA_PHRASES, KDRAMA_CATEGORIES } from "@/lib/kdrama-phrases";
import KDramaClient from "@/components/kdrama/KDramaClient";

export const metadata = {
  title: "K-Drama Phrases | Korean in Real Life",
  description: "Learn Korean through iconic K-Drama and movie expressions.",
};

export default function KDramaPage() {
  return (
    <KDramaClient phrases={KDRAMA_PHRASES} categories={KDRAMA_CATEGORIES} />
  );
}
