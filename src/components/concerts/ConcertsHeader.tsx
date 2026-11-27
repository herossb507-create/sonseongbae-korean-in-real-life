import Link from "next/link";

const NAV = [
  { href: "/concerts", label: "Map" },
  { href: "/concerts/artists", label: "Artists" },
  { href: "/concerts/cities", label: "Cities" },
];

/** Top bar shared by every /concerts page; links back to the learning side of the site. */
export default function ConcertsHeader() {
  return (
    <header className="z-[1000] border-b border-white/10 bg-[#0E0A1F] text-white shadow-[0_4px_24px_rgb(124_92_255/0.25)]">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF3D8B] to-[#7C5CFF] text-sm font-bold text-white shadow-md">
              한
            </span>
            <span className="hidden text-sm font-bold sm:inline">
              Korean <span className="text-neon">in Real Life</span>
            </span>
          </Link>
          <span className="text-white/25">/</span>
          <Link href="/concerts" className="text-sm font-black tracking-tight">
            🎤 K-pop Concerts
          </Link>
        </div>
        <nav className="flex items-center gap-4 text-sm text-white/70">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-white">
              {n.label}
            </Link>
          ))}
          <Link
            href="/learn"
            className="glow-pink rounded-full bg-gradient-to-r from-[#FF3D8B] to-[#FF6FB1] px-3 py-1.5 font-semibold text-white hover:opacity-90"
          >
            Learn Korean
          </Link>
        </nav>
      </div>
    </header>
  );
}
