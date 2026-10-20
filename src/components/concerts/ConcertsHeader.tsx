import Link from "next/link";

const NAV = [
  { href: "/concerts", label: "Map" },
  { href: "/concerts/artists", label: "Artists" },
  { href: "/concerts/cities", label: "Cities" },
];

/** Top bar shared by every /concerts page; links back to the learning side of the site. */
export default function ConcertsHeader() {
  return (
    <header className="z-[1000] border-b border-[#F0E6EE] bg-white/95 shadow-sm backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#E8436F] to-[#9B7FE8] text-sm font-bold text-white shadow-md">
              한
            </span>
            <span className="hidden text-sm font-bold text-[#1E1225] sm:inline">
              Korean <span className="text-[#E8436F]">in Real Life</span>
            </span>
          </Link>
          <span className="text-[#E5DCE6]">/</span>
          <Link href="/concerts" className="text-sm font-bold text-[#1E1225]">
            🎤 K-pop Concerts
          </Link>
        </div>
        <nav className="flex items-center gap-4 text-sm text-[#6B5F7A]">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-[#1E1225]">
              {n.label}
            </Link>
          ))}
          <Link
            href="/learn"
            className="rounded-lg bg-gradient-to-r from-[#E8436F] to-[#F06B8A] px-3 py-1.5 font-medium text-white hover:opacity-90"
          >
            Learn Korean
          </Link>
        </nav>
      </div>
    </header>
  );
}
