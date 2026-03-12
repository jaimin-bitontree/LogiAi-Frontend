import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  
} from "@tanstack/react-table";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import {
  Search, Filter, ChevronUp, ChevronDown,
  Paperclip, ChevronLeft, ChevronRight, Package,
} from "lucide-react";
import { shipmentsData } from "../data/ShipmentData";
import ShipmentDetailModal from "../components/ShipmentDetailModal";
import  type { ShipmentStatus,Shipment } from "../types/Shipment";
// ── Constants ──────────────────────────────────────────────
const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "All",             label: "All Statuses" },
  { value: "NEW",             label: "New" },
  { value: "MISSING_INFO",    label: "Missing Info" },
  { value: "PRICING_PENDING", label: "Pricing Pending" },
  { value: "QUOTED",          label: "Quoted" },
  { value: "CONFIRMED",       label: "Confirmed" },
  { value: "CLOSED",          label: "Closed" },
  { value: "CANCELLED",       label: "Cancelled" },
];

const STATUS_STYLES: Record<ShipmentStatus, string> = {
  NEW:             "bg-sky-100 text-sky-700",
  MISSING_INFO:    "bg-orange-100 text-orange-700",
  PRICING_PENDING: "bg-yellow-100 text-yellow-700",
  QUOTED:          "bg-blue-100 text-blue-700",
  CONFIRMED:       "bg-indigo-100 text-indigo-700",
  CLOSED:          "bg-green-100 text-green-700",
  CANCELLED:       "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<ShipmentStatus, string> = {
  NEW:             "New",
  MISSING_INFO:    "Missing Info",
  PRICING_PENDING: "Pricing Pending",
  QUOTED:          "Quoted",
  CONFIRMED:       "Confirmed",
  CLOSED:          "Closed",
  CANCELLED:       "Cancelled",
};

// ── Component ──────────────────────────────────────────────
export default function ShipmentPage() {
  const [searchReqId, setSearchReqId]           = useState<string>("");
  const [statusFilter, setStatusFilter]         = useState<string>("All");
  const [sorting, setSorting]                   = useState<SortingState>([]);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  // Filter data before passing to table
  const filteredData = useMemo<Shipment[]>(() => {
    return shipmentsData.filter((row) => {
      const matchesSearch = row.request_id
        .toLowerCase()
        .includes(searchReqId.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || row.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchReqId, statusFilter]);

  // Column definitions
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
          const s = getValue() as ShipmentStatus;
          return (
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${STATUS_STYLES[s]}`}>
              {STATUS_LABELS[s]}
            </span>
          );
        },
      },
      {
        id: "origin",
        header: "Origin",
        accessorFn: (row) => {
          const r = row.request_data?.required;
          return r ? `${r.origin_city}, ${r.origin_country}` : "—";
        },
        cell: ({ getValue }) => (
          <span className="text-gray-600 text-sm">{getValue() as string}</span>
        ),
      },
      {
        id: "destination",
        header: "Destination",
        accessorFn: (row) => {
          const r = row.request_data?.required;
          return r ? `${r.destination_city}, ${r.destination_country}` : "—";
        },
        cell: ({ getValue }) => (
          <span className="text-gray-600 text-sm">{getValue() as string}</span>
        ),
      },
      {
        id: "attachments",
        header: "Attachments",
        accessorFn: (row) => row.attachments?.length ?? 0,
        cell: ({ getValue, row }) => {
          const count = getValue() as number;
          return count > 0 ? (
            <button
              onClick={() => setSelectedShipment(row.original)}
              className="flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-700 font-medium"
            >
              <Paperclip className="w-3.5 h-3.5" />
              {count} file{count > 1 ? "s" : ""}
            </button>
          ) : (
            <span className="text-gray-300 text-xs">—</span>
          );
        },
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
  const to   = Math.min((pageIndex + 1) * pageSize, totalRows);

  return (
    <div className="p-6 min-h-screen bg-gray-50">

      {/* Page Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
          <Package className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Shipment Requests</h1>
          <p className="text-sm text-gray-400">
            {totalRows} request{totalRows !== 1 ? "s" : ""} found
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Request ID..."
            value={searchReqId}
            onChange={(e) => setSearchReqId(e.target.value)}
            className="pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white shadow-sm w-72 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-9 pr-6 py-2.5 text-sm border border-gray-200 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none cursor-pointer"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-gray-100 bg-gray-50">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer select-none whitespace-nowrap"
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() === "asc"  && <ChevronUp   className="w-3 h-3" />}
                        {header.column.getIsSorted() === "desc" && <ChevronDown className="w-3 h-3" />}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-16 text-gray-400 text-sm">
                    No shipment requests match your filters.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-50 hover:bg-indigo-50/30 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-5 py-3.5 text-gray-700">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-gray-50/50">
          <p className="text-xs text-gray-400">
            {totalRows === 0 ? "No results" : `Showing ${from}–${to} of ${totalRows}`}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-medium text-gray-600">
              Page {pageIndex + 1} of {table.getPageCount() || 1}
            </span>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedShipment && (
        <ShipmentDetailModal
          shipment={selectedShipment}
          onClose={() => setSelectedShipment(null)}
        />
      )}
    </div>
  );
}