import Link from "next/link";

const NAV = [
  { href: "/concerts", label: "Map" },
  { href: "/concerts/artists", label: "Artists" },
  { href: "/concerts/cities", label: "Cities" },
];

/** Top bar shared by every /concerts page; links back to the learning side of the site. */
export default function ConcertsHeader() {
  return (
    <header className="z-[1000] shrink-0 border-b border-[#F0E6EE] bg-white/95 shadow-sm backdrop-blur-md">
      <div className="flex flex-col px-3 py-1.5 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-x-4 md:gap-y-2 md:px-6 md:py-3">
        {/* On phones the title and Learn sit on their own row so the name is never truncated. */}
        <div className="flex items-center justify-between gap-2 md:contents">
          <div className="flex min-w-0 items-center gap-2 md:gap-3">
            <Link href="/" className="flex shrink-0 items-center gap-2 hover:opacity-80">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#E8436F] to-[#9B7FE8] text-sm font-bold text-white shadow-md">
                한
              </span>
              <span className="hidden text-sm font-bold text-[#1E1225] sm:inline">
                Korean <span className="text-[#E8436F]">in Real Life</span>
              </span>
            </Link>
            <span className="shrink-0 text-[#E5DCE6]">/</span>
            <Link href="/concerts" className="truncate text-[15px] font-bold text-[#1E1225] md:text-sm">
              🎤 K-pop Concerts
            </Link>
          </div>
          <Link
            href="/learn"
            className="inline-flex min-h-11 shrink-0 items-center rounded-lg bg-gradient-to-r from-[#E8436F] to-[#F06B8A] px-3 text-[15px] font-medium text-white hover:opacity-90 md:hidden"
          >
            Learn
          </Link>
        </div>
        <nav className="flex items-center gap-4 text-sm text-[#6B5F7A] max-md:w-full max-md:text-[15px]">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="hover:text-[#1E1225] max-md:inline-flex max-md:min-h-11 max-md:flex-1 max-md:items-center max-md:justify-center"
            >
              {n.label}
            </Link>
          ))}
          <Link
            href="/learn"
            className="hidden rounded-lg bg-gradient-to-r from-[#E8436F] to-[#F06B8A] px-3 py-1.5 font-medium text-white hover:opacity-90 md:inline"
          >
            Learn Korean
          </Link>
        </nav>
      </div>
    </header>
  );
}
