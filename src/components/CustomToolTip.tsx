export default function CustomTooltip({ active, payload, label }: any) {

    if (active && payload && payload.length) {
        return (
            <div className="bg-teal-50 border border-teal-100 px-4 py-2.5 rounded-2xl shadow-lg shadow-teal-100 flex flex-col gap-1">
                <p className="text-xs text-teal-600 font-medium">{label}</p>
                <p className="text-lg font-bold text-teal-700">
                    {payload[0].value.toLocaleString()}
                    <span className="text-xs font-normal text-teal-600 ml-1">requests</span>
                </p>
            </div>
        );
    }
    return null;
}
