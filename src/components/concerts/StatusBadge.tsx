import type { ConcertStatus } from "@/lib/concerts/types";
import { STATUS_LABEL } from "@/lib/concerts/format";

const STATUS_STYLE: Record<ConcertStatus, string> = {
  announced: "bg-[#F3EEFF] text-[#7A5FD0] ring-[#E2D8FB]",
  onsale: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  soldout: "bg-amber-50 text-amber-700 ring-amber-200",
  cancelled: "bg-zinc-100 text-zinc-500 ring-zinc-200 line-through",
};

export default function StatusBadge({ status }: { status: ConcertStatus }) {
  return (
    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${STATUS_STYLE[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}

/** Shown on shows only reported by news outlets, not yet seen on an official page. */
export function UnconfirmedBadge() {
  return (
    <span
      title="Reported by news outlets; not yet confirmed on an official page"
      className="shrink-0 rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-[#6B5F7A] ring-1 ring-[#E5DCE6]"
    >
      Unconfirmed
    </span>
  );
}
