import { useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import type { MouseEvent as ReactMouseEvent } from "react";

// Minimal shape of a geo feature returned by react-simple-maps
interface GeoFeature {
  id: string;
  rsmKey: string;
  properties: { name: string };
}

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface WorldMapCardProps {
  countryData: Record<string, number>;
    onCountryClick?: (country: { id: string; name: string; count: number }) => void;
}

interface TooltipData {
  name: string;
  count: number;
  x: number;
  y: number;
}

function getColor(count: number, maxCount: number): string {
    if (!count) return "#cbd5e1"; // Slate 300 (increased opacity from e2e8f0)
    if (maxCount <= 1) return "#3b82f6";

    const ratio = count / maxCount;
    if (ratio < 0.25) return "#dbeafe";
    if (ratio < 0.5) return "#bfdbfe";
    if (ratio < 0.75) return "#60a5fa";
    return "#2563eb"; // Blue 600 (decreased from 1d4ed8 / Blue 700)
}

export default function WorldMapCard({ countryData, onCountryClick }: WorldMapCardProps) {
    const [zoom, setZoom] = useState(3);
    const maxCount = Math.max(0, ...Object.values(countryData));

    const [tooltip, setTooltip] = useState<TooltipData|null>(null);

    return (
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200/80 p-4 sm:p-6 flex flex-col h-full w-full relative min-w-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
                <h2 className="text-slate-600 font-semibold text-sm">Requests by Origin Country</h2>
                {/* Legend */}
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-slate-400">Low</span>
                    <div className="flex gap-0.5">
                        {["#cbd5e1", "#dbeafe", "#bfdbfe", "#60a5fa", "#2563eb"].map(c => (
                            <div key={c} className="w-3.5 sm:w-4 h-3 rounded-sm" style={{ backgroundColor: c }} />
                        ))}
                    </div>
                    <span className="text-xs text-slate-400">High</span>
                </div>
            </div>

            {/* Map */}
            <div className="flex-1 w-full min-h-0">
                <ComposableMap
                    projectionConfig={{ scale: 120 }}
                    style={{ width: "100%", height: "100%" }}
                >
                    <ZoomableGroup
                        zoom={zoom}
                        minZoom={3}
                        maxZoom={6}
                        translateExtent={[[-100, -100], [900, 600]]}
                    >
                        <Geographies geography={geoUrl}>
                            {({ geographies }: { geographies: GeoFeature[] }) =>
                                geographies.map((geo: GeoFeature) => {
                                    const count = countryData[geo.id] ?? 0;
                                    return (
                                        <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            fill={getColor(count, maxCount)}
                                            stroke="#fff"
                                            strokeWidth={0.5}
                                            style={{
                                                default: { outline: "none" },
                                                hover: {
                                                    outline: "none",
                                                    fill: count > 0 && onCountryClick ? "#1e3a8a" : getColor(count, maxCount),
                                                    cursor: count > 0 && onCountryClick ? "pointer" : "default",
                                                },
                                                pressed: { outline: "none" },
                                            }}
                                            onMouseEnter={(e: ReactMouseEvent) => {
                                                setTooltip({
                                                    name: geo.properties.name,
                                                    count,
                                                    x: e.clientX,
                                                    y: e.clientY,
                                                });
                                            }}
                                            onMouseMove={(e: ReactMouseEvent) => {
                                                setTooltip(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : null);
                                            }}
                                            onMouseLeave={() => setTooltip(null)}
                                            onClick={() => {
                                                if (!onCountryClick || count <= 0) return;
                                                onCountryClick({
                                                    id: geo.id,
                                                    name: geo.properties.name,
                                                    count,
                                                });
                                            }}
                                        />
                                    );
                                })
                            }
                        </Geographies>
                    </ZoomableGroup>
                </ComposableMap>
            </div>

            {/* Custom Tooltip */}
            {tooltip && (
                <div
                    className="fixed z-50 bg-white border border-slate-200 px-3 sm:px-4 py-2 rounded-2xl shadow-lg shadow-slate-200/70 pointer-events-none flex flex-col gap-1 max-w-45 sm:max-w-60"
                    style={{ left: tooltip.x + 12, top: tooltip.y - 48 }}
                >
                    <p className="text-xs text-slate-500 font-medium truncate">{tooltip.name}</p>
                    <p className="text-base sm:text-lg font-bold text-slate-800">
                        {tooltip.count > 0 ? tooltip.count.toLocaleString() : "No data"}
                        {tooltip.count > 0 && (
                            <span className="text-xs font-normal text-slate-500 ml-1">requests</span>
                        )}
                    </p>
                </div>
            )}
            <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 flex flex-col gap-1">
                <button
                    onClick={() => setZoom(z => Math.min(z + 1, 6))}
                    className="w-7 h-7 sm:w-8 sm:h-8 bg-white border border-slate-200 text-slate-700 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg flex items-center justify-center hover:bg-slate-100 transition"
                >+</button>
                <button
                    onClick={() => setZoom(z => Math.max(z - 1, 3))}
                    className="w-7 h-7 sm:w-8 sm:h-8 bg-white border border-slate-200 text-slate-700 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg flex items-center justify-center hover:bg-slate-100 transition"
                >−</button>
            </div>
        </div>
    );
}