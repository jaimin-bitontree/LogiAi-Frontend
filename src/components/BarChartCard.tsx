import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from 'recharts';
import CustomToolTip from './CustomToolTip';
interface DataItem {
    [key: string]: string | number;
}

interface BarChartCardProps {
    title: string;
    data: DataItem[];
    xAxisKey: string;
    yAxisKey: string;
    barColor?: string;
}

export default function BarChartCard({
    title,
    data,
    xAxisKey,
    yAxisKey,
    barColor = "#6366f1"
}: BarChartCardProps) {
    return (
        <div className="bg-white rounded-3xl shadow-sm p-6 flex flex-col h-full w-full">
            <h2 className="text-gray-500 font-medium text-sm mb-6">{title}</h2>
            <div className="flex-1 w-full min-h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis
                            dataKey={xAxisKey}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9ca3af', fontSize: 13 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9ca3af', fontSize: 13 }}
                        />
                        {/* <Tooltip
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{
                                borderRadius: '12px',
                                border: 'none',
                                boxShadow: '0 4px 12px -2px rgba(0, 0, 0, 0.1)',
                                fontWeight: 600
                            }}
                        /> */}
                        <Tooltip
                            cursor={{ fill: 'rgba(15, 118, 110, 0.10)' }}
                            content={<CustomToolTip />}
                        />
                        <Bar
                            dataKey={yAxisKey}
                            fill={barColor}
                            radius={[6, 6, 0, 0]}
                            barSize={32}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
