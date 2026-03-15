import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 전자책 MD 파일을 빌드 시 읽기 위한 설정
  pageExtensions: ["ts", "tsx", "js", "jsx"],
};

export default nextConfig;
