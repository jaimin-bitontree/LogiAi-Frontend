import type { Shipment } from "../types/Shipment";

/**
 * MOCK DATA REMOVED - Application now uses LIVE DATA ONLY from API
 * 
 * All shipment data is fetched from the backend API endpoint: /shipments
 * See: src/service/shipmentService.ts -> getShipments()
 * 
 * The API returns all shipments from the database.
 * No fallback to mock data - only real data from the backend is displayed.
 */

export const shipmentsData: Shipment[] = [];
