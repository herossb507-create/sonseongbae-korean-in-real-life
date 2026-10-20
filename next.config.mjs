/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fully static site: `npm run build` writes plain HTML/JS/CSS to `out/`,
  // which Cloudflare Pages serves directly (no server, no functions).
  output: "export",
  images: {
    // The image optimizer needs a server; book covers are served as-is.
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
