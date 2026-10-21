import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_KR } from "next/font/google";
import { SITE_URL } from "@/lib/concerts/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto-kr",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Korean in Real Life",
  description: "Learn practical Korean for free — 16 chapters, audio, flashcards and games — plus a world map of K-pop concerts.",
  manifest: "/manifest.json",
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }, { url: "/icon-192.png", type: "image/png", sizes: "192x192" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Korean in Real Life",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFF5F8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${notoSansKr.variable} font-sans bg-[#FFF5F8] text-[#1E1225]`}>
        {children}
      </body>
    </html>
  );
}
