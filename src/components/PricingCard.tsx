import Link from "next/link";

interface Props {
  plan: string;
  price: string;
  period: string;
  annualPrice?: string;
  features: string[];
  cta: string;
  href: string;
  highlighted: boolean;
}

export function PricingCard({
  plan,
  price,
  period,
  annualPrice,
  features,
  cta,
  href,
  highlighted,
}: Props) {
  return (
    <div
      className={`rounded-2xl border-2 p-8 text-left ${
        highlighted
          ? "border-blue-500 bg-blue-50 shadow-lg"
          : "border-gray-200 bg-white"
      }`}
    >
      {highlighted && (
        <div className="text-xs font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full inline-block mb-4">
          Most popular
        </div>
      )}
      <h3 className="text-xl font-bold text-gray-900 mb-1">{plan}</h3>
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-4xl font-bold text-gray-900">{price}</span>
        <span className="text-gray-500 text-sm">/ {period}</span>
      </div>
      {annualPrice && (
        <p className="text-sm text-blue-600 mb-4">{annualPrice}</p>
      )}
      <ul className="space-y-2 mb-8 mt-4">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
            <span className="text-green-500 mt-0.5">✓</span>
            {f}
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className={`block w-full text-center py-3 rounded-xl font-medium text-sm ${
          highlighted
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "border border-gray-300 text-gray-700 hover:bg-gray-50"
        }`}
      >
        {cta}
      </Link>
    </div>
  );
}
