import { useEffect, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import type { Shipment, ShipmentStatus } from "../types/Shipment";
import { useShipments } from "./useShipments";
import { COUNTRY_NAME_TO_ISO_NUMERIC } from "../data/countryCodeMap";
import {
  STATUS_LABELS,
  STATUS_OPTIONS,
  TABLE_STATUS_STYLES,
} from "../constants/shipment";

export function useShipmentPage(
  initialStatus = "All",
  initialDay = "",
  initialMode = "",
  initialCountryCode = "",
  onOpenShipment?: (requestId: string) => void
) {
  // Local UI state for shipment page interactions.
  const validStatuses = new Set(STATUS_OPTIONS.map((option) => option.value));
  const safeInitialStatus = validStatuses.has(initialStatus) ? initialStatus : "All";
  const [searchReqId, setSearchReqId] = useState("");
  const [statusFilter, setStatusFilter] = useState(safeInitialStatus);
  const [dayFilter, setDayFilter] = useState(initialDay);
  const [modeFilter, setModeFilter] = useState(initialMode);
  const [countryCodeFilter, setCountryCodeFilter] = useState(initialCountryCode);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  useEffect(() => {
    setStatusFilter(safeInitialStatus);
  }, [safeInitialStatus]);

  useEffect(() => {
    setDayFilter(initialDay);
  }, [initialDay]);

  useEffect(() => {
    setModeFilter(initialMode);
  }, [initialMode]);

  useEffect(() => {
    setCountryCodeFilter(initialCountryCode);
  }, [initialCountryCode]);

   const {
    data: shipments = [],
    isLoading,
    isError,
    error,
  } = useShipments();

  const filteredData = useMemo<Shipment[]>(() => {
    return shipments.filter((row) => {
      const matchesSearch = row.request_id
        .toLowerCase()
        .includes(searchReqId.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || row.status === statusFilter;

      const createdAt = new Date(row.created_at);
      const createdDateKey = Number.isNaN(createdAt.getTime())
        ? ""
        : `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, "0")}-${String(createdAt.getDate()).padStart(2, "0")}`;

      const matchesDay = !dayFilter || createdDateKey === dayFilter;

      const normalizedMode = (row.request_data?.required?.transport_mode ?? "")
        .trim()
        .toLowerCase();
      const targetMode = modeFilter.trim().toLowerCase();
      const matchesMode =
        !targetMode ||
        normalizedMode === targetMode ||
        normalizedMode.includes(targetMode);

      const originCountry = row.request_data?.required?.origin_country ?? "";
      const originCountryCode = COUNTRY_NAME_TO_ISO_NUMERIC[originCountry] ?? "";
      const matchesCountry =
        !countryCodeFilter || originCountryCode === countryCodeFilter;

      return matchesSearch && matchesStatus && matchesDay && matchesMode && matchesCountry;
    });
  }, [shipments, searchReqId, statusFilter, dayFilter, modeFilter, countryCodeFilter]);

  const columns = useMemo<ColumnDef<Shipment>[]>(
    () => [
      {
        accessorKey: "request_id",
        header: "Req ID",
        cell: ({ row }) => (
          <button
            onClick={() => {
              if (onOpenShipment) {
                onOpenShipment(row.original.request_id);
                return;
              }
              setSelectedShipment(row.original);
            }}
            className="font-mono text-xs font-semibold text-blue-700 hover:text-blue-900 hover:underline underline-offset-2 transition-colors text-left"
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
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${TABLE_STATUS_STYLES[status]}`}>
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
    [onOpenShipment]
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
    dayFilter,
    modeFilter,
    countryCodeFilter,
    setSearchReqId,
    setSelectedShipment,
    setStatusFilter,
    setDayFilter,
    setModeFilter,
    setCountryCodeFilter,
    statusFilter,
    statusOptions: STATUS_OPTIONS,
    table,
    to,
    totalRows,
  };
}