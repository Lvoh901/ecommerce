import type { LucideIcon } from "lucide-react";

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="card-lift relative bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4 border border-gray-100 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-1 bg-[#FF4500]"></div>
      <div className="w-12 h-12 rounded-xl bg-[#FF4500]/10 border border-[#FF4500]/20 flex items-center justify-center shrink-0 shadow-[0_0_18px_rgba(255,69,0,0.2)]">
        <Icon className="w-6 h-6 text-[#FF4500]" />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-extrabold text-gray-900">{value}</p>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        {hint && <p className="text-xs text-gray-400 truncate">{hint}</p>}
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    REQUESTED: "bg-yellow-100 text-yellow-800",
    NEW: "bg-blue-100 text-blue-800",
    CONFIRMED: "bg-indigo-100 text-indigo-800",
    READ: "bg-gray-200 text-gray-700",
    IN_PROGRESS: "bg-purple-100 text-purple-800",
    SHIPPED: "bg-purple-100 text-purple-800",
    DELIVERED: "bg-green-100 text-green-800",
    COMPLETED: "bg-green-100 text-green-800",
    REPLIED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-700",
  };
  const cls = styles[status] ?? "bg-gray-100 text-gray-700";
  return (
    <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full ${cls}`}>
      {status.replace("_", " ")}
    </span>
  );
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
    <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">{title}</h1>
        <div className="mt-2 h-1 w-24 rounded-full bg-[#FF4500]"></div>
        {subtitle && <p className="text-sm text-gray-500 mt-2">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-10 text-center text-gray-500">{message}</div>
  );
}
