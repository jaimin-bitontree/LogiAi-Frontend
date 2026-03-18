import type { ConfirmedRevenueAnalytics } from "../utils/dashboardMetrics";

interface RevenueAnalyticsCardProps {
  analytics: ConfirmedRevenueAnalytics;
}

interface BreakdownItem {
  name: string;
  value: number;
  percentage: number;
}

interface BreakdownListProps {
  title: string;
  items: BreakdownItem[];
}

function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function BreakdownList({
  title,
  items,
}: BreakdownListProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 min-w-0">
      <h3 className="text-sm font-semibold text-slate-700 mb-3">{title}</h3>

      {items.length === 0 ? (
        <p className="text-sm text-slate-400">No confirmed pricing data yet.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.name} className="min-w-0">
              <div className="flex items-center justify-between gap-2 text-xs mb-1.5 min-w-0">
                <span className="font-medium text-slate-600 truncate">{item.name}</span>
                <span className="text-slate-500 whitespace-nowrap">
                  {formatUsd(item.value)} ({item.percentage.toFixed(1)}%)
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${Math.min(item.percentage, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function RevenueAnalyticsCard({ analytics }: RevenueAnalyticsCardProps) {
  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200/80 p-4 sm:p-6 h-full min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-600">Confirmed Revenue (USD)</p>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 truncate">
            {formatUsd(analytics.totalRevenueUsd)}
          </p>
        </div>
        <p className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full font-medium w-fit">
          {analytics.confirmedWithPricing} confirmed requests with pricing
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BreakdownList
          title="Charge Breakdown"
          items={analytics.chargeBreakdown}
        />
        <BreakdownList
          title="Revenue by Transport Mode"
          items={analytics.transportModeRevenue}
        />
      </div>
    </div>
  );
}
