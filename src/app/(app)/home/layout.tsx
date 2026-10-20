import type { Metadata } from "next";
import { PRIVATE_PAGE } from "@/lib/seo";

// Shows progress saved in this browser only, so there's nothing for search engines here.
export const metadata: Metadata = { ...PRIVATE_PAGE, title: "Home | Korean in Real Life" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
