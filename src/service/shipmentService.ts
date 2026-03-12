import { api } from "./api";
import type { Shipment } from "../types/Shipment";

export const getShipments = async (): Promise<Shipment[]> => {
  const response = await api.get<Shipment[]>("/shipments");
  return response.data;
};