import { notFound } from "next/navigation";
import { DIALOGUE_SCENARIOS } from "@/lib/dialogue-data";
import DialogueViewer from "@/components/dialogues/DialogueViewer";

interface Props {
  params: Promise<{ scenarioId: string }>;
}

export async function generateStaticParams() {
  return DIALOGUE_SCENARIOS.map((s) => ({ scenarioId: s.id }));
}

export async function generateMetadata({ params }: Props) {
  const { scenarioId } = await params;
  const scenario = DIALOGUE_SCENARIOS.find((s) => s.id === scenarioId);
  if (!scenario) return { title: "Not Found" };
  return {
    title: `${scenario.title} | Korean in Real Life`,
    description: `Practice: ${scenario.setting}`,
  };
}

export default async function DialogueDetailPage({ params }: Props) {
  const { scenarioId } = await params;
  const scenario = DIALOGUE_SCENARIOS.find((s) => s.id === scenarioId);

  if (!scenario) {
    notFound();
  }

  return <DialogueViewer scenario={scenario} />;
}
