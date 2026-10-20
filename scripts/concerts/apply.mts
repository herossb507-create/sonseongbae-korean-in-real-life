// Merges approved inbox candidates into data/concerts/concerts.json.
//
//   npm run concerts:apply -- data/concerts/inbox/2026-10-20-bts-a1b2c3.json [more files...]
//
// New shows are added as verified (a person approved them against the official
// source). Existing shows are updated and gain the new source.
import { renameSync } from "node:fs";
import path from "node:path";
import type { Concert } from "../../src/lib/concerts/types.ts";
import { DATA, INBOX, type InboxCandidate, loadData, readJson, today, writeJson } from "./lib.mts";
import { validate } from "./validate.mts";

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error("Usage: npm run concerts:apply -- <data/concerts/inbox/file.json> [...]");
  process.exit(1);
}

const data = loadData();
const artistIds = new Set(data.artists.map((a) => a.id));
const venueIds = new Set(data.venues.map((v) => v.id));
const byId = new Map(data.concerts.map((c) => [c.id, c]));
const problems: string[] = [];
let added = 0;
let updated = 0;

for (const file of files) {
  const cand = readJson<InboxCandidate>(file);
  const where = path.basename(file);
  if (cand.status !== "approved") {
    problems.push(`${where}: status is "${cand.status}". Review it and set "status": "approved" first.`);
    continue;
  }
  if (!cand.artistId || !artistIds.has(cand.artistId)) {
    problems.push(`${where}: artistId "${cand.artistId}" is not in data/concerts/artists.json.`);
    continue;
  }
  const missing = cand.shows.filter((s) => !s.venueId || !venueIds.has(s.venueId));
  if (missing.length) {
    problems.push(
      `${where}: no venue for ${missing.map((s) => `${s.date} ${s.city}`).join(", ")}. Add the venue to data/concerts/venues.json and set venueId.`,
    );
    continue;
  }

  const sourceRef = { source: cand.source.kind, url: cand.source.url, fetchedAt: cand.extractedAt };
  for (const s of cand.shows) {
    const id = `${cand.artistId}-${s.venueId}-${s.date}`;
    const prev = byId.get(id);
    const next: Concert = {
      ...prev,
      id,
      artistId: cand.artistId,
      tour: cand.tour,
      date: s.date,
      venueId: s.venueId!,
      status: s.status,
      ticketLinks: mergeLinks(prev?.ticketLinks ?? [], cand.ticketLinks),
      sourceRefs: [...(prev?.sourceRefs ?? []).filter((r) => r.url !== sourceRef.url), sourceRef],
      verification: "verified",
      updatedAt: today(),
      lastSeenAt: today(),
    };
    if (s.time) next.time = s.time;
    if (s.ticketOpen) next.ticketOpen = s.ticketOpen;
    if (s.notes) next.notes = s.notes;
    if (s.idRequired !== null) next.idRequired = s.idRequired;
    byId.set(id, next);
    if (prev) updated++;
    else added++;
  }
}

function mergeLinks(a: Concert["ticketLinks"], b: Concert["ticketLinks"]) {
  const seen = new Map(a.map((l) => [l.url, l]));
  for (const l of b) seen.set(l.url, { ...seen.get(l.url), ...l });
  return [...seen.values()];
}

if (problems.length) {
  console.error("Nothing was written:\n" + problems.map((p) => `  - ${p}`).join("\n"));
  process.exit(1);
}

const concerts = [...byId.values()].sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
const errors = validate({ ...data, concerts });
if (errors.length) {
  console.error("Nothing was written; the result would be invalid:\n" + errors.map((e) => `  - ${e}`).join("\n"));
  process.exit(1);
}

writeJson(path.join(DATA, "concerts.json"), concerts);
for (const file of files) renameSync(file, path.join(INBOX, "applied", path.basename(file)));
console.log(`✓ ${added} added, ${updated} updated. Moved ${files.length} file(s) to data/concerts/inbox/applied/.`);
