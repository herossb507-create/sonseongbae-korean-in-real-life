import Stripe from "stripe";

// 서버 사이드 전용 — 클라이언트 번들에 포함되지 않도록 주의
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const STRIPE_PRICE_IDS = {
  monthly: process.env.STRIPE_PRICE_MONTHLY!,
  annual: process.env.STRIPE_PRICE_ANNUAL!,
};
