// Checks data/*.json for broken references and malformed values.
// Usage: npm run concerts:validate   (also runs before `npm run build`)
import { fileURLToPath } from "node:url";
import { type Data, loadData } from "./lib.mts";

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

function isRealDate(s: string) {
  if (!DATE.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().startsWith(s);
}

function isUrl(s: string) {
  try {
    const u = new URL(s);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

function isTimezone(tz: string) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

function dupes(ids: string[]) {
  return ids.filter((id, i) => ids.indexOf(id) !== i);
}

export function validate({ artists, venues, concerts }: Data): string[] {
  const errors: string[] = [];
  const err = (where: string, msg: string) => errors.push(`${where}: ${msg}`);

  for (const id of dupes(artists.map((a) => a.id))) err(`artist ${id}`, "duplicate id");
  for (const id of dupes(venues.map((v) => v.id))) err(`venue ${id}`, "duplicate id");
  for (const id of dupes(concerts.map((c) => c.id))) err(`concert ${id}`, "duplicate id");

  for (const a of artists) {
    if (!/^[a-z0-9-]+$/.test(a.id)) err(`artist ${a.id}`, "id must be lowercase letters, digits and dashes");
    for (const [k, url] of Object.entries(a.official)) if (url && !isUrl(url)) err(`artist ${a.id}`, `bad official.${k} URL`);
    if (a.sample && a.watch) err(`artist ${a.id}`, "sample artists can't be on the watchlist");
  }

  for (const v of venues) {
    if (!/^[a-z0-9-]+$/.test(v.id)) err(`venue ${v.id}`, "id must be lowercase letters, digits and dashes");
    if (!/^[A-Z]{2}$/.test(v.countryCode)) err(`venue ${v.id}`, `bad countryCode "${v.countryCode}"`);
    if (!(Math.abs(v.lat) <= 90 && Math.abs(v.lng) <= 180)) err(`venue ${v.id}`, "lat/lng out of range");
    if (!isTimezone(v.timezone)) err(`venue ${v.id}`, `unknown timezone "${v.timezone}"`);
  }

  const artistById = new Map(artists.map((a) => [a.id, a]));
  const venueIds = new Set(venues.map((v) => v.id));
  for (const c of concerts) {
    const at = `concert ${c.id}`;
    const artist = artistById.get(c.artistId);
    if (!artist) err(at, `unknown artistId "${c.artistId}"`);
    if (!venueIds.has(c.venueId)) err(at, `unknown venueId "${c.venueId}"`);
    if (c.id !== `${c.artistId}-${c.venueId}-${c.date}`) err(at, "id must be `${artistId}-${venueId}-${date}`");
    if (!isRealDate(c.date)) err(at, `bad date "${c.date}"`);
    if (c.time && !TIME.test(c.time)) err(at, `bad time "${c.time}"`);
    for (const k of ["ticketOpen", "updatedAt", "lastSeenAt"] as const)
      if (c[k] && !isRealDate(c[k]!)) err(at, `bad ${k} "${c[k]}"`);
    for (const l of c.ticketLinks) {
      if (!isUrl(l.url)) err(at, `bad ticket URL "${l.url}"`);
      if (c.idRequired && l.kind === "resale") err(at, "resale link on an ID-checked show");
    }
    if (c.sourceRefs.length === 0) err(at, "needs at least one sourceRef");
    for (const r of c.sourceRefs) if (!isUrl(r.url)) err(at, `bad source URL "${r.url}"`);
    // Real shows must never point at sample artists or carry sample sources.
    if (!c.sample && artist?.sample) err(at, "real concert uses a sample artist");
    if (!c.sample && c.sourceRefs.some((r) => r.source === "sample")) err(at, "real concert has a sample source");
  }
  return errors;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const data = loadData();
  const errors = validate(data);
  if (errors.length) {
    console.error(`✗ ${errors.length} problem(s) in data/concerts/:\n` + errors.map((e) => `  - ${e}`).join("\n"));
    process.exit(1);
  }
  console.log(`✓ data OK — ${data.artists.length} artists, ${data.venues.length} venues, ${data.concerts.length} concerts`);
}
