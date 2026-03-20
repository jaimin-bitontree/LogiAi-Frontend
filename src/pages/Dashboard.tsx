import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import StatCard from '../components/StatCard'
import { Package, XCircle, CheckCircle } from 'lucide-react'
import BarChartCard from '../components/BarChartCard'
import WorldMapCard from '../components/WorldMapCard'
import TransportPieChart from '../components/TransportPieChart'
import Sidebar from '../components/Sidebar'
import { useShipments } from '../hooks/useShipments'
import { useCurrencyRates } from '../hooks/useCurrencyRates'
import RevenueAnalyticsCard from '../components/RevenueAnalyticsCard'
import {
    getDashboardStatCards,
    getDailyRequests,
    getTransportModeData,
    getMapCountryData,
    getConfirmedRevenueAnalytics,
} from '../utils/dashboardMetrics'

function Dashboard() {
    const navigate = useNavigate();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    // shipments defaults to [] so all metrics show 0 while loading
    const { data: shipments = [], isError, error } = useShipments();
    const { rates } = useCurrencyRates();

    const statCards = useMemo(() => getDashboardStatCards(shipments), [shipments]);
    const dailyData = useMemo(() => getDailyRequests(shipments), [shipments]);
    const transportData = useMemo(() => getTransportModeData(shipments), [shipments]);
    const mapCountryData = useMemo(() => getMapCountryData(shipments), [shipments]);
    const revenueAnalytics = useMemo(
        () => getConfirmedRevenueAnalytics(shipments, rates),
        [shipments, rates]
    );

    return (
        <div className='w-full h-dvh flex bg-(--dashboard-bg) overflow-hidden'>
            <Sidebar
                collapsed={isSidebarCollapsed}
                onToggle={() => setIsSidebarCollapsed((prev) => !prev)}
            />

            <div className='flex flex-col flex-1 min-w-0 gap-2 sm:gap-3 p-1.5 sm:p-3 lg:p-4 overflow-hidden'>
                <Header showLogout />

                {/* Non-blocking error banner — dashboard still renders with 0 values */}
                {isError && (
                    <div className="bg-red-50 border border-red-200 text-red-500 text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-2xl">
                        Failed to load data: {error instanceof Error ? error.message : "Unknown error"}
                    </div>
                )}

                <div className='info bg-transparent flex-1 overflow-y-auto overflow-x-hidden rounded-2xl sm:rounded-3xl pb-2 sm:pb-3 p-0.5 sm:p-1.5 pr-0.5 sm:pr-1.5'>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-2.5 sm:gap-3">
                        <div className="md:col-span-1 xl:col-span-4 min-w-0">
                            <StatCard
                                title="Total Requests"
                                value={statCards.total.value}
                                trendPercentage={statCards.total.trendPercentage}
                                trendLabel={statCards.total.trendLabel}
                                isPositiveTrend={statCards.total.isPositiveTrend}
                                icon={Package}
                                iconBgColor="bg-blue-50"
                                iconColor="text-blue-700"
                                sparklineData={statCards.total.sparklineData}
                                onClick={() => navigate('/shipments?status=All')}
                                clickable
                            />
                        </div>

                        <div className="md:col-span-1 xl:col-span-4 min-w-0">
                            <StatCard
                                title="Cancelled Requests"
                                value={statCards.cancelled.value}
                                trendPercentage={statCards.cancelled.trendPercentage}
                                trendLabel={statCards.cancelled.trendLabel}
                                isPositiveTrend={statCards.cancelled.isPositiveTrend}
                                icon={XCircle}
                                iconBgColor="bg-rose-50"
                                iconColor="text-rose-600"
                                sparklineData={statCards.cancelled.sparklineData}
                                onClick={() => navigate('/shipments?status=CANCELLED')}
                                clickable
                            />
                        </div>

                        <div className="md:col-span-2 xl:col-span-4 min-w-0">
                            <StatCard
                                title="Confirmed Requests"
                                value={statCards.confirmed.value}
                                trendPercentage={statCards.confirmed.trendPercentage}
                                trendLabel={statCards.confirmed.trendLabel}
                                isPositiveTrend={statCards.confirmed.isPositiveTrend}
                                icon={CheckCircle}
                                iconBgColor="bg-emerald-50"
                                iconColor="text-emerald-700"
                                sparklineData={statCards.confirmed.sparklineData}
                                onClick={() => navigate('/shipments?status=CONFIRMED')}
                                clickable
                            />
                        </div>

                        <div className="md:col-span-2 xl:col-span-12 min-h-65 sm:min-h-75 min-w-0">
                            <BarChartCard
                                title="Daily Requests"
                                data={dailyData}
                                xAxisKey="name"
                                yAxisKey="requests"
                                barColor="#1d4ed8"
                                onBarClick={(entry) => {
                                    const dateKey = String(entry.dateKey ?? "");
                                    if (!dateKey) return;
                                    navigate(`/shipments?status=All&day=${encodeURIComponent(dateKey)}`);
                                }}
                            />
                        </div>

                        <div className="md:col-span-2 xl:col-span-8 h-75 sm:h-87.5 min-w-0">
                            <WorldMapCard
                                countryData={mapCountryData}
                                onCountryClick={(country) => {
                                    navigate(
                                        `/shipments?status=All&countryCode=${encodeURIComponent(country.id)}&country=${encodeURIComponent(country.name)}`
                                    );
                                }}
                            />
                        </div>

                        <div className="md:col-span-2 xl:col-span-4 h-75 sm:h-87.5 min-w-0">
                            <TransportPieChart
                                data={transportData}
                                onSliceClick={(mode) => {
                                    navigate(`/shipments?status=All&mode=${encodeURIComponent(mode)}`);
                                }}
                            />
                        </div>

                        <div className="md:col-span-2 xl:col-span-12 min-w-0">
                            <RevenueAnalyticsCard analytics={revenueAnalytics} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard