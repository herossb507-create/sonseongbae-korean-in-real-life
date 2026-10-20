"use client";

import { useSyncExternalStore } from "react";

// Viewer's local date (YYYY-MM-DD). Null during prerender, so static pages
// don't bake in the build date; past shows are split out once hydrated.
const noopSubscribe = () => () => {};

export function useToday() {
  return useSyncExternalStore(
    noopSubscribe,
    () => new Date().toLocaleDateString("sv-SE"),
    () => null,
  );
}
