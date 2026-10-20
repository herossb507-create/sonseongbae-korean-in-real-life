import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

// webhook은 service role key 필요 (RLS 우회)
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = getAdminClient();

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata.supabase_user_id;
      if (!userId) break;

      await supabase.from("subscriptions").upsert({
        user_id: userId,
        stripe_customer_id: sub.customer as string,
        stripe_sub_id: sub.id,
        status: sub.status === "active" ? "active" : "past_due",
        plan: sub.items.data[0].price.recurring?.interval === "year" ? "annual" : "monthly",
        current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
      }, { onConflict: "stripe_sub_id" });
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await supabase
        .from("subscriptions")
        .update({ status: "canceled" })
        .eq("stripe_sub_id", sub.id);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
