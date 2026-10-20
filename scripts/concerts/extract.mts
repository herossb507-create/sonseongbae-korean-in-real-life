// Turns an official tour announcement into a reviewable candidate in data/concerts/inbox/.
//
//   npm run concerts:extract -- https://example.com/notice/123
//   npm run concerts:extract -- poster.jpg --source-url https://x.com/artist/status/123
//   npm run concerts:extract -- notice.txt --source-url https://weverse.io/...
//
// Nothing is published: open the JSON it writes, fix anything wrong, set
// "status": "approved", then run `npm run concerts:apply -- <file>`.
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import { z } from "zod";
import { INBOX, type InboxCandidate, loadData, today, writeJson } from "./lib.mts";

const MODEL = "claude-opus-5-5";
const IMAGE_TYPES = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif" } as const;
const MAX_TEXT_CHARS = 300_000;

const Extraction = z.object({
  artistName: z.string().describe("Artist name exactly as written in the announcement"),
  artistId: z.string().nullable().describe("id from the known-artists list, or null if not listed"),
  tour: z.string().describe("Tour or event name as written"),
  announcementDate: z.string().nullable().describe("YYYY-MM-DD the notice was posted, if stated"),
  ticketLinks: z.array(
    z.object({
      label: z.string().describe("Seller or page name, e.g. Ticketmaster, NOL World, Weverse fanclub notice"),
      url: z.string().describe("A URL that appears verbatim in the source"),
      kind: z.enum(["primary", "fanclub", "presale", "resale"]),
    }),
  ),
  shows: z.array(
    z.object({
      date: z.string().describe("YYYY-MM-DD, local date at the venue"),
      time: z.string().nullable().describe("HH:mm 24-hour local start time, or null if not stated"),
      city: z.string(),
      countryCode: z.string().describe("ISO 3166-1 alpha-2"),
      venueName: z.string().nullable().describe("Venue as written, or null if the source gives only a city"),
      venueId: z.string().nullable().describe("id from the known-venues list when it is clearly the same venue, else null"),
      ticketOpen: z.string().nullable().describe("YYYY-MM-DD general sale opens, if stated for this show"),
      notes: z.string().nullable().describe("Short factual note from the source, e.g. 'Added show'"),
      idRequired: z.boolean().nullable().describe("true if the source says photo ID / passport is checked at entry"),
    }),
  ),
  warnings: z.array(z.string()).describe("Anything uncertain: inferred years, ambiguous venues, unreadable text"),
});

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: { "source-url": { type: "string" } },
});
const input = positionals[0];
if (!input) {
  console.error("Usage: npm run concerts:extract -- <url | file.txt | poster.jpg> [--source-url <url>]");
  process.exit(1);
}

function htmlToText(html: string) {
  return html
    .replace(/<(script|style|noscript|svg)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<a\s[^>]*href="([^"]+)"[^>]*>/gi, " [link: $1] ") // keep ticket URLs visible
    .replace(/<br\s*\/?>|<\/(p|div|li|tr|h\d)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n+/g, "\n")
    .trim();
}

async function loadSource(): Promise<{ sourceUrl: string; content: Anthropic.Beta.BetaContentBlockParam }> {
  if (/^https?:\/\//.test(input)) {
    const res = await fetch(input, { headers: { "user-agent": "Mozilla/5.0 (kpop-concert-map extractor)" } });
    if (!res.ok) throw new Error(`Fetching ${input} failed: HTTP ${res.status}`);
    const body = await res.text();
    const text = (res.headers.get("content-type") ?? "").includes("html") ? htmlToText(body) : body;
    return { sourceUrl: values["source-url"] ?? input, content: { type: "text", text } };
  }
  const sourceUrl = values["source-url"];
  if (!sourceUrl) throw new Error("For a local file, pass --source-url with the official post it came from.");
  const ext = path.extname(input).toLowerCase();
  if (ext in IMAGE_TYPES) {
    const media_type = IMAGE_TYPES[ext as keyof typeof IMAGE_TYPES];
    return {
      sourceUrl,
      content: { type: "image", source: { type: "base64", media_type, data: readFileSync(input).toString("base64") } },
    };
  }
  const raw = readFileSync(input, "utf8");
  return { sourceUrl, content: { type: "text", text: ext === ".html" ? htmlToText(raw) : raw } };
}

