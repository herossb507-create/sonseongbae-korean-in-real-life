// Runs only for the paths listed in wrangler.jsonc → assets.run_worker_first;
// everything else is served straight from the static files in out/.
//
// Why: static-asset serving redirects "/name.html" to "/name", but Google's
// HTML-file site verification expects the exact file at the exact URL.
const GOOGLE_VERIFICATION_FILE = "google76f349ea99c14637.html";

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === `/${GOOGLE_VERIFICATION_FILE}`) {
      return new Response(`google-site-verification: ${GOOGLE_VERIFICATION_FILE}`, {
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
    return env.ASSETS.fetch(request);
  },
};
