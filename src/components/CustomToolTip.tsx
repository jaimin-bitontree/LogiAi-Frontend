// import type { TooltipProps } from 'recharts';
// import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

export default function CustomTooltip({ active, payload, label }: any) {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-slate-200 px-4 py-2.5 rounded-2xl shadow-lg shadow-slate-200/70 flex flex-col gap-1">
                <p className="text-xs text-slate-500 font-medium">{label}</p>
                <p className="text-lg font-bold text-slate-800">
                    {payload[0].value?.toLocaleString()}
                    <span className="text-xs font-normal text-slate-500 ml-1">requests</span>
                </p>
            </div>
        );
    }
    return null;
}
