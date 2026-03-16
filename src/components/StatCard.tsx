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
    }, [target]);
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
}: StatCardProps) {
    const animatedValue = useCountUp(value);

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between min-h-[160px]">
            {/* Top Row */}
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-gray-500 font-medium text-sm mb-2">{title}</h3>
                    <p className="text-3xl font-bold text-gray-800">
                        {animatedValue.toLocaleString()}
                    </p>
                </div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconBgColor}`}>
                    <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>
            </div>

            {/* Sparkline */}
            <div className="w-full h-10 my-2">
                <Sparklines data={sparklineData} height={40}>
                    <SparklinesLine
                        color={isPositiveTrend ? "#0f766e" : "#dc2626"}
                        style={{ fill: "none", strokeWidth: 2 }}
                    />
                    <SparklinesSpots
                        size={2}
                        style={{ fill: isPositiveTrend ? "#0f766e" : "#dc2626" }}
                    />
                </Sparklines>
            </div>

            {/* Bottom Row */}
            <div className="flex items-center gap-2 text-sm font-medium">
                <span className={`px-2 py-0.5 rounded-md text-xs font-bold flex items-center gap-1 ${
                    isPositiveTrend ? "bg-teal-100 text-teal-700" : "bg-red-100 text-red-600"
                }`}>
                    {trendPercentage}
                    {isPositiveTrend
                        ? <TrendingUp className="w-3 h-3" />
                        : <TrendingDown className="w-3 h-3" />
                    }
                </span>
                <span className="text-gray-400 text-xs">{trendLabel}</span>
            </div>
        </div>
    );
}