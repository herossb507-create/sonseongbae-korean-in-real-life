import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserAccess } from "@/lib/auth";
import { ProGate } from "@/components/subscription/ProGate";
import { KDRAMA_PHRASES, KDRAMA_CATEGORIES } from "@/lib/kdrama-phrases";
import KDramaClient from "@/components/kdrama/KDramaClient";

export const metadata = {
  title: "K-Drama Phrases | Korean in Real Life",
  description: "Learn Korean through iconic K-Drama and movie expressions.",
};

export default async function KDramaPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { isPro } = await getUserAccess();
  if (!isPro) {
    return (
      <ProGate
        feature="K-Drama Phrases is Pro"
        description="Learn 60+ iconic Korean expressions from K-Dramas and movies. Upgrade to Pro to unlock this feature."
        backHref="/dashboard"
        backLabel="← Back to dashboard"
      />
    );
  }

  return (
    <KDramaClient phrases={KDRAMA_PHRASES} categories={KDRAMA_CATEGORIES} />
  );
}
