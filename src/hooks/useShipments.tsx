import { useQuery } from "@tanstack/react-query";
import { getShipments } from "../service/shipmentService";

const DEFAULT_QUERY_TIME_MS = 30_000;

function toMs(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

const SHIPMENTS_STALE_TIME_MS = toMs(
  import.meta.env.VITE_SHIPMENTS_STALE_TIME_MS,
  DEFAULT_QUERY_TIME_MS
);
const SHIPMENTS_REFETCH_INTERVAL_MS = toMs(
  import.meta.env.VITE_SHIPMENTS_REFETCH_INTERVAL_MS,
  DEFAULT_QUERY_TIME_MS
);

export function useShipments() {
  return useQuery({
    queryKey: ["shipments"],
    queryFn: getShipments,
    staleTime: SHIPMENTS_STALE_TIME_MS,
    refetchInterval: SHIPMENTS_REFETCH_INTERVAL_MS,
    refetchIntervalInBackground: false,
  });
}