import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { getShipments } from "../service/shipmentService";
import type { Shipment, ShipmentStatus } from "../types/Shipment";

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

const STATUS_STYLES: Record<ShipmentStatus, string> = {
  NEW: "bg-sky-100 text-sky-700",
  MISSING_INFO: "bg-orange-100 text-orange-700",
  PRICING_PENDING: "bg-yellow-100 text-yellow-700",
  QUOTED: "bg-blue-100 text-blue-700",
  CONFIRMED: "bg-indigo-100 text-indigo-700",
  CLOSED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<ShipmentStatus, string> = {
  NEW: "New",
  MISSING_INFO: "Missing Info",
  PRICING_PENDING: "Pricing Pending",
  QUOTED: "Quoted",
  CONFIRMED: "Confirmed",
  CLOSED: "Closed",
  CANCELLED: "Cancelled",
};

export function useShipmentPage() {
  const [searchReqId, setSearchReqId] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  const {
    data: shipments = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["shipments"],
    queryFn: getShipments,
  });

  const filteredData = useMemo<Shipment[]>(() => {
    return shipments.filter((row) => {
      const matchesSearch = row.request_id
        .toLowerCase()
        .includes(searchReqId.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || row.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [shipments, searchReqId, statusFilter]);

  const columns = useMemo<ColumnDef<Shipment>[]>(
    () => [
      {
        accessorKey: "request_id",
        header: "Req ID",
        cell: ({ row }) => (
          <button
            onClick={() => setSelectedShipment(row.original)}
            className="font-mono text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline underline-offset-2 transition-colors text-left"
          >
            {row.original.request_id}
          </button>
        ),
      },
      {
        id: "customer_name",
        header: "Customer Name",
        accessorFn: (row) => row.request_data?.required?.customer_name ?? "—",
        cell: ({ getValue }) => (
          <span className="font-medium text-gray-800">{getValue() as string}</span>
        ),
      },
      {
        accessorKey: "customer_email",
        header: "Email",
        cell: ({ getValue }) => (
          <span className="text-gray-500 text-xs">{getValue() as string}</span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => {
          const status = getValue() as ShipmentStatus;
          return (
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${STATUS_STYLES[status]}`}>
              {STATUS_LABELS[status]}
            </span>
          );
        },
      },
      {
        id: "origin",
        header: "Origin",
        accessorFn: (row) => {
          const required = row.request_data?.required;
          return required ? `${required.origin_city}, ${required.origin_country}` : "—";
        },
        cell: ({ getValue }) => (
          <span className="text-gray-600 text-sm">{getValue() as string}</span>
        ),
      },
      {
        id: "destination",
        header: "Destination",
        accessorFn: (row) => {
          const required = row.request_data?.required;
          return required ? `${required.destination_city}, ${required.destination_country}` : "—";
        },
        cell: ({ getValue }) => (
          <span className="text-gray-600 text-sm">{getValue() as string}</span>
        ),
      },
    ],
    []
  );

  const table = useReactTable<Shipment>({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  const { pageIndex, pageSize } = table.getState().pagination;
  const totalRows = filteredData.length;
  const from = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, totalRows);

  return {
    columns,
    error,
    from,
    isError,
    isLoading,
    pageIndex,
    searchReqId,
    selectedShipment,
    setSearchReqId,
    setSelectedShipment,
    setStatusFilter,
    statusFilter,
    statusOptions: STATUS_OPTIONS,
    table,
    to,
    totalRows,
  };
}