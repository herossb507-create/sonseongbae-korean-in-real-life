// Tells Bing, Yandex, Seznam and other IndexNow search engines which concert pages
// changed, so they re-crawl them within days instead of weeks. (Google doesn't use
// IndexNow; it reads the sitemap.) Run after the deploy is live — the engines fetch
// the key file from the site to check we own it.
//
//   node scripts/concerts/indexnow.mts                     # pages of concerts updated today
//   node scripts/concerts/indexnow.mts --since 2026-11-15  # updated on or after a date
//   node scripts/concerts/indexnow.mts --all               # every concert page

import { loadData, today } from "./lib.mts";
import { citySlug } from "../../src/lib/concerts/format.ts";

const KEY = "ceda3804eb0f5319f5430ae2b94d3193"; // also served as /<KEY>.txt (public/)
const SITE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://korean-in-real-life.herossb507.workers.dev").replace(/\/$/, "");

const args = process.argv.slice(2);
const all = args.includes("--all");
const sinceAt = args.indexOf("--since");
const since = sinceAt >= 0 ? args[sinceAt + 1] : today();

const { concerts, venues } = loadData();
const venueById = new Map(venues.map((v) => [v.id, v]));
const changed = all ? concerts : concerts.filter((c) => c.updatedAt >= since);
if (changed.length === 0) {
  console.log(`No concerts updated since ${since}; nothing to send.`);
  process.exit(0);
}

const paths = new Set(["/concerts", "/concerts/artists", "/concerts/cities"]);
for (const c of changed) {
  paths.add(`/concerts/${c.id}`);
  paths.add(`/concerts/artists/${c.artistId}`);
  const v = venueById.get(c.venueId);
  if (v) paths.add(`/concerts/cities/${citySlug(v)}`);
}
const urlList = [...paths].map((p) => `${SITE}${p}`);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(SITE).host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList }),
});
// 200 = accepted, 202 = accepted (key check pending); 403 = key file not reachable yet.
console.log(`IndexNow: ${res.status} ${res.statusText} — ${urlList.length} URLs (${changed.length} concerts since ${all ? "the start" : since})`);
if (res.status >= 400) process.exit(1);
