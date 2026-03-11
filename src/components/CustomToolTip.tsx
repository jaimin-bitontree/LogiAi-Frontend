export default function CustomTooltip({ active, payload, label }: any) {
    if (active && payload && payload.length) {
        return (
            <div className="bg-indigo-100 border-indigo-200 text-white px-4 py-2.5 rounded-2xl shadow-lg shadow-indigo-100 flex flex-col gap-1">
                <p className="text-xs text-indigo-400 font-medium">{label}</p>
                <p className="text-lg font-bold text-indigo-600">
                    {payload[0].value.toLocaleString()}
                    <span className="text-xs font-normal text-indigo-400 ml-1">requests</span>
                </p>
            </div>
        );
    }
    return null;
}
