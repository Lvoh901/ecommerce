import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";

/** Shared, hook-free admin primitives — safe in both server and client components. */

export function money(value: number) {
  return `Ksh.${value.toLocaleString("en-GB")}`;
}

/* Dates are formatted with an explicit locale so the server and the browser
   always produce the same string (an implicit locale causes hydration noise). */
export function formatDay(value: string | Date) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(new Date(value));
}

export function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function formatDateTime(value: string | Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

const TONE_CLASS = {
  neutral: "bg-gray-100 text-gray-700 ring-gray-200",
  warn: "bg-amber-50 text-amber-800 ring-amber-200",
  info: "bg-sky-50 text-sky-800 ring-sky-200",
  brand: "bg-[#FF4500]/10 text-[#c2410c] ring-[#FF4500]/25",
  progress: "bg-violet-50 text-violet-800 ring-violet-200",
  good: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  bad: "bg-red-50 text-red-700 ring-red-200",
} as const;

export const STATUS_META: Record<
  string,
  { label: string; tone: keyof typeof TONE_CLASS; dot: string }
> = {
  PENDING: { label: "Pending", tone: "warn", dot: "bg-amber-500" },
  REQUESTED: { label: "Requested", tone: "warn", dot: "bg-amber-500" },
  NEW: { label: "New", tone: "info", dot: "bg-sky-500" },
  CONFIRMED: { label: "Confirmed", tone: "progress", dot: "bg-violet-500" },
  READ: { label: "Read", tone: "neutral", dot: "bg-gray-400" },
  IN_PROGRESS: { label: "In progress", tone: "progress", dot: "bg-violet-500" },
  SHIPPED: { label: "Shipped", tone: "brand", dot: "bg-[#FF4500]" },
  DELIVERED: { label: "Delivered", tone: "good", dot: "bg-emerald-500" },
  COMPLETED: { label: "Completed", tone: "good", dot: "bg-emerald-500" },
  REPLIED: { label: "Replied", tone: "good", dot: "bg-emerald-500" },
  CANCELLED: { label: "Cancelled", tone: "bad", dot: "bg-red-500" },
};

export function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status] ?? {
    label: status.replace(/_/g, " ").toLowerCase(),
    tone: "neutral" as const,
    dot: "bg-gray-400",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ring-1 ${TONE_CLASS[meta.tone]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} aria-hidden />
      {meta.label}
    </span>
  );
}

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  href,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
  href?: string;
}) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-2">
        <div className="w-11 h-11 rounded-xl bg-[#FF4500]/10 border border-[#FF4500]/20 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-[#FF4500]" />
        </div>
        {href && (
          <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-[#FF4500] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        )}
      </div>
      <p className="mt-3 text-2xl font-extrabold text-gray-900 tabular-nums leading-none">{value}</p>
      <p className="mt-1.5 text-sm font-medium text-gray-600">{label}</p>
      {hint && <p className="mt-0.5 text-xs text-gray-400 truncate">{hint}</p>}
    </>
  );

  const className =
    "group relative block bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 overflow-hidden transition-all";

  if (href) {
    return (
      <Link
        href={href}
        className={`${className} hover:border-[#FF4500]/30 hover:shadow-[0_10px_30px_-12px_rgba(255,69,0,0.35)] focus-visible:outline-none`}
      >
        {body}
      </Link>
    );
  }
  return <div className={className}>{body}</div>;
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
      <div className="min-w-0">
        <h1 className="text-2xl sm:text-[1.75rem] font-extrabold text-gray-900 truncate">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {action && <div className="flex items-center gap-2 shrink-0">{action}</div>}
    </div>
  );
}

export function Panel({
  title,
  description,
  action,
  children,
  className = "",
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${className}`}>
      {(title || action) && (
        <header className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-5 py-4 border-b border-gray-100">
          <div className="min-w-0">
            {title && <h2 className="text-base font-bold text-gray-900">{title}</h2>}
            {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export function EmptyState({
  message,
  title,
  action,
}: {
  message: string;
  title?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-dashed border-gray-200 px-6 py-12 text-center">
      <p className="text-base font-bold text-gray-900">{title ?? "Nothing here yet"}</p>
      <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">{message}</p>
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}
