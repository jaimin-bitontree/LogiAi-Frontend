import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Sparklines, SparklinesLine, SparklinesSpots } from "react-sparklines";

interface StatCardProps {
    title: string;
    value: number;              // ← changed from string to number for animation
    trendPercentage: string;
    trendLabel: string;
    isPositiveTrend: boolean;
    icon: LucideIcon;
    iconBgColor: string;
    iconColor: string;
    sparklineData: number[];    // ← new prop
    onClick?: () => void;
    clickable?: boolean;
}

// Animated counter hook
function useCountUp(target: number, duration: number = 1500) {
    
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [target, duration]);
    return count;
}

export default function StatCard({
    title,
    value,
    trendPercentage,
    trendLabel,
    isPositiveTrend,
    icon: Icon,
    iconBgColor,
    iconColor,
    sparklineData,
    onClick,
    clickable,
}: StatCardProps) {
    const animatedValue = useCountUp(value);
    const isClickable = clickable ?? Boolean(onClick);

    return (
        <div
            className={`bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 shadow-sm border border-slate-200/80 flex flex-col min-h-45 sm:min-h-50 ${
                isClickable
                    ? "cursor-pointer hover:shadow-md hover:border-slate-300 transition"
                    : ""
            }`}
            onClick={onClick}
            role={isClickable ? "button" : undefined}
            tabIndex={isClickable ? 0 : undefined}
            onKeyDown={(e) => {
                if (!isClickable || !onClick) return;
                if (e.key === "Enter") onClick();
                if (e.key === " ") {
                    e.preventDefault();
                    onClick();
                }
            }}
        >
            {/* Top Row */}
            <div className="flex justify-between items-start gap-3 min-w-0">
                <div className="min-w-0">
                    <h3 className="text-slate-500 font-semibold text-xs sm:text-sm mb-1.5 sm:mb-2 truncate">{title}</h3>
                    <p className="text-2xl sm:text-3xl lg:text-4xl leading-none font-bold text-slate-900 tracking-tight truncate">
                        {animatedValue.toLocaleString()}
                    </p>
                </div>
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center border border-white/50 ${iconBgColor}`}>
                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${iconColor}`} />
                </div>
            </div>

            {/* Sparkline */}
            <div className="w-full h-10 sm:h-12 mt-3 sm:mt-4 mb-2 sm:mb-3 pb-1 sm:pb-2">
                <Sparklines data={sparklineData} height={40} margin={4}>
                    <SparklinesLine
                        color={isPositiveTrend ? "#1d4ed8" : "#dc2626"}
                        style={{ fill: "none", strokeWidth: 2 }}
                    />
                    <SparklinesSpots
                        size={2}
                        style={{ fill: isPositiveTrend ? "#1d4ed8" : "#dc2626" }}
                    />
                </Sparklines>
            </div>

            {/* Bottom Row */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-sm font-medium mt-auto pt-1">
                <span className={`px-2 sm:px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-bold flex items-center gap-1 ${
                    isPositiveTrend ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-600"
                }`}>
                    {trendPercentage}
                    {isPositiveTrend
                        ? <TrendingUp className="w-3 h-3" />
                        : <TrendingDown className="w-3 h-3" />
                    }
                </span>
                <span className="text-slate-400 text-[11px] sm:text-xs font-semibold">{trendLabel}</span>
            </div>
        </div>
    );
}