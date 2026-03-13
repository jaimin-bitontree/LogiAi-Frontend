import { useQuery } from "@tanstack/react-query";
import { getShipments } from "../service/shipmentService";

export function useShipments() {
  return useQuery({
    queryKey: ["shipments"],
    queryFn: getShipments,
  });
}