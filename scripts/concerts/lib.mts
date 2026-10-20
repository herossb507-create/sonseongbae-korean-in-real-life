import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Artist, Concert, TicketLink, Venue } from "../../src/lib/concerts/types.ts";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const DATA = path.join(ROOT, "data", "concerts");
export const INBOX = path.join(DATA, "inbox");

export function readJson<T>(file: string): T {
  return JSON.parse(readFileSync(file, "utf8")) as T;
}

export function writeJson(file: string, value: unknown) {
  writeFileSync(file, JSON.stringify(value, null, 2) + "\n");
}

export interface Data {
  artists: Artist[];
  venues: Venue[];
  concerts: Concert[];
}

export function loadData(): Data {
  return {
    artists: readJson(path.join(DATA, "artists.json")),
    venues: readJson(path.join(DATA, "venues.json")),
    concerts: readJson(path.join(DATA, "concerts.json")),
  };
}

export function today() {
  return new Date().toLocaleDateString("sv-SE");
}

/** A candidate written by extract.mts, reviewed by a person, merged by apply.mts. */
export interface InboxCandidate {
  status: "pending" | "approved";
  source: { url: string; kind: "official" | "manual" };
  extractedAt: string;
  model: string;
  artistId: string | null;
  artistName: string;
  tour: string;
  ticketLinks: TicketLink[]; // applies to every show unless a show lists its own
  shows: {
    date: string;
    time: string | null;
    city: string;
    countryCode: string;
    venueName: string | null;
    venueId: string | null;
    status: "announced" | "onsale" | "soldout" | "cancelled";
    ticketOpen: string | null;
    notes: string | null;
    idRequired: boolean | null;
  }[];
  warnings: string[];
}
