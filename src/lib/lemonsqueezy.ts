const LS_API = "https://api.lemonsqueezy.com/v1";

function getHeaders() {
  return {
    Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY!}`,
    "Content-Type": "application/vnd.api+json",
    Accept: "application/vnd.api+json",
  };
}

export async function createCheckout(options: {
  storeId: string;
  variantId: string;
  email?: string;
  userId: string;
  redirectUrl: string;
}): Promise<string | null> {
  const res = await fetch(`${LS_API}/checkouts`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: {
            email: options.email,
            custom: { user_id: options.userId },
          },
          product_options: {
            redirect_url: options.redirectUrl,
            receipt_button_text: "Start Learning",
            receipt_thank_you_note: "Thank you for subscribing to Korean in Real Life!",
          },
        },
        relationships: {
          store: { data: { type: "stores", id: options.storeId } },
          variant: { data: { type: "variants", id: options.variantId } },
        },
      },
    }),
  });

  if (!res.ok) {
    console.error("LS checkout error:", await res.text());
    return null;
  }

  const json = await res.json();
  return json?.data?.attributes?.url ?? null;
}
