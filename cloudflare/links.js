// Tracked promo links: /go/<slug>?src=<channel>&post=<post id> → destination.
// Keep the book URLs in sync with src/lib/books.ts (BOOKS[...].url, FREE_PDF.url).
export const LINKS = {
  kirl1: "https://www.amazon.com/dp/B0H64RM6Q5", // Korean in Real Life Vol.1
  kirl2: "https://www.amazon.com/dp/B0H4F11PRH", // Korean in Real Life Vol.2
  campus: "https://www.amazon.com/dp/B0HQ6VPYWV", // Korean on Campus
  shygirl: "https://www.amazon.com/dp/B0HS2S2FG8", // Shy Girl, Center Stage
  ku: "https://www.amazon.com/dp/B0GRTZPPBQ", // Korea Unlocked
  author: "https://www.amazon.com/s?k=Seongbae+Son&i=digital-text", // all books
  pdf: "/free", // free PDF downloads (no sign-up)
  free: "/free", // same as pdf
  books: "/books", // the site's books page
  learn: "/learn", // the site's free lessons
  concerts: "/concerts", // K-pop concert map
};

// Where an unknown slug goes.
export const FALLBACK = "/books";