const { artists, venues } = loadData();
const { sourceUrl, content } = await loadSource();
if (content.type === "text") {
  if (content.text.length < 50) throw new Error("The source has almost no text. Is the page rendered by JavaScript? Save the text or a screenshot and pass the file instead.");
  if (content.text.length > MAX_TEXT_CHARS)
    throw new Error(`The source is ${content.text.length} characters. Copy just the announcement into a .txt file and pass that.`);
}

const knownArtists = artists.filter((a) => !a.sample).map((a) => `${a.id}\t${a.name}${a.nameKo ? `\t${a.nameKo}` : ""}`);
const knownVenues = venues.map((v) => `${v.id}\t${v.name}\t${v.city}\t${v.countryCode}`);

const client = new Anthropic();
const response = await client.beta.messages.parse({
  model: MODEL,
  max_tokens: 16000,
  betas: ["server-side-fallback-2026-07-01"],
  fallbacks: "default",
  output_config: { effort: "medium", format: betaZodOutputFormat(Extraction) },
  system: [
    "You extract K-pop concert dates from official announcements (agency notices, Weverse posts, tour posters) for a concert listings site.",
    "Fans buy tickets based on this data, so record only what the source states. When something is missing, use null and add a warning rather than filling it in from general knowledge.",
    "Dates are the local date at the venue. If the year is not written, infer it from the announcement date or context and add a warning saying you did.",
    "One entry in shows per performance: two nights at the same venue are two entries.",
    "Only include ticket URLs that appear in the source.",
    "Match artistId and venueId only against the lists provided, and only when it is clearly the same artist or venue; otherwise use null.",
  ].join("\n"),
  messages: [
    {
      role: "user",
      content: [
        { type: "text", text: `Known artists (id, name, Korean name):\n${knownArtists.join("\n")}\n\nKnown venues (id, name, city, country):\n${knownVenues.join("\n")}\n\nToday is ${today()}. Source URL: ${sourceUrl}\n\nThe announcement:` },
        content,
      ],
    },
  ],
});

if (response.stop_reason === "refusal") throw new Error(`The model declined: ${response.stop_details?.explanation ?? "no details"}`);
if (response.stop_reason === "max_tokens") throw new Error("The response hit max_tokens before finishing. Split the announcement and try again.");
const out = response.parsed_output;
if (!out) throw new Error("The model's response did not match the expected format.");

// Don't trust ids the model made up.
const artistIds = new Set(artists.map((a) => a.id));
const venueIds = new Set(venues.map((v) => v.id));
const warnings = [...out.warnings];
if (out.artistId && !artistIds.has(out.artistId)) {
  warnings.push(`artistId "${out.artistId}" is not in data/concerts/artists.json; add the artist or fix the id.`);
  out.artistId = null;
}
for (const s of out.shows) {
  if (s.venueId && !venueIds.has(s.venueId)) {
    warnings.push(`venueId "${s.venueId}" for ${s.date} is not in data/concerts/venues.json.`);
    s.venueId = null;
  }
  if (!s.venueId) warnings.push(`${s.date} ${s.city}: no matching venue. Add it to data/concerts/venues.json and set venueId.`);
}

const candidate: InboxCandidate = {
  status: "pending",
  source: { url: sourceUrl, kind: "official" },
  extractedAt: today(),
  model: response.model,
  artistId: out.artistId,
  artistName: out.artistName,
  tour: out.tour,
  ticketLinks: out.ticketLinks,
  shows: out.shows.map((s) => ({ ...s, status: "announced" as const })),
  warnings,
};

const hash = createHash("sha1").update(sourceUrl).digest("hex").slice(0, 6);
const file = path.join(INBOX, `${today()}-${out.artistId ?? "unknown"}-${hash}.json`);
writeJson(file, candidate);

console.log(`Wrote ${path.relative(process.cwd(), file)}`);
console.log(`  ${out.artistName} — ${out.tour}: ${out.shows.length} show(s)`);
for (const w of warnings) console.log(`  ⚠ ${w}`);
console.log('Review it, set "status": "approved", then: npm run concerts:apply -- ' + path.relative(process.cwd(), file));
