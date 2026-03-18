import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface TransportPieChartProps {
  data: { name: string; value: number }[];
}

const COLORS = ["#0f766e", "#14b8a6", "#0ea5e9", "#64748b", "#f59e0b"];

interface TooltipProps {
  active?: boolean;
  payload?: { name: string; value: number }[];
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-teal-50 border border-teal-100 px-4 py-2.5 rounded-2xl shadow-lg shadow-teal-100 flex flex-col gap-1">
        <p className="text-xs text-teal-600 font-medium">{payload[0].name}</p>
        <p className="text-lg font-bold text-teal-700">
          {payload[0].value.toLocaleString()}
          <span className="text-xs font-normal text-teal-600 ml-1">requests</span>
        </p>
      </div>
    );
  }
  return null;
}

export default function TransportPieChart({ data }: TransportPieChartProps) {
  const chartData = data.filter((entry) => entry.value > 0);
  const safeData = chartData.length > 0 ? chartData : data;

  return (
    <div className="bg-white rounded-3xl shadow-sm p-6 flex flex-col h-full w-full">
      <h2 className="text-gray-500 font-medium text-sm mb-4">Transport Mode</h2>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={safeData}
              cx="50%"
              cy="50%"
              innerRadius="50%"
              outerRadius="75%"
              paddingAngle={4}
              dataKey="value"
            >
              {safeData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
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