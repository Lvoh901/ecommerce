"use client";

import { useMemo, useState } from "react";

export type DayBucket = { date: string; label: string; orders: number; revenue: number };

/** Interactive mini bar chart: switch range and metric without another round trip. */
export default function OverviewChart({ days }: { days: DayBucket[] }) {
  const [range, setRange] = useState<7 | 14>(7);
  const [metric, setMetric] = useState<"orders" | "revenue">("orders");

  const visible = useMemo(() => days.slice(-range), [days, range]);

  const max = Math.max(1, ...visible.map((day) => day[metric]));
  const total = visible.reduce((sum, day) => sum + day[metric], 0);
  const peak = visible.reduce((best, day) => (day[metric] > best[metric] ? day : best), visible[0]);

  const format = (value: number) =>
    metric === "revenue" ? `Ksh.${value.toLocaleString("en-GB")}` : `${value} order${value === 1 ? "" : "s"}`;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 pb-1 pt-4 sm:px-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            {metric === "orders" ? "Orders" : "Revenue"} · last {range} days
          </p>
          <p className="text-xl font-extrabold text-gray-900 tabular-nums">
            {metric === "revenue" ? `Ksh.${total.toLocaleString("en-GB")}` : total}
            <span className="ml-2 text-xs font-medium text-gray-400">
              peak {format(peak?.[metric] ?? 0)}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex rounded-lg bg-gray-100 p-0.5">
            {(["orders", "revenue"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setMetric(option)}
                aria-pressed={metric === option}
                className={`rounded-md px-2.5 py-1 text-[11px] font-bold capitalize transition-colors ${
                  metric === option ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="flex rounded-lg bg-gray-100 p-0.5">
            {([7, 14] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setRange(option)}
                aria-pressed={range === option}
                className={`rounded-md px-2.5 py-1 text-[11px] font-bold transition-colors ${
                  range === option ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {option}d
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex h-40 items-end gap-1.5 px-4 pb-2 pt-3 sm:px-5">
        {visible.map((day) => {
          const value = day[metric];
          const height = Math.max(3, Math.round((value / max) * 100));
          return (
            <div key={day.date} className="group relative flex h-full flex-1 flex-col justify-end">
              <span className="pointer-events-none absolute -top-1 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-1.5 py-0.5 text-[10px] font-bold text-white group-hover:block">
                {format(value)}
              </span>
              <div
                title={`${day.label}: ${format(value)}`}
                className="w-full rounded-t-md bg-gradient-to-t from-[#FF4500]/40 to-[#FF4500] transition-all duration-200 group-hover:from-[#FF4500] group-hover:to-[#FF6a2b]"
                style={{ height: `${height}%` }}
              />
              <span className="mt-1.5 truncate text-center text-[10px] font-medium text-gray-400">
                {day.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
