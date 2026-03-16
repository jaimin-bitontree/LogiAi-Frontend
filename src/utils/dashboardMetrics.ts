import type { Shipment } from "../types/Shipment";
import { COUNTRY_NAME_TO_ISO_NUMERIC } from "../data/countryCodeMap";

type StatMode = "total" | "confirmed" | "cancelled";

export interface DashboardStatMetric {
  value: number;
  trendPercentage: string;
  trendLabel: string;
  isPositiveTrend: boolean;
  sparklineData: number[];
}

export interface DashboardStatCards {
  total: DashboardStatMetric;
  cancelled: DashboardStatMetric;
  confirmed: DashboardStatMetric;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const SPARKLINE_DAYS = 10;
const TREND_WINDOW_DAYS = 7;

function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function addDays(date: Date, days: number): Date {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function matchesMode(shipment: Shipment, mode: StatMode): boolean {
  if (mode === "confirmed") return shipment.status === "CONFIRMED";
  if (mode === "cancelled") return shipment.status === "CANCELLED";
  return true;
}

function countInRange(
  shipments: Shipment[],
  mode: StatMode,
  startInclusive: Date,
  endExclusive: Date
): number {
  const start = startInclusive.getTime();
  const end = endExclusive.getTime();

  return shipments.reduce((count, shipment) => {
    if (!matchesMode(shipment, mode)) return count;

    const createdAt = new Date(shipment.created_at).getTime();
    if (Number.isNaN(createdAt)) return count;

    return createdAt >= start && createdAt < end ? count + 1 : count;
  }, 0);
}

function getSparklineData(shipments: Shipment[], mode: StatMode): number[] {
  const today = startOfDay(new Date());
  const firstDay = addDays(today, -(SPARKLINE_DAYS - 1));
  const buckets = Array.from({ length: SPARKLINE_DAYS }, () => 0);

  shipments.forEach((shipment) => {
    if (!matchesMode(shipment, mode)) return;

    const createdAt = new Date(shipment.created_at);
    if (Number.isNaN(createdAt.getTime())) return;

    const createdDay = startOfDay(createdAt);
    const dayIndex = Math.floor(
      (createdDay.getTime() - firstDay.getTime()) / MS_PER_DAY
    );

    if (dayIndex < 0 || dayIndex >= SPARKLINE_DAYS) return;
    buckets[dayIndex] += 1;
  });

  return buckets;
}

function toTrendPercentage(current: number, previous: number): number {
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / previous) * 100;
}

function formatTrend(percentage: number): string {
  const rounded = Math.round(percentage * 10) / 10;
  const withSign = `${rounded > 0 ? "+" : ""}${rounded}`;
  return `${withSign}%`;
}

function getMetric(shipments: Shipment[], mode: StatMode): DashboardStatMetric {
  const value = shipments.filter((shipment) => matchesMode(shipment, mode)).length;

  const today = startOfDay(new Date());
  const currentStart = addDays(today, -(TREND_WINDOW_DAYS - 1));
  const currentEnd = addDays(today, 1);
  const previousStart = addDays(currentStart, -TREND_WINDOW_DAYS);
  const previousEnd = currentStart;

  const current = countInRange(shipments, mode, currentStart, currentEnd);
  const previous = countInRange(shipments, mode, previousStart, previousEnd);
  const trend = toTrendPercentage(current, previous);

  const isPositiveTrend =
    mode === "cancelled" ? trend <= 0 : trend >= 0;

  return {
    value,
    trendPercentage: formatTrend(trend),
    trendLabel: `vs prev ${TREND_WINDOW_DAYS} days`,
    isPositiveTrend,
    sparklineData: getSparklineData(shipments, mode),
  };
}

export function getDashboardStatCards(shipments: Shipment[]): DashboardStatCards {
  return {
    total: getMetric(shipments, "total"),
    cancelled: getMetric(shipments, "cancelled"),
    confirmed: getMetric(shipments, "confirmed"),
  };
}

export function getTotalRequests(shipments: Shipment[]) {
  return shipments.length;
}
export function getConfirmedRequests(shipments: Shipment[]) {
  return shipments.filter((shipment) => shipment.status === "CONFIRMED").length;
}

export function getCancelledRequests(shipments: Shipment[]) {
  return shipments.filter((shipment) => shipment.status === "CANCELLED").length;
}

export function getDailyRequests(shipments: Shipment[]) {
  const dayMap: Record<string, number> = {
    Sun: 0,
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
  }
  shipments.forEach((shipment) => {
    const date = new Date(shipment.created_at);
    const day = date.toLocaleDateString("en-US", { weekday: "short" });
    if (dayMap[day] !== undefined) {
      dayMap[day] += 1;
    }
  });

  return Object.entries(dayMap).map(([name, requests]) => ({
    name,
    requests,
  }));
}

  
// Valid transport modes as defined by the backend
const TRANSPORT_MODES = ["Sea", "Air", "Road", "Rail"] as const;

export function getTransportModeData(shipments: Shipment[]) {
  // Initialise all modes to 0 so every slice always appears in the chart
  const modeMap: Record<string, number> = Object.fromEntries(
    TRANSPORT_MODES.map((m) => [m, 0])
  );

  shipments.forEach((shipment) => {
    const mode = shipment.request_data?.required?.transport_mode?.trim() ?? "Unknown";
    // Count known modes; bucket anything unexpected as "Unknown"
    if (mode in modeMap) {
      modeMap[mode] += 1;
    } else {
      modeMap["Unknown"] = (modeMap["Unknown"] ?? 0) + 1;
    }
  });

  return Object.entries(modeMap).map(([name, value]) => ({
    name,
    value,
  }));
}


export function getCountryCounts(shipments: Shipment[]) {
  const countryMap: Record<string, number> = {};

  shipments.forEach((shipment) => {
    const country =
      shipment.request_data?.required?.destination_country ?? "Unknown";

    countryMap[country] = (countryMap[country] || 0) + 1;
  });

  return countryMap;
}
export function getMapCountryData(shipments: Shipment[]) {
  const mappedData: Record<string, number> = {};

  shipments.forEach((shipment) => {
    const country =
      shipment.request_data?.required?.origin_country ?? "Unknown";

    const isoCode = COUNTRY_NAME_TO_ISO_NUMERIC[country];

    if (!isoCode) return;

    mappedData[isoCode] = (mappedData[isoCode] || 0) + 1;
  });

  return mappedData;
}