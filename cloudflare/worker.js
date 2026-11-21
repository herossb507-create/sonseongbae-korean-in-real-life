// Runs only for the paths listed in wrangler.jsonc → assets.run_worker_first;
// everything else is served straight from the static files in out/.
import { LINKS, FALLBACK } from "./links.js";

// Why: static-asset serving redirects "/name.html" to "/name", but Google's
// HTML-file site verification expects the exact file at the exact URL.
const GOOGLE_VERIFICATION_FILE = "google76f349ea99c14637.html";

// Link-preview fetchers (Instagram, X, Slack, ...) open the link without a person.
const BOT_UA = /bot|crawl|spider|preview|facebookexternalhit|embedly|slurp|whatsapp|telegram/i;

const clean = (value, max = 64) =>
  (value ?? "").toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, max);

// /go/<slug>?src=ig&post=1114 → logs one click (Analytics Engine), then redirects.
// See docs/PROMO-LINKS.md for the column layout and report queries.
function handleGo(request, env, url) {
  const slug = clean(url.pathname.slice("/go/".length).replace(/\/+$/, ""));
  const target = LINKS[slug] ?? FALLBACK;
  const src = clean(url.searchParams.get("src")) || "direct";
  const post = clean(url.searchParams.get("post")) || "-";
  const ua = request.headers.get("user-agent") ?? "";
  let referrer = "-";
  try {
    referrer = new URL(request.headers.get("referer")).hostname.slice(0, 64);
  } catch {}

  try {
    env.CLICKS?.writeDataPoint({
      indexes: [slug || "-"],
      blobs: [
        slug || "-", // blob1
        src, // blob2
        post, // blob3
        request.cf?.country ?? "-", // blob4
        referrer, // blob5
        BOT_UA.test(ua) ? "bot" : "human", // blob6
      ],
      doubles: [1],
    });
  } catch {}

  // On-site destinations keep the channel as UTM tags.
  let location = target;
  if (target.startsWith("/")) {
    const dest = new URL(target, url.origin);
    dest.searchParams.set("utm_source", src);
    dest.searchParams.set("utm_medium", "social");
    if (post !== "-") dest.searchParams.set("utm_campaign", post);
    location = dest.toString();
  }
  return new Response(null, {
    status: 302,
    headers: { location, "cache-control": "no-store" },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;
    if (pathname === `/${GOOGLE_VERIFICATION_FILE}`) {
      return new Response(`google-site-verification: ${GOOGLE_VERIFICATION_FILE}`, {
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
    if (pathname.startsWith("/go/")) return handleGo(request, env, url);
    return env.ASSETS.fetch(request);
  },
};
