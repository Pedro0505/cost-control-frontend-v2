"use client";

import { useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { Loader2, XCircle } from "lucide-react";
import { EvolutionChartPoint, CustomTooltipProps, LegendClickData } from "@/types/expense-graph";

interface Props {
    data: EvolutionChartPoint[];
    categories: string[];
    loading: boolean;
}

const CHART_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"];

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
        const sortedPayload = [...payload].sort((a, b) => Number(b.value) - Number(a.value));

        return (
            <div className="bg-white p-4 border border-slate-100 rounded-xl shadow-lg shadow-slate-200/50 min-w-[220px]">
                <p className="text-sm font-bold text-slate-800 mb-3 border-b border-slate-50 pb-2 capitalize">{label}</p>
                <div className="space-y-2">
                    {sortedPayload.map((entry, index) => (
                        <div key={index} className="flex items-center justify-between gap-4 text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                                <span className="font-medium text-slate-600 truncate max-w-[120px]">{entry.name}</span>
                            </div>
                            <span className="font-bold text-slate-900 tabular-nums">
                                {Number(entry.value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

export function EvolutionLineChart({ data, categories, loading }: Props) {
    const [activeCategories, setActiveCategories] = useState<string[]>([]);

    const handleLegendClick = (entry: LegendClickData) => {
        const { value } = entry;
        setActiveCategories((prev) =>
            prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
        );
    };

    if (loading) {
        return (
            <div className="h-[400px] w-full flex items-center justify-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="relative w-full h-[400px] bg-white p-2 sm:p-4 rounded-2xl border border-slate-100 shadow-sm">
            {activeCategories.length > 0 && (
                <button
                    onClick={() => setActiveCategories([])}
                    className="absolute top-4 right-4 z-10 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-indigo-600 transition-colors"
                >
                    <XCircle className="w-3.5 h-3.5" />
                    Resetar Filtros
                </button>
            )}

            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                        dataKey="dateLabel"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748b", fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748b", fontSize: 12 }}
                        tickFormatter={(value: number) =>
                            value.toLocaleString("pt-BR", { notation: "compact", style: "currency", currency: "BRL", maximumFractionDigits: 0 })
                        }
                        width={80}
                    />
                    <Tooltip content={(p) => <CustomTooltip {...p} />} cursor={{ stroke: "#94a3b8", strokeWidth: 1, strokeDasharray: "4 4" }} />
                    <Legend
                        verticalAlign="top"
                        height={36}
                        iconType="circle"
                        onClick={(e) => handleLegendClick(e as LegendClickData)}
                        wrapperStyle={{ paddingTop: "0px", paddingBottom: "20px", cursor: "pointer", userSelect: "none" }}
                    />
                    {categories.map((category, index) => {
                        const isFiltered = activeCategories.length > 0;
                        const isSelected = activeCategories.includes(category);
                        const opacity = !isFiltered || isSelected ? 1 : 0.1;

                        return (
                            <Line
                                key={category}
                                type="monotone"
                                dataKey={category}
                                name={category}
                                stroke={CHART_COLORS[index % CHART_COLORS.length]}
                                strokeWidth={isSelected ? 4 : 2}
                                strokeOpacity={opacity}
                                dot={isSelected || !isFiltered ? { r: 3, fill: "#fff", strokeWidth: 2, stroke: CHART_COLORS[index % CHART_COLORS.length] } : false}
                                activeDot={isSelected || !isFiltered ? { r: 5, strokeWidth: 0, fill: CHART_COLORS[index % CHART_COLORS.length] } : false}
                                connectNulls
                                animationDuration={400}
                            />
                        );
                    })}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
