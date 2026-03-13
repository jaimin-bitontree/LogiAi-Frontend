import type { Shipment } from "../types/Shipment";
import { COUNTRY_NAME_TO_ISO_NUMERIC } from "../data/countryCodeMap";

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
      shipment.request_data?.required?.destination_country ?? "Unknown";

    const isoCode = COUNTRY_NAME_TO_ISO_NUMERIC[country];

    if (!isoCode) return;

    mappedData[isoCode] = (mappedData[isoCode] || 0) + 1;
  });

  return mappedData;
}