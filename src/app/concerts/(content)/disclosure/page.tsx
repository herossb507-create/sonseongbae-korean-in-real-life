import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Affiliate disclosure",
  description: "How Korean in Real Life chooses ticket and hotel links and when it earns a commission.",
  path: "/concerts/disclosure",
});

export default function DisclosurePage() {
  return (
    <div className="space-y-4 leading-relaxed text-[#3D2F48]">
      <h1 className="text-2xl font-bold text-[#1E1225]">Affiliate disclosure</h1>
      <p>
        The concert listings are free to use. To keep them running, some links to ticket sellers and travel services
        are affiliate links. If you buy something after clicking one, the seller may pay us a commission. You pay the
        same price either way.
      </p>
      <h2 className="pt-2 text-lg font-semibold text-[#1E1225]">How we choose which links to show</h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>Official sellers named in the artist&apos;s or promoter&apos;s announcement always come first, whether or not they pay us.</li>
        <li>Fanclub and presale links come next, linked to the official notice.</li>
        <li>
          We don&apos;t show resale links for shows that check photo ID at entry, because resale tickets may be refused at
          the door.
        </li>
        <li>Concert dates and venues come from official announcements. A commission never changes what we list.</li>
      </ul>
      <h2 className="pt-2 text-lg font-semibold text-[#1E1225]">Which links are affiliate links</h2>
      <p>
        Affiliate links are marked with a note under the ticket buttons and use the <code>rel=&quot;sponsored&quot;</code>{" "}
        attribute. Programs we may take part in include Ticketmaster, SeatGeek and the hotel booking sites Booking.com,
        Agoda and Trip.com.
      </p>
      <h2 className="pt-2 text-lg font-semibold text-[#1E1225]">Hotels and places to eat</h2>
      <p>
        The &quot;Traveling to this show?&quot; box on each concert page links to hotel searches near the venue on
        Booking.com, Agoda and Trip.com, with the show date filled in. These can be affiliate links. We show the same
        three sites for every show and don&apos;t rank individual hotels.
      </p>
      <p>
        The lists of nearby restaurants, cafés and hotels come from OpenStreetMap, sorted by distance. Nobody pays to be
        listed there, and they link to Google Maps so you can check reviews and opening hours yourself.
      </p>
    </div>
  );
}
