"use client";

import { PieChart, Pie, ResponsiveContainer, Tooltip } from "recharts";
import { NameType, ValueType, Formatter } from "recharts/types/component/DefaultTooltipContent";
import { ChartData } from "@/types/expense-graph";
import { Loader2 } from "lucide-react";

interface Props {
    chartData: ChartData;
    loading: boolean;
}

interface PieDataItem {
    name: string;
    value: number;
    fill: string;
}

export const CATEGORY_COLORS = [
    "#6366f1", "#10b981", "#f59e0b", "#ef4444",
    "#8b5cf6", "#ec4899", "#06b6d4", "#f43f5e"
];

export function ExpenseTypeChart({ chartData, loading }: Props) {
    if (loading) {
        return (
            <div className="h-[280px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    const formattedData: PieDataItem[] = chartData.labels.map((label, index) => ({
        name: label,
        value: chartData.values[index],
        fill: CATEGORY_COLORS[index % CATEGORY_COLORS.length]
    }));

    const currencyFormatter: Formatter<ValueType, NameType> = (value) => {
        const numericValue = typeof value === "string" ? parseFloat(value) : (value as number);
        return [
            numericValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
        ];
    };

    return (
        <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={formattedData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="value"
                        nameKey="name"
                        stroke="none"
                    />
                    <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        formatter={currencyFormatter}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
