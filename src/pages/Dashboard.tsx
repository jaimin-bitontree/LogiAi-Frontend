import Header from '../components/Header'
import StatCard from '../components/StatCard'
import { Package, XCircle, CheckCircle } from 'lucide-react'
import BarChartCard from '../components/BarChartCard'
import WorldMapCard from '../components/WorldMapCard'
import TransportPieChart from '../components/TransportPieChart'
import Sidebar from '../components/Sidebar'
function Dashboard() {
    // Mock data for requests per day
    const dailyData = [
        { name: 'Mon', requests: 420 },
        { name: 'Tue', requests: 380 },
        { name: 'Wed', requests: 550 },
        { name: 'Thu', requests: 480 },
        { name: 'Fri', requests: 620 },
        { name: 'Sat', requests: 250 },
        { name: 'Sun', requests: 210 },
    ];

    return (
        <div className='w-full h-screen flex bg-[#f0f2f5] p-2 gap-4 overflow-hidden'>

            {/* Sidebar (left side) */}
            {/* <div className='sidebar bg-[#1e1b4b] text-white w-[260px] p-6 rounded-[2rem] shadow-lg flex flex-col'>
                <div className="flex items-center gap-2 mb-10">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/30"></div>
                    <span className="text-xl font-bold">Logi AI</span>
                </div>
                this is sidebar section
            </div> */}
            <Sidebar/>

            {/* Main Content Column (Right side) */}
            <div className='flex flex-col flex-1 gap-4 pr-2  overflow-hidden'>

                {/* Header inside right column */}
                <Header />

                {/* Info / Content Area */}
                <div className='info bg-transparent flex-1 overflow-y-auto rounded-3xl pb-4 p-2 pr-2'>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                            <StatCard
                                title="Total Requests"
                                value={3024}
                                trendPercentage="10%"
                                trendLabel="From Last Month"
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
                                value={428}
                                trendPercentage="5%"
                                trendLabel="From Last Month"
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
                                value={2596}
                                trendPercentage="12%"
                                trendLabel="From Last Month"
                                isPositiveTrend={true}
                                icon={CheckCircle}
                                iconBgColor="bg-green-50"
                                iconColor="text-green-500"
                                sparklineData={[20, 35, 25, 50, 35, 60, 45, 70, 55, 85]}
                            />
                        </div>

                        {/* <div className="col-span-1 min-h-[150px] bg-white rounded-3xl shadow-sm p-4">Cancelled request</div>
                        <div className="col-span-1 min-h-[150px] bg-white rounded-3xl shadow-sm p-4">Confirmed request</div> */}
                        <div className="col-span-3 min-h-[300px]">
                            <BarChartCard
                                title="Daily Requests"
                                data={dailyData}
                                xAxisKey="name"
                                yAxisKey="requests"
                                barColor="#6366f1"
                            />
                        </div>
                        {/* Map */}
                        <div className="col-span-2 h-[350px]">
                            <WorldMapCard />
                        </div>
                        {/* <div className="col-span-1 h-[350px] bg-indigo-950 rounded-3xl shadow-sm p-4 text-white">pie chart of transport mode</div> */}
                        <div className="col-span-1 h-[350px]">
                            <TransportPieChart />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Dashboard
