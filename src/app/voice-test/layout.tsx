import type { Metadata } from "next";
import { PRIVATE_PAGE } from "@/lib/seo";

// Internal TTS test page.
export const metadata: Metadata = { ...PRIVATE_PAGE, title: "Voice test | Korean in Real Life" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
