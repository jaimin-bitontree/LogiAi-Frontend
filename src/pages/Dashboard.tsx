import { useMemo } from 'react'
import Header from '../components/Header'
import StatCard from '../components/StatCard'
import { Package, XCircle, CheckCircle } from 'lucide-react'
import BarChartCard from '../components/BarChartCard'
import WorldMapCard from '../components/WorldMapCard'
import TransportPieChart from '../components/TransportPieChart'
import Sidebar from '../components/Sidebar'
import { useShipments } from '../hooks/useShipments'
import {
    getDashboardStatCards,
  getDailyRequests,
  getTransportModeData,
  getMapCountryData,
} from '../utils/dashboardMetrics'

function Dashboard() {
    // shipments defaults to [] so all metrics show 0 while loading
    const { data: shipments = [], isError, error } = useShipments();

    const statCards = useMemo(() => getDashboardStatCards(shipments), [shipments]);
    const dailyData = useMemo(() => getDailyRequests(shipments), [shipments]);
    const transportData = useMemo(() => getTransportModeData(shipments), [shipments]);
    const mapCountryData = useMemo(() => getMapCountryData(shipments), [shipments]);

    return (
        <div className='w-full h-screen flex bg-[var(--dashboard-bg)] p-2 gap-4 overflow-hidden'>
            <Sidebar />

            <div className='flex flex-col flex-1 gap-4 pr-2 pl-1 overflow-hidden'>
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
                                value={statCards.total.value}
                                trendPercentage={statCards.total.trendPercentage}
                                trendLabel={statCards.total.trendLabel}
                                isPositiveTrend={statCards.total.isPositiveTrend}
                                icon={Package}
                                iconBgColor="bg-teal-50"
                                iconColor="text-teal-700"
                                sparklineData={statCards.total.sparklineData}
                            />
                        </div>

                        <div className="col-span-1">
                            <StatCard
                                title="Cancelled Requests"
                                value={statCards.cancelled.value}
                                trendPercentage={statCards.cancelled.trendPercentage}
                                trendLabel={statCards.cancelled.trendLabel}
                                isPositiveTrend={statCards.cancelled.isPositiveTrend}
                                icon={XCircle}
                                iconBgColor="bg-amber-50"
                                iconColor="text-amber-600"
                                sparklineData={statCards.cancelled.sparklineData}
                            />
                        </div>

                        <div className="col-span-1">
                            <StatCard
                                title="Confirmed Requests"
                                value={statCards.confirmed.value}
                                trendPercentage={statCards.confirmed.trendPercentage}
                                trendLabel={statCards.confirmed.trendLabel}
                                isPositiveTrend={statCards.confirmed.isPositiveTrend}
                                icon={CheckCircle}
                                iconBgColor="bg-emerald-50"
                                iconColor="text-emerald-600"
                                sparklineData={statCards.confirmed.sparklineData}
                            />
                        </div>

                        <div className="col-span-3 min-h-[300px]">
                            <BarChartCard
                                title="Daily Requests"
                                data={dailyData}
                                xAxisKey="name"
                                yAxisKey="requests"
                                barColor="#0f766e"
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