import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

// webhook은 service role key 필요 (RLS 우회)
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function verifySignature(rawBody: string, signature: string | null): boolean {
  if (!signature) return false;
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!;
  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(rawBody).digest("hex");
  return digest === signature;
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-signature");

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const payload = JSON.parse(rawBody);
  const eventName: string = payload.meta?.event_name;
  const userId: string | undefined = payload.meta?.custom_data?.user_id;
  const attributes = payload.data?.attributes;
  const lsSubId: string = String(payload.data?.id);

  const supabase = getAdminClient();

  switch (eventName) {
    case "subscription_created":
    case "subscription_updated": {
      if (!userId) break;

      const plan =
        Number(attributes.variant_id) === Number(process.env.LEMONSQUEEZY_VARIANT_ANNUAL)
          ? "annual"
          : "monthly";

      const status =
        attributes.status === "active" ? "active"
        : attributes.status === "past_due" ? "past_due"
        : "canceled";

      const periodEnd = attributes.renews_at ?? attributes.ends_at ?? null;

      await supabase.from("subscriptions").upsert(
        {
          user_id: userId,
          ls_customer_id: String(attributes.customer_id),
          ls_subscription_id: lsSubId,
          status,
          plan,
          current_period_end: periodEnd,
        },
        { onConflict: "ls_subscription_id" }
      );
      break;
    }

    case "subscription_cancelled":
    case "subscription_expired": {
      await supabase
        .from("subscriptions")
        .update({ status: "canceled" })
        .eq("ls_subscription_id", lsSubId);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
