import Header from '../components/Header'
import StatCard from '../components/StatCard'
import { Package, XCircle, CheckCircle } from 'lucide-react'
import BarChartCard from '../components/BarChartCard'
import WorldMapCard from '../components/WorldMapCard'
import TransportPieChart from '../components/TransportPieChart'
import Sidebar from '../components/Sidebar'
import { useShipments } from '../hooks/useShipments'
import {
  getTotalRequests,
  getConfirmedRequests,
  getCancelledRequests,
  getDailyRequests,
  getTransportModeData,
  getMapCountryData,
} from '../utils/dashboardMetrics'

function Dashboard() {
    // shipments defaults to [] so all metrics show 0 while loading
    const { data: shipments = [], isError, error } = useShipments();

    const totalRequests = getTotalRequests(shipments);
    const cancelledRequests = getCancelledRequests(shipments);
    const confirmedRequests = getConfirmedRequests(shipments);
    const dailyData = getDailyRequests(shipments);
    const transportData = getTransportModeData(shipments);
    const mapCountryData = getMapCountryData(shipments);

    return (
        <div className='w-full h-screen flex bg-[#f0f2f5] p-2 gap-4 overflow-hidden'>
            <Sidebar />

            <div className='flex flex-col flex-1 gap-4 pr-2 overflow-hidden'>
                <Header />

                {/* Non-blocking error banner — dashboard still renders with 0 values */}
                {isError && (
                    <div className="bg-red-50 border border-red-200 text-red-500 text-sm px-4 py-2 rounded-2xl">
                        Failed to load data: {error instanceof Error ? error.message : "Unknown error"}
                    </div>
                )}

                <div className='info bg-transparent flex-1 overflow-y-auto rounded-3xl pb-4 p-2 pr-2'>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                            <StatCard
                                title="Total Requests"
                                value={totalRequests}
                                trendPercentage="0%"
                                trendLabel="Live API Data"
                                isPositiveTrend={true}
                                icon={Package}
                                iconBgColor="bg-indigo-50"
                                iconColor="text-indigo-500"
                                sparklineData={[30, 45, 28, 60, 40, 75, 55, 80, 65, 90]}
                            />
                        </div>

                        <div className="col-span-1">
                            <StatCard
                                title="Cancelled Requests"
                                value={cancelledRequests}
                                trendPercentage="0%"
                                trendLabel="Live API Data"
                                isPositiveTrend={false}
                                icon={XCircle}
                                iconBgColor="bg-red-50"
                                iconColor="text-red-400"
                                sparklineData={[50, 40, 60, 35, 55, 30, 45, 25, 40, 20]}
                            />
                        </div>

                        <div className="col-span-1">
                            <StatCard
                                title="Confirmed Requests"
                                value={confirmedRequests}
                                trendPercentage="0%"
                                trendLabel="Live API Data"
                                isPositiveTrend={true}
                                icon={CheckCircle}
                                iconBgColor="bg-green-50"
                                iconColor="text-green-500"
                                sparklineData={[20, 35, 25, 50, 35, 60, 45, 70, 55, 85]}
                            />
                        </div>

                        <div className="col-span-3 min-h-[300px]">
                            <BarChartCard
                                title="Daily Requests"
                                data={dailyData}
                                xAxisKey="name"
                                yAxisKey="requests"
                                barColor="#6366f1"
                            />
                        </div>

                        <div className="col-span-2 h-[350px]">
                            <WorldMapCard countryData={mapCountryData} />
                        </div>

                        <div className="col-span-1 h-[350px]">
                            <TransportPieChart data={transportData} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard