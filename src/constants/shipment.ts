import type { ShipmentStatus } from "../types/Shipment";

export const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "All", label: "All Statuses" },
  { value: "NEW", label: "New" },
  { value: "MISSING_INFO", label: "Missing Info" },
  { value: "PRICING_PENDING", label: "Pricing Pending" },
  { value: "QUOTED", label: "Quoted" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "CLOSED", label: "Closed" },
  { value: "CANCELLED", label: "Cancelled" },
];

export const STATUS_LABELS: Record<ShipmentStatus, string> = {
  NEW: "New",
  MISSING_INFO: "Missing Info",
  PRICING_PENDING: "Pricing Pending",
  QUOTED: "Quoted",
  CONFIRMED: "Confirmed",
  CLOSED: "Closed",
  CANCELLED: "Cancelled",
};

export const TABLE_STATUS_STYLES: Record<ShipmentStatus, string> = {
  NEW: "bg-sky-100 text-sky-700",
  MISSING_INFO: "bg-orange-100 text-orange-700",
  PRICING_PENDING: "bg-yellow-100 text-yellow-700",
  QUOTED: "bg-blue-100 text-blue-700",
  CONFIRMED: "bg-teal-100 text-teal-700",
  CLOSED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export const MODAL_STATUS_STYLES: Record<ShipmentStatus, string> = {
  NEW: "bg-sky-100 text-sky-800 border-sky-200",
  MISSING_INFO: "bg-orange-100 text-orange-800 border-orange-200",
  PRICING_PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  QUOTED: "bg-blue-100 text-blue-800 border-blue-200",
  CONFIRMED: "bg-teal-100 text-teal-800 border-teal-200",
  CLOSED: "bg-green-100 text-green-800 border-green-200",
  CANCELLED: "bg-red-100 text-red-800 border-red-200",
};