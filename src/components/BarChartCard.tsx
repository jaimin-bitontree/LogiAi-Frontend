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
interface BarChartCardProps<T extends object> {
    title: string;
    data: T[];
    xAxisKey: string;
    yAxisKey: string;
    barColor?: string;
    onBarClick?: (entry: T) => void;
}

export default function BarChartCard<T extends object>({
    title,
    data,
    xAxisKey,
    yAxisKey,
    barColor = "#6366f1",
    onBarClick,
}: BarChartCardProps<T>) {
    return (
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200/80 p-4 sm:p-6 flex flex-col h-full w-full min-w-0">
            <h2 className="text-slate-600 font-semibold text-sm mb-4 sm:mb-6">{title}</h2>
            <div className="flex-1 w-full min-h-50 sm:min-h-55">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 4, right: 4, left: -28, bottom: 0 }}
                        onClick={(state) => {
                            const payload = state?.activePayload?.[0]?.payload as T | undefined;
                            if (payload && onBarClick) {
                                onBarClick(payload);
                            }
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis
                            dataKey={xAxisKey}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9ca3af', fontSize: 11 }}
                            dy={8}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            width={26}
                            tick={{ fill: '#9ca3af', fontSize: 11 }}
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
                            cursor={{ fill: 'rgba(29, 78, 216, 0.10)' }}
                            content={<CustomToolTip />}
                        />
                        <Bar
                            dataKey={yAxisKey}
                            fill={barColor}
                            radius={[6, 6, 0, 0]}
                            barSize={22}
                            minPointSize={onBarClick ? 4 : 0}
                            cursor={onBarClick ? "pointer" : "default"}
                            onClick={(barData) => {
                                const payload = (barData as { payload?: T })?.payload;
                                if (payload && onBarClick) {
                                    onBarClick(payload);
                                }
                            }}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
