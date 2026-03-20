import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface TransportPieChartProps {
  data: { name: string; value: number }[];
  onSliceClick?: (mode: string) => void;
}

const COLORS = ["#1d4ed8", "#3b82f6", "#64748b", "#0f172a", "#94a3b8"];

interface TooltipProps {
  active?: boolean;
  payload?: { name: string; value: number }[];
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 px-3 sm:px-4 py-2 rounded-2xl shadow-lg shadow-slate-200/70 flex flex-col gap-1">
        <p className="text-xs text-slate-500 font-medium truncate">{payload[0].name}</p>
        <p className="text-base sm:text-lg font-bold text-slate-800">
          {payload[0].value.toLocaleString()}
          <span className="text-xs font-normal text-slate-500 ml-1">requests</span>
        </p>
      </div>
    );
  }
  return null;
}

export default function TransportPieChart({ data, onSliceClick }: TransportPieChartProps) {
  const chartData = data.filter((entry) => entry.value > 0);
  const safeData = chartData.length > 0 ? chartData : data;

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200/80 p-4 sm:p-6 flex flex-col h-full w-full min-w-0">
      <h2 className="text-slate-600 font-semibold text-sm mb-3 sm:mb-4">Transport Mode</h2>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={safeData}
              cx="50%"
              cy="50%"
              innerRadius="45%"
              outerRadius="72%"
              paddingAngle={4}
              dataKey="value"
              onClick={(sliceData) => {
                const mode = (sliceData as { name?: string })?.name;
                if (mode && onSliceClick) {
                  onSliceClick(mode);
                }
              }}
              cursor={onSliceClick ? "pointer" : "default"}
            >
              {safeData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              iconSize={8}
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ paddingTop: 8 }}
              formatter={(value) => (
                <span className="text-[11px] sm:text-xs text-gray-500">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}