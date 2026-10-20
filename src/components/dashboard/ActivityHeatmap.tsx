"use client";

import { useEffect, useRef, useState } from "react";
import { getActivityLog, DayActivity } from "@/lib/activity-log";

interface Props {
  days?: number;
}

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Sun=0 … Sat=6 — we show short labels aligned to the 7 rows
const DOW_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

const CELL = 12; // px cell size
const GAP = 2;   // px gap
const STEP = CELL + GAP;
const DAY_LABEL_W = 28; // px reserved for day-of-week labels

function getColor(xp: number): string {
  if (xp === 0) return "bg-white/5";
  if (xp <= 20) return "bg-[#4F7FE8]/30";
  if (xp <= 50) return "bg-[#4F7FE8]/60";
  if (xp <= 100) return "bg-[#4F7FE8]";
  return "bg-[#FF4757]";
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface TooltipState {
  day: DayActivity;
  /** pixel offset from the left of the scrollable grid area */
  left: number;
  /** pixel offset from the top of the scrollable grid area */
  top: number;
}

export default function ActivityHeatmap({ days = 182 }: Props) {
  const [activities, setActivities] = useState<DayActivity[]>([]);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActivities(getActivityLog(days));
  }, [days]);

  if (activities.length === 0) return null;

  const today = new Date().toISOString().split("T")[0];

  // Pad the start so column 0 begins on Sunday
  const firstDate = new Date(activities[0].date + "T00:00:00");
  const startDow = firstDate.getDay(); // 0=Sun … 6=Sat

  const padded: (DayActivity | null)[] = [
    ...Array(startDow).fill(null),
    ...activities,
  ];
  // Round up to full weeks
  const totalCells = Math.ceil(padded.length / 7) * 7;
  while (padded.length < totalCells) padded.push(null);

  // Split into columns of 7 (each column = one week, Sun→Sat)
  const cols: (DayActivity | null)[][] = [];
  for (let c = 0; c < padded.length / 7; c++) {
    cols.push(padded.slice(c * 7, c * 7 + 7));
  }

  // Determine where each month label should appear
  const monthPositions: { label: string; colIndex: number }[] = [];
  let lastMonth = -1;
  cols.forEach((col, colIdx) => {
    for (const cell of col) {
      if (cell) {
        const m = new Date(cell.date + "T00:00:00").getMonth();
        if (m !== lastMonth) {
          monthPositions.push({ label: MONTH_LABELS[m], colIndex: colIdx });
          lastMonth = m;
        }
        break;
      }
    }
  });

  const totalXP = activities.reduce((s, a) => s + a.xp, 0);
  const activeDays = activities.filter((a) => a.xp > 0).length;

  const handleMouseEnter = (
    e: React.MouseEvent<HTMLDivElement>,
    cell: DayActivity
  ) => {
    if (!gridRef.current) return;
    const parentRect = gridRef.current.getBoundingClientRect();
    const cellRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setTooltip({
      day: cell,
      left: cellRect.left - parentRect.left + CELL / 2,
      top: cellRect.top - parentRect.top - 8,
    });
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
      {/* Header row */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-white">Learning Activity</h2>
        <div className="flex gap-4 text-xs text-[#8892B0]">
          <span>
            <span className="text-white font-medium">{activeDays}</span> active days
          </span>
          <span>
            <span className="text-white font-medium">{totalXP.toLocaleString()}</span> total XP
          </span>
        </div>
      </div>

      {/* Scrollable grid area — position:relative for tooltip anchor */}
      <div className="overflow-x-auto">
        <div ref={gridRef} style={{ position: "relative", display: "inline-block" }}>
          {/* Month labels row */}
          <div
            style={{
              display: "flex",
              paddingLeft: DAY_LABEL_W,
              marginBottom: 4,
            }}
          >
            {cols.map((_, colIdx) => {
              const pos = monthPositions.find((m) => m.colIndex === colIdx);
              return (
                <div
                  key={colIdx}
                  style={{ width: STEP, flexShrink: 0 }}
                  className="text-[10px] text-[#8892B0]"
                >
                  {pos ? pos.label : ""}
                </div>
              );
            })}
          </div>

          {/* Day labels + cell columns */}
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            {/* Day-of-week labels */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: GAP,
                width: DAY_LABEL_W,
                flexShrink: 0,
              }}
            >
              {DOW_LABELS.map((label, i) => (
                <div
                  key={i}
                  style={{ height: CELL, lineHeight: `${CELL}px` }}
                  className="text-[10px] text-[#8892B0] text-right pr-2 select-none"
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Cell grid */}
            <div style={{ display: "flex", gap: GAP }}>
              {cols.map((col, colIdx) => (
                <div
                  key={colIdx}
                  style={{ display: "flex", flexDirection: "column", gap: GAP }}
                >
                  {col.map((cell, rowIdx) => {
                    if (!cell) {
                      // Empty padding cell
                      return (
                        <div
                          key={rowIdx}
                          style={{ width: CELL, height: CELL, borderRadius: 2 }}
                        />
                      );
                    }
                    const isToday = cell.date === today;
                    const colorClass = getColor(cell.xp);
                    return (
                      <div
                        key={rowIdx}
                        style={{ width: CELL, height: CELL, borderRadius: 2, cursor: "default" }}
                        className={[
                          colorClass,
                          "transition-opacity duration-150 hover:opacity-70",
                          isToday ? "ring-1 ring-white/80" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        onMouseEnter={(e) => handleMouseEnter(e, cell)}
                        onMouseLeave={() => setTooltip(null)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Tooltip */}
          {tooltip && (
            <div
              className="pointer-events-none absolute z-50 bg-[#1a2040] border border-white/20 rounded-lg px-3 py-2 text-xs shadow-xl whitespace-nowrap"
              style={{
                left: tooltip.left,
                top: tooltip.top,
                transform: "translate(-50%, -100%)",
              }}
            >
              <div className="text-white font-semibold mb-0.5">
                {formatDate(tooltip.day.date)}
              </div>
              <div className="text-[#8892B0]">
                {tooltip.day.xp > 0 ? (
                  <>
                    <span className="text-[#4F7FE8] font-medium">{tooltip.day.xp} XP</span>
                    {" · "}
                    {tooltip.day.actions} action{tooltip.day.actions !== 1 ? "s" : ""}
                  </>
                ) : (
                  "No activity"
                )}
              </div>
              {/* Tiny caret */}
              <div
                className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-2 h-2 bg-[#1a2040] border-r border-b border-white/20 rotate-45"
              />
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-4 text-[10px] text-[#8892B0]">
        <span className="mr-1">Less</span>
        {["bg-white/5", "bg-[#4F7FE8]/30", "bg-[#4F7FE8]/60", "bg-[#4F7FE8]", "bg-[#FF4757]"].map(
          (cls) => (
            <div
              key={cls}
              style={{ width: 12, height: 12, borderRadius: 2, flexShrink: 0 }}
              className={cls}
            />
          )
        )}
        <span className="ml-1">More</span>
        <span className="ml-4 text-[#4A5568]">XP per day: 0 · 1–20 · 21–50 · 51–100 · 100+</span>
      </div>
    </div>
  );
}
