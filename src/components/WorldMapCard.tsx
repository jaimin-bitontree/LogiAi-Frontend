import { useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Your data — map ISO numeric country codes to request counts
const countryData: Record<string, number> = {
    "356": 4800,  // India
    "840": 9200,  // USA
    "826": 3100,  // UK
    "276": 2700,  // Germany
    "392": 5400,  // Japan
    "076": 1900,  // Brazil
    "124": 2100,  // Canada
    "036": 1600,  // Australia
};

function getColor(count: number): string {
    if (!count) return "#e0e7ff";       // indigo-100 (no data)
    if (count < 2000) return "#a5b4fc"; // indigo-300
    if (count < 4000) return "#818cf8"; // indigo-400
    if (count < 6000) return "#6366f1"; // indigo-500
    return "#4338ca";                   // indigo-700 (highest)
}

interface TooltipData {
    name: string;
    count: number;
    x: number;
    y: number;
}

export default function WorldMapCard() {
const [zoom, setZoom] = useState(3);

    const [tooltip, setTooltip] = useState<TooltipData | null>(null);

    return (
        <div className="bg-white rounded-3xl shadow-sm p-6 flex flex-col h-full w-full relative">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-gray-500 font-medium text-sm">Requests by Country</h2>
                {/* Legend */}
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">Low</span>
                    <div className="flex gap-0.5">
                        {["#e0e7ff", "#a5b4fc", "#818cf8", "#6366f1", "#4338ca"].map(c => (
                            <div key={c} className="w-4 h-3 rounded-sm" style={{ backgroundColor: c }} />
                        ))}
                    </div>
                    <span className="text-xs text-gray-400">High</span>
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
                        minZoom={1}
                        maxZoom={6}
                        translateExtent={[[-100, -100], [900, 600]]}
                    >
                        <Geographies geography={geoUrl}>
                            {({ geographies }) =>
                                geographies.map((geo) => {
                                    const count = countryData[geo.id] ?? 0;
                                    return (
                                        <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            fill={getColor(count)}
                                            stroke="#fff"
                                            strokeWidth={0.5}
                                            style={{
                                                default: { outline: "none" },
                                                hover: { outline: "none", fill: "#4f46e5", cursor: "pointer" },
                                                pressed: { outline: "none" },
                                            }}
                                            onMouseEnter={(e) => {
                                                setTooltip({
                                                    name: geo.properties.name,
                                                    count,
                                                    x: e.clientX,
                                                    y: e.clientY,
                                                });
                                            }}
                                            onMouseMove={(e) => {
                                                setTooltip(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : null);
                                            }}
                                            onMouseLeave={() => setTooltip(null)}
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
                    className="fixed z-50 bg-indigo-50 border border-indigo-100 px-4 py-2.5 rounded-2xl shadow-lg shadow-indigo-100 pointer-events-none flex flex-col gap-1"
                    style={{ left: tooltip.x + 12, top: tooltip.y - 48 }}
                >
                    <p className="text-xs text-indigo-400 font-medium">{tooltip.name}</p>
                    <p className="text-lg font-bold text-indigo-600">
                        {tooltip.count > 0 ? tooltip.count.toLocaleString() : "No data"}
                        {tooltip.count > 0 && (
                            <span className="text-xs font-normal text-indigo-400 ml-1">requests</span>
                        )}
                    </p>
                </div>
            )}
            <div className="absolute bottom-6 right-6 flex flex-col gap-1">
                <button
                    onClick={() => setZoom(z => Math.min(z + 1, 6))}
                    className="w-8 h-8 bg-indigo-50 border border-indigo-100 text-indigo-500 rounded-xl font-bold text-lg flex items-center justify-center hover:bg-indigo-100 transition"
                >+</button>
                <button
                    onClick={() => setZoom(z => Math.max(z - 1, 1))}
                    className="w-8 h-8 bg-indigo-50 border border-indigo-100 text-indigo-500 rounded-xl font-bold text-lg flex items-center justify-center hover:bg-indigo-100 transition"
                >−</button>
            </div>
        </div>
    );
}