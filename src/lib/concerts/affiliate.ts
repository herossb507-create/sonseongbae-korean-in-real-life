import type { AffiliateProgram, TicketLink } from "./types";

// Tracking-link templates per program, set once you're approved, e.g.
//   NEXT_PUBLIC_AFFILIATE_TICKETMASTER="https://ticketmaster.evyy.net/c/<id>/<ad>/<campaign>?u={url}"
// `{url}` is replaced by the URL-encoded destination. Unset = plain link, no tracking.
// NEXT_PUBLIC_* must be referenced literally so Next can inline them.
const TEMPLATES: Record<AffiliateProgram, string | undefined> = {
  ticketmaster: process.env.NEXT_PUBLIC_AFFILIATE_TICKETMASTER,
  seatgeek: process.env.NEXT_PUBLIC_AFFILIATE_SEATGEEK,
  klook: process.env.NEXT_PUBLIC_AFFILIATE_KLOOK,
};

export interface RenderedLink {
  label: string;
  href: string;
  rel: string;
  sponsored: boolean;
  kind: TicketLink["kind"];
}

export function renderTicketLink(link: TicketLink): RenderedLink {
  const template = link.affiliate ? TEMPLATES[link.affiliate] : undefined;
  if (!template) {
    return { label: link.label, href: link.url, rel: "noopener noreferrer", sponsored: false, kind: link.kind };
  }
  return {
    label: link.label,
    href: template.replace("{url}", encodeURIComponent(link.url)),
    rel: "sponsored noopener",
    sponsored: true,
    kind: link.kind,
  };
}

const KIND_ORDER: Record<TicketLink["kind"], number> = { primary: 0, fanclub: 1, presale: 2, resale: 3 };

/**
 * Links in the order fans should see them: official sellers first, whether or
 * not they earn a commission. Resale is dropped for ID-checked shows.
 */
export function ticketLinksFor(c: { ticketLinks: TicketLink[]; idRequired?: boolean }): RenderedLink[] {
  return c.ticketLinks
    .filter((l) => !(c.idRequired && l.kind === "resale"))
    .sort((a, b) => KIND_ORDER[a.kind] - KIND_ORDER[b.kind])
    .map(renderTicketLink);
}
