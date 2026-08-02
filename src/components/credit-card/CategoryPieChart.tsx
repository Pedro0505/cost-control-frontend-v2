"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Loader2, PieChart as PieChartIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { CategoryPercentage } from "@/types/credit-card-percentage";

interface Props {
    data: CategoryPercentage[];
    loading: boolean;
}

const COLORS = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
    "#6366F1",
    "#14B8A6",
    "#F97316",
    "#64748B"
];

interface CustomLabelProps {
    cx?: number;
    cy?: number;
    midAngle?: number;
    outerRadius?: number;
    percent?: number;
    name?: string;
}

const renderCustomLabel = ({ cx = 0, cy = 0, midAngle = 0, outerRadius = 0, percent = 0, name = "" }: CustomLabelProps) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 18;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    const displayName = name.length > 10 ? `${name.substring(0, 8)}...` : name;

    return (
        <text
            x={x}
            y={y}
            fill="#475569"
            textAnchor={x > cx ? "start" : "end"}
            dominantBaseline="central"
            className="text-[11px] font-medium"
        >
            {`${displayName}: ${(percent * 100).toFixed(1)}%`}
        </text>
    );
};

export function CategoryPieChart({ data, loading }: Props) {
    if (loading) {
        return (
            <Card className="bg-white shadow-sm border-slate-100 rounded-2xl h-full">
                <CardContent className="h-[380px] flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </CardContent>
            </Card>
        );
    }

    if (!data || data.length === 0) {
        return null;
    }

    return (
        <Card className="bg-white shadow-sm border-slate-100 rounded-2xl overflow-hidden flex flex-col h-full">
            <CardHeader className="border-b border-slate-50 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-800">
                    <PieChartIcon className="w-5 h-5 text-indigo-500" />
                    Distribuição por Categoria
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 flex-1 flex flex-col justify-center">
                <div className="w-full h-[380px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="percentage"
                                nameKey="normalizedDescription"
                                cx="50%"
                                cy="42%"
                                outerRadius="55%"
                                innerRadius="35%"
                                paddingAngle={3}
                                labelLine={true}
                                label={renderCustomLabel}
                            >
                                {data.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: number | string | undefined, name: string | undefined) => {
                                    const numVal = typeof value === "number" ? value : parseFloat(String(value ?? 0));
                                    return [`${numVal.toFixed(2)}%`, name ?? "Categoria"];
                                }}
                                contentStyle={{
                                    borderRadius: "12px",
                                    border: "none",
                                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)"
                                }}
                            />
                            <Legend
                                verticalAlign="bottom"
                                align="center"
                                layout="horizontal"
                                iconType="circle"
                                wrapperStyle={{
                                    paddingTop: "12px",
                                    maxHeight: "80px",
                                    overflowY: "auto",
                                    fontSize: "12px"
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
