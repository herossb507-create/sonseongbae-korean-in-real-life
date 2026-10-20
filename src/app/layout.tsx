import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto-kr",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Korean in Real Life",
  description: "한국어를 실생활에서 배우는 구독형 학습 플랫폼",
  manifest: "/manifest.json",
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
