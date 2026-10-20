export const SITE_NAME = "Korean in Real Life";
// Shared with the rest of the app (auth redirects, checkout).
export const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
