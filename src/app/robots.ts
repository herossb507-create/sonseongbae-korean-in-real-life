import type { MetadataRoute } from "next";
import { hasSampleData } from "@/lib/concerts/data";
import { SITE_URL } from "@/lib/concerts/site";

export default function robots(): MetadataRoute.Robots {
  // Keep the site out of search engines if fictional sample concerts are ever loaded.
  if (hasSampleData()) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/settings", "/voice-test"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
