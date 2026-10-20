import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createCheckout } from "@/lib/lemonsqueezy";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const plan = searchParams.get("plan") ?? "monthly";

  // 로그인 확인
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const variantId =
    plan === "annual"
      ? process.env.LEMONSQUEEZY_VARIANT_ANNUAL!
      : process.env.LEMONSQUEEZY_VARIANT_MONTHLY!;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

  const checkoutUrl = await createCheckout({
    storeId: process.env.LEMONSQUEEZY_STORE_ID!,
    variantId,
    email: user.email ?? undefined,
    userId: user.id,
    redirectUrl: `${appUrl}/subscribe/success`,
  });

  if (!checkoutUrl) {
    return NextResponse.redirect(new URL("/pricing?error=checkout_failed", request.url));
  }

  return NextResponse.redirect(checkoutUrl);
}
