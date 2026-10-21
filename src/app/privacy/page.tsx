import type { Metadata } from "next";
import Link from "next/link";
import { FREE_PDF } from "@/lib/books";
import { SITE_URL } from "@/lib/concerts/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Privacy Policy",
  description: "What Korean in Real Life stores, which services it uses, and your choices.",
  path: "/privacy",
});

const EFFECTIVE_DATE = "October 21, 2026";
const CONTACT_EMAIL = "hello@koreaninreallife.com";

// Everything the site itself saves in the visitor's browser (see src/lib/progress.ts and friends).
const LOCAL_KEYS = [
  { key: "kril-progress-v1", what: "Your learning progress: XP, streak, chapters read and completed, words marked as known, and the optional name you enter in Settings" },
  { key: "kr-activity-log", what: "XP earned per day, for the activity calendar on the Stats page" },
  { key: "daily-challenge-<date>", what: "Whether you finished that day's Daily Challenge, and your score" },
  { key: "reader-font-size", what: "The text size you picked in the chapter reader" },
  { key: "dialogue-romanization", what: "Whether romanization is shown in Dialogues" },
];

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="pt-6 text-lg font-semibold text-[#1E1225]">{children}</h2>;
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#FFF5F8]">
      <nav className="border-b border-[#F0E6EE] bg-white/95 px-6 py-4 shadow-sm">
        <Link href="/" className="text-xl font-bold text-[#1E1225]">
          Korean <span className="text-[#E8436F]">in Real Life</span>
        </Link>
      </nav>

      <article className="mx-auto max-w-3xl space-y-4 px-6 py-12 leading-relaxed text-[#3D2F48]">
        <h1 className="text-3xl font-bold text-[#1E1225]">Privacy Policy</h1>
        <p className="text-sm text-[#B0A8BB]">Effective {EFFECTIVE_DATE}</p>

        <p>
          Korean in Real Life ({SITE_URL.replace(/^https?:\/\//, "")}) is a free Korean-learning site with a map of
          K-pop concerts. This policy explains what information is involved when you use it. The short version:{" "}
          <strong>there are no accounts, we don&apos;t collect your name or email on this site, and your learning
          progress stays in your own browser.</strong>
        </p>

        <H2>1. What we collect</H2>
        <p>
          We don&apos;t ask you to sign up, and the site has no login, payments or analytics. We don&apos;t sell or share
          personal information, and we don&apos;t use cookies to track you.
        </p>
        <p>
          Like any website, the hosting provider that serves our pages automatically records basic technical
          information for each request, such as your IP address, browser type, the page requested and the time. These
          server logs are used to keep the site running and secure, and are kept only as long as the host retains them.
        </p>

        <H2>2. Progress saved in your browser</H2>
        <p>
          To remember your progress without an account, the site saves the following in your browser&apos;s local
          storage on your device. It is never sent to us.
        </p>
        <ul className="list-disc space-y-1.5 pl-5 text-sm">
          {LOCAL_KEYS.map((k) => (
            <li key={k.key}>
              <code className="rounded bg-white px-1 text-[#9B7FE8]">{k.key}</code> — {k.what}
            </li>
          ))}
        </ul>
        <p>
          You can download this data or delete it at any time in{" "}
          <Link href="/settings" className="text-[#E8436F] underline">
            Settings
          </Link>
          , or by clearing site data in your browser. Anyone using the same browser profile can see this progress.
        </p>

        <H2>3. Services that receive data when you use certain features</H2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Concert map (Esri / ArcGIS).</strong> The map tiles on the K-pop concerts pages are loaded from
            Esri&apos;s servers, which receive your IP address and the map area being viewed.
          </li>
          <li>
            <strong>Nearby places (OpenStreetMap).</strong> The restaurant, café and hotel lists on concert pages are
            prepared ahead of time from OpenStreetMap data and published with the page, so viewing them sends nothing
            to OpenStreetMap.
          </li>
          <li>
            <strong>Pronunciation audio.</strong> &quot;Hear it&quot; buttons use your browser&apos;s built-in speech
            feature. Some browsers, such as Chrome with Google voices, send the Korean text to the browser maker&apos;s
            servers to create the audio.
          </li>
          <li>
            <strong>Free PDF sign-up (MailerLite).</strong> The free Korean guides are delivered by email through a
            sign-up page hosted by MailerLite ({FREE_PDF.url.replace(/^https?:\/\//, "")}). If you sign up, your email
            address is collected by MailerLite on our behalf to send the PDFs and occasional updates. Every email has an
            unsubscribe link, and you can ask us to delete your address.
          </li>
          <li>
            <strong>Links to other sites.</strong> Book links go to Amazon, concert ticket links go to ticket
            sellers, hotel links go to Booking.com, Agoda and Trip.com (with the show date and venue in the link), and
            nearby restaurant links open Google Maps. Those sites have their own privacy policies. Some ticket or hotel
            links may be affiliate links;
            when you click one, the seller or its affiliate network may set cookies to record the referral (see our{" "}
            <Link href="/concerts/disclosure" className="text-[#E8436F] underline">
              affiliate disclosure
            </Link>
            ).
          </li>
        </ul>

        <H2>4. Advertising</H2>
        <p>
          The site doesn&apos;t show ads today. If we add advertising or analytics, we will update this page first, list
          each provider and what it collects, and ask for consent where the law requires it (for example, for visitors
          in the EU and UK).
        </p>

        <H2>5. Children</H2>
        <p>
          The site is for a general audience and doesn&apos;t knowingly collect personal information from children
          under 13. A child should get a parent&apos;s permission before signing up for the free PDFs.
        </p>

        <H2>6. Your rights</H2>
        <p>
          Depending on where you live (for example under the GDPR, UK GDPR, CCPA or Korea&apos;s Personal Information
          Protection Act), you may have the right to access, correct or delete personal information about you, or to
          object to its use. Because we don&apos;t keep accounts, the only personal information we may hold is an email
          address you gave to the free PDF sign-up. Email us and we&apos;ll handle your request.
        </p>

        <H2>7. Changes</H2>
        <p>
          We&apos;ll post any changes on this page and update the effective date above. Significant changes will be
          noted on the home page.
        </p>

        <H2>8. Contact</H2>
        <p>
          Questions or requests:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#E8436F] underline">
            {CONTACT_EMAIL}
          </a>
        </p>

        <p className="pt-8">
          <Link href="/" className="text-sm text-[#E8436F] hover:underline">
            ← Back to Korean in Real Life
          </Link>
        </p>
      </article>
    </main>
  );
}
