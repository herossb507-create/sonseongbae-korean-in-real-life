/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@lemonsqueezy/lemonsqueezy.js"],
  typescript: {
    // Supabase DB 타입이 생성되기 전까지 임시로 허용
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
