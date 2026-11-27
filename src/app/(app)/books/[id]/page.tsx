import Link from "next/link";
import { notFound } from "next/navigation";
import { BOOKS, FREE_PDF, type BookId } from "@/lib/books";
import { BOOK_DETAILS } from "@/lib/book-details";
import { BookCover } from "@/components/books/BookCover";
import { BookGallery } from "@/components/books/BookGallery";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/concerts/site";
import { pageMeta } from "@/lib/seo";

interface Props {
  params: { id: string };
}

const isBook = (id: string): id is BookId => id in BOOKS;

export function generateStaticParams() {
  return Object.keys(BOOKS).map((id) => ({ id }));
}

export function generateMetadata({ params }: Props) {
  if (!isBook(params.id)) return {};
  const b = BOOKS[params.id];
  return pageMeta({
    title: `${b.title}${b.series ? ` (${b.series})` : ""}: ${b.subtitle}`,
    description: `${BOOK_DETAILS[params.id].tagline} ${b.pitch}`.slice(0, 300),
    path: `/books/${params.id}`,
  });
}

export default function BookPage({ params }: Props) {
  if (!isBook(params.id)) notFound();
  const b = BOOKS[params.id];
  const d = BOOK_DETAILS[params.id];
  const others = (Object.keys(BOOKS) as BookId[]).filter((id) => id !== params.id);

  return (
    <div className="min-h-screen bg-[#F8F5FF]">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Book",
              name: `${b.title}: ${b.subtitle}`,
              description: d.about[0],
              inLanguage: "en",
              bookFormat: "https://schema.org/EBook",
              ...(b.pages && { numberOfPages: b.pages }),
              ...(b.cover && { image: `${SITE_URL}${b.cover}` }),
              url: `${SITE_URL}/books/${params.id}`,
              offers: { "@type": "Offer", url: b.url, availability: "https://schema.org/InStock" },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Books", item: `${SITE_URL}/books` },
                { "@type": "ListItem", position: 2, name: b.title, item: `${SITE_URL}/books/${params.id}` },
              ],
            },
          ],
        }}
      />

      {/* Hero */}
      <section className="stage-bg relative overflow-hidden text-white">
        <div className="stage-beams pointer-events-none absolute inset-0" />
        <div className="relative mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6 md:flex-row md:items-center md:py-14">
          <BookCover book={b} className="mx-auto w-44 md:mx-0 md:w-56" />
          <div className="min-w-0 flex-1">
            <Link href="/books" className="text-xs font-semibold text-white/60 hover:text-white">
              ← All books
            </Link>
            {b.series && <p className="mt-3 text-xs font-bold uppercase tracking-widest text-[#22D3EE]">{b.series}</p>}
            <h1 className="mt-1 text-3xl font-black tracking-tight md:text-5xl">{b.title}</h1>
            <p className="mt-1 text-lg font-bold text-neon">{b.subtitle}</p>
            <p className="mt-4 text-xl font-semibold leading-snug text-white/90">“{d.tagline}”</p>
            <p className="mt-3 text-sm text-white/60">
              {b.formats}
              {b.pages && <> · {b.pages} pages</>}
            </p>
            <a
              href={b.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glow-pink mt-6 inline-block rounded-full bg-gradient-to-r from-[#FF3D8B] to-[#FF6FB1] px-8 py-3 text-base font-bold text-white hover:opacity-90"
            >
              Get it on Amazon ↗
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-12 px-4 py-10 sm:px-6">
        {/* About + who it's for */}
        <section className="grid gap-6 md:grid-cols-[1fr_280px]">
          <div className="space-y-4 text-base leading-relaxed text-[#2C2548]">
            <h2 className="text-2xl font-black tracking-tight text-[#140F2D]">About the book</h2>
            {d.about.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <aside className="h-fit rounded-3xl border border-[#EAE4F7] bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#7C5CFF]">Perfect for</h3>
            <ul className="mt-3 space-y-2">
              {d.forWho.map((w) => (
                <li key={w} className="flex gap-2 text-sm text-[#2C2548]">
                  <span className="text-[#FF3D8B]">✓</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </aside>
        </section>

        {/* Images */}
        <section>
          <h2 className="mb-4 text-2xl font-black tracking-tight text-[#140F2D]">{d.galleryTitle}</h2>
          <BookGallery images={d.gallery} />
          <p className="mt-2 text-xs text-[#9E98B8]">Tap an image to see it full size.</p>
        </section>

        {/* Characters */}
        {d.characters && (
          <section>
            <h2 className="mb-4 text-2xl font-black tracking-tight text-[#140F2D]">Meet the characters</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {d.characters.map((c) => (
                <li key={c.name} className="holo flex gap-4 rounded-2xl border border-[#EAE4F7] bg-white p-4 shadow-sm">
                  {c.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.image} alt={c.name} loading="lazy" className="h-20 w-20 shrink-0 rounded-xl object-cover" />
                  ) : (
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FF3D8B] to-[#7C5CFF] text-lg font-black text-white">
                      {c.name[0]}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="font-bold text-[#140F2D]">
                      {c.name}
                      {c.ko && <span className="ml-2 font-noto-kr text-sm font-medium text-[#9E98B8]">{c.ko}</span>}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-[#5A5475]">{c.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Excerpt */}
        {d.excerpt && (
          <section className="stage-bg relative overflow-hidden rounded-3xl px-6 py-8 text-white">
            <p className="text-xs font-bold uppercase tracking-widest text-[#22D3EE]">From the book · {d.excerpt.label}</p>
            {d.excerpt.korean && <p className="mt-3 font-noto-kr text-2xl font-bold">{d.excerpt.korean}</p>}
            <p className={`${d.excerpt.korean ? "mt-2 text-white/75" : "mt-3 text-lg leading-relaxed text-white/90"}`}>
              {d.excerpt.korean ? <em>{d.excerpt.text}</em> : d.excerpt.text}
            </p>
          </section>
        )}

        {/* Contents */}
        <section>
          <h2 className="mb-4 text-2xl font-black tracking-tight text-[#140F2D]">What&apos;s inside</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {d.contents.map((g, gi) => (
              <div key={gi} className="rounded-3xl border border-[#EAE4F7] bg-white p-5 shadow-sm">
                {g.heading && <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-[#7C5CFF]">{g.heading}</h3>}
                <ol className="space-y-1.5">
                  {g.items.map((it, i) => (
                    <li key={it} className="flex gap-3 text-sm text-[#2C2548]">
                      <span className="w-5 shrink-0 text-right font-bold text-[#FF3D8B]">{g.heading === "Plus" || g.heading === "Inside" ? "✦" : i + 1}</span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>

        {/* Buy again + free PDF */}
        <section className="flex flex-col items-center gap-3 rounded-3xl border border-[#EAE4F7] bg-white p-8 text-center shadow-sm">
          <p className="text-xl font-black text-[#140F2D]">Ready to read {b.title}?</p>
          <a
            href={b.url}
            target="_blank"
            rel="noopener noreferrer"
            className="glow-pink rounded-full bg-gradient-to-r from-[#FF3D8B] to-[#FF6FB1] px-8 py-3 font-bold text-white hover:opacity-90"
          >
            Get it on Amazon ↗
          </a>
          <p className="text-sm text-[#5A5475]">
            Not ready yet? Get Kohami&apos;s free Korean phrase PDFs at{" "}
            <a href={FREE_PDF.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#FF3D8B] underline underline-offset-2">
              {FREE_PDF.displayUrl}
            </a>
          </p>
        </section>

        {/* Other books */}
        <section>
          <h2 className="mb-4 text-lg font-black text-[#140F2D]">More books</h2>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {others.map((id) => (
              <li key={id}>
                <Link href={`/books/${id}`} className="group block">
                  <BookCover book={BOOKS[id]} className="w-full transition-transform group-hover:-translate-y-1" />
                  <p className="mt-2 text-sm font-bold text-[#140F2D] group-hover:text-[#FF3D8B]">{BOOKS[id].title}</p>
                  <p className="text-xs text-[#5A5475]">{BOOKS[id].subtitle}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
