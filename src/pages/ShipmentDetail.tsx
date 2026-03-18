import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import PageLoader from "../components/PageLoader";
import ShipmentDetailModal from "../components/ShipmentDetailModal";
import { useShipments } from "../hooks/useShipments";

export default function ShipmentDetailPage() {
  const navigate = useNavigate();
  const { requestId = "" } = useParams();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const {
    data: shipments = [],
    isLoading,
    isError,
    error,
  } = useShipments();

  const shipment = useMemo(
    () => shipments.find((item) => item.request_id === requestId) ?? null,
    [shipments, requestId]
  );

  const renderPageShell = (content: React.ReactNode) => (
    <div className="w-full h-dvh flex bg-(--dashboard-bg) overflow-hidden">
      <Sidebar
        collapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed((prev) => !prev)}
      />
      <div className="flex flex-col flex-1 min-w-0 gap-2 sm:gap-3 p-1.5 sm:p-3 lg:p-4 overflow-hidden">
        <Header title="Shipment Details" />
        <div className="info bg-transparent flex-1 overflow-y-auto overflow-x-hidden rounded-2xl sm:rounded-3xl pb-2 sm:pb-3 p-0.5 sm:p-1.5 pr-0.5 sm:pr-1.5">
          {content}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return renderPageShell(<PageLoader message="Loading shipment details..." />);
  }

  if (isError) {
    return renderPageShell(
      <div className="bg-white rounded-2xl p-4 sm:p-5 text-red-500 text-sm">
        Failed to load shipment details.
        {error instanceof Error ? ` ${error.message}` : ""}
      </div>
    );
  }

  if (!shipment) {
    return renderPageShell(
      <div className="bg-white rounded-2xl p-4 sm:p-5 text-gray-600 text-sm">
        Shipment not found.
      </div>
    );
  }

  return renderPageShell(
    <ShipmentDetailModal
      shipment={shipment}
      onClose={() => navigate("/shipments")}
      asPage
    />
  );
}
