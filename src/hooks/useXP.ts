"use client";

import { useCallback } from "react";
import { addXP as addLocalXP } from "@/lib/progress";

export function useXP() {
  // Async to keep the existing `await addXP(...)` call sites unchanged.
  const addXP = useCallback(async (amount: number) => addLocalXP(amount), []);
  return { addXP };
}
