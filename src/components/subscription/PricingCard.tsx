import Link from "next/link";

interface Props {
  plan: string;
  price: string;
  period: string;
  annualPrice?: string;
  annualHref?: string;
  features: string[];
  lockedFeatures?: string[];   // Pro-only items shown as locked on Free card
  cta: string;
  href: string;
  highlighted: boolean;
  badge?: string;
}

export function PricingCard({
  plan,
  price,
  period,
  annualPrice,
  annualHref,
  features,
  lockedFeatures,
  cta,
  href,
  highlighted,
  badge,
}: Props) {
  return (
    <div
      className="rounded-2xl p-8 text-left transition-all duration-300"
      style={
        highlighted
          ? {
              background:
                "linear-gradient(135deg, rgba(232,67,111,0.06) 0%, rgba(155,127,232,0.06) 100%)",
              border: "2px solid rgba(232,67,111,0.35)",
              boxShadow: "0 8px 32px rgba(232,67,111,0.12)",
            }
          : {
              background: "white",
              border: "1px solid rgba(240,230,238,1)",
              boxShadow: "0 2px 8px rgba(30,18,37,0.04)",
            }
      }
    >
      {badge && (
        <div
          className="text-xs font-bold px-3 py-1 rounded-full inline-block mb-4"
          style={{
            background: "linear-gradient(to right, #E8436F, #9B7FE8)",
            color: "white",
          }}
        >
          {badge}
        </div>
      )}

      <h3 className="text-xl font-bold mb-1" style={{ color: "#1E1225" }}>
        {plan}
      </h3>
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-4xl font-bold" style={{ color: "#1E1225" }}>
          {price}
        </span>
        <span className="text-sm" style={{ color: "#6B5F7A" }}>
          / {period}
        </span>
      </div>

      {annualPrice &&
        (annualHref ? (
          <Link
            href={annualHref}
            className="text-sm hover:underline mb-5 block font-medium"
            style={{ color: "#9B7FE8" }}
          >
            {annualPrice}
          </Link>
        ) : (
          <p className="text-sm mb-5 font-medium" style={{ color: "#9B7FE8" }}>
            {annualPrice}
          </p>
        ))}

      <ul className="space-y-2.5 mb-2 mt-5">
        {features.map((f) => (
          <li
            key={f}
            className="flex items-start gap-2 text-sm"
            style={{ color: "#1E1225" }}
          >
            <span className="mt-0.5 font-bold" style={{ color: "#34C899" }}>
              ✓
            </span>
            {f}
          </li>
        ))}
      </ul>

      {/* Locked items shown on Free card */}
      {lockedFeatures && lockedFeatures.length > 0 && (
        <ul className="space-y-2.5 mb-2">
          {lockedFeatures.map((f) => (
            <li
              key={f}
              className="flex items-start gap-2 text-sm"
              style={{ color: "#B0A8BB" }}
            >
              <span className="mt-0.5">🔒</span>
              {f}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8">
        <Link
          href={href}
          className="block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
          style={
            highlighted
              ? {
                  background: "linear-gradient(to right, #E8436F, #F06B8A)",
                  color: "white",
                  boxShadow: "0 4px 16px rgba(232,67,111,0.3)",
                }
              : {
                  background: "rgba(240,230,238,0.6)",
                  color: "#6B5F7A",
                  border: "1px solid rgba(240,230,238,1)",
                }
          }
        >
          {cta}
        </Link>
      </div>
    </div>
  );
}
