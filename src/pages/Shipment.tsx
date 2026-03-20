import {
  flexRender,
} from "@tanstack/react-table";
import {
  Search, Filter, ChevronUp, ChevronDown,
  ChevronLeft, ChevronRight, Package,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageLoader from "../components/PageLoader";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useShipmentPage } from "../hooks/useShipmentPage";

// ── Component ──────────────────────────────────────────────
export default function ShipmentPage() {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStatus = searchParams.get("status") ?? "All";
  const initialDay = searchParams.get("day") ?? "";
  const initialMode = searchParams.get("mode") ?? "";
  const initialCountryCode = searchParams.get("countryCode") ?? "";

  const {
    columns,
    error,
    from,
    dayFilter,
    isError,
    isLoading,
    pageIndex,
    searchReqId,
    setSearchReqId,
    setStatusFilter,
    setDayFilter,
    setModeFilter,
    statusFilter,
    statusOptions,
    table,
    to,
    totalRows,
  } = useShipmentPage(
    initialStatus,
    initialDay,
    initialMode,
    initialCountryCode,
    (requestId) => {
      navigate(`/shipments/${encodeURIComponent(requestId)}`);
    }
  );

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setDayFilter("");
    setModeFilter("");
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("status", value);
      next.delete("day");
      next.delete("mode");

      // Clear country filter when applying any other filter
      next.delete("countryCode");
      next.delete("country");

      return next;
    });
  };

  const clearDayFilter = () => {
    setDayFilter("");
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("day");
      // Clear country filter when applying a new filter
      next.delete("countryCode");
      next.delete("country");
      return next;
    });
  };

  // Keeps one consistent page shell for loading, error, and content states.
  const renderPageShell = (content: React.ReactNode) => (
    <div className='w-full h-dvh flex bg-(--dashboard-bg) overflow-hidden'>
      <Sidebar
        collapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed((prev) => !prev)}
      />
      <div className='flex flex-col flex-1 min-w-0 gap-2 sm:gap-3 p-1.5 sm:p-3 lg:p-4 overflow-hidden'>
        <Header title="Shipments" showLogout />
        <div className='info bg-transparent flex-1 overflow-y-auto overflow-x-hidden rounded-2xl sm:rounded-3xl pb-2 sm:pb-3 p-0.5 sm:p-1.5 pr-0.5 sm:pr-1.5'>
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
    <div className="bg-white/60 rounded-2xl sm:rounded-3xl p-2.5 sm:p-4">

      {/* Page Header */}
      <div className="mb-4 sm:mb-5 flex items-center gap-2.5 sm:gap-3 min-w-0">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
          <Package className="w-4 h-4 sm:w-5 sm:h-5 text-blue-700" />
        </div>
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">Shipment Requests</h1>
          <p className="text-xs sm:text-sm text-gray-400">
            {totalRows} request{totalRows !== 1 ? "s" : ""} found
          </p>
        </div>
      </div>

      {dayFilter && (
        <div className="mb-3 sm:mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5">
          <span className="text-xs font-medium text-blue-700 truncate">Day filter: {dayFilter}</span>
          <button
            type="button"
            onClick={clearDayFilter}
            className="text-xs font-semibold text-blue-700 hover:text-blue-900"
          >
            Clear
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5 mb-3.5 sm:mb-4">

        {/* Search */}
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Request ID..."
            value={searchReqId}
            onChange={(e) => setSearchReqId(e.target.value)}
            className="pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white shadow-sm w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
        </div>

        {/* Status Filter */}
        <div className="relative w-full sm:w-auto">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilterChange(e.target.value)}
            className="pl-9 pr-6 py-2.5 text-sm border border-gray-200 rounded-lg bg-white shadow-sm w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent appearance-none cursor-pointer"
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
          <table className="w-full min-w-190 text-sm">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-gray-100 bg-gray-50">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="text-left px-3 sm:px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer select-none whitespace-nowrap"
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
                    className="border-b border-gray-50 hover:bg-blue-50/50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-3 sm:px-4 py-3 text-gray-700">
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-3 sm:px-4 py-3 border-t border-gray-100 bg-gray-50/50">
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
    </div>
  );
}