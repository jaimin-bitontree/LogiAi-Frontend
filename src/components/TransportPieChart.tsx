import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
    { name: "Sea",  value: 400 },
    { name: "Air",  value: 300 },
    { name: "Road", value: 200 },
    { name: "Rail", value: 100 },
];

const COLORS = ["#6366f1", "#818cf8", "#a5b4fc", "#c7d2fe"];

function CustomTooltip({ active, payload }: any) {
    if (active && payload && payload.length) {
        return (
            <div className="bg-indigo-50 border border-indigo-100 px-4 py-2.5 rounded-2xl shadow-lg shadow-indigo-100 flex flex-col gap-1">
                <p className="text-xs text-indigo-400 font-medium">{payload[0].name}</p>
                <p className="text-lg font-bold text-indigo-600">
                    {payload[0].value.toLocaleString()}
                    <span className="text-xs font-normal text-indigo-400 ml-1">requests</span>
                </p>
            </div>
        );
    }
    return null;
}

export default function TransportPieChart() {
    return (
        <div className="bg-white rounded-3xl shadow-sm p-6 flex flex-col h-full w-full">
            <h2 className="text-gray-500 font-medium text-sm mb-4">Transport Mode</h2>
            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius="50%"   
                            outerRadius="75%"   
                            paddingAngle={4}
                            dataKey="value"
                        >
                            {data.map((_, index) => (
                                <Cell key={index} fill={COLORS[index]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            iconType="circle"
                            iconSize={8}
                            formatter={(value) => (
                                <span className="text-xs text-gray-500">{value}</span>
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}