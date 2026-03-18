import {
  flexRender,
} from "@tanstack/react-table";
import {
  Search, Filter, ChevronUp, ChevronDown,
  ChevronLeft, ChevronRight, Package,
} from "lucide-react";
import ShipmentDetailModal from "../components/ShipmentDetailModal";
import PageLoader from "../components/PageLoader";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useShipmentPage } from "../hooks/useShipmentPage";

// ── Component ──────────────────────────────────────────────
export default function ShipmentPage() {
  const {
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
    statusOptions,
    table,
    to,
    totalRows,
  } = useShipmentPage();

  // Keeps one consistent page shell for loading, error, and content states.
  const renderPageShell = (content: React.ReactNode) => (
    <div className='w-full h-screen flex bg-[var(--dashboard-bg)] p-2 gap-4 overflow-hidden'>
      <Sidebar />
      <div className='flex flex-col flex-1 gap-4 pr-2 pl-1 overflow-hidden'>
        <Header title="Shipments" />
        <div className='info bg-transparent flex-1 overflow-y-auto rounded-3xl pb-4 p-2 pr-2'>
          {content}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return renderPageShell(<PageLoader message="Loading shipments..." />);
  }

  if (isError) {
    return renderPageShell(
      <div className="bg-white rounded-3xl p-6 text-red-500">
        Failed to load shipments.
        {error instanceof Error ? ` ${error.message}` : ""}
      </div>
    );
  }

  return renderPageShell(
    <div className="bg-white/60 rounded-3xl p-4 sm:p-6">

      {/* Page Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
          <Package className="w-5 h-5 text-teal-700" />
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
            className="pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white shadow-sm w-72 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-9 pr-6 py-2.5 text-sm border border-gray-200 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent appearance-none cursor-pointer"
          >
            {statusOptions.map((opt) => (
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
                        {header.column.getIsSorted() === "asc" && <ChevronUp className="w-3 h-3" />}
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
                    className="border-b border-gray-50 hover:bg-teal-50/40 transition-colors"
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