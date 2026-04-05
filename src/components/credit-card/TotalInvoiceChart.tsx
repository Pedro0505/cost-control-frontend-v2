"use client";

import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Loader2, SearchX } from "lucide-react";
import { InvoiceChartPoint } from "@/types/expense-graph";

interface Props {
    data: InvoiceChartPoint[];
    loading: boolean;
}

export function TotalInvoiceChart({ data, loading }: Props) {
    if (loading) {
        return (
            <div className="h-[300px] w-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="h-[300px] w-full flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50 transition-all">
                <div className="bg-white p-4 rounded-full shadow-sm mb-3">
                    <SearchX className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-500 font-semibold text-sm">Nenhum dado encontrado</p>
                <p className="text-slate-400 text-xs mt-1">
                    Não há registros de faturas para o período selecionado.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                        dataKey="originalDate"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#94a3b8", fontSize: 12 }}
                        tickFormatter={(value: string) => {
                            if (!value) return "";
                            const [year, month] = value.split("-");
                            return `${month}/${year.substring(2)}`;
                        }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#94a3b8", fontSize: 12 }}
                        tickFormatter={(val: number) =>
                            `R$ ${val.toLocaleString("pt-BR", { notation: "compact" })}`
                        }
                    />
                    <Tooltip
                        labelFormatter={(label: React.ReactNode) => {
                            const dateStr = String(label);
                            if (!dateStr.includes("-")) return dateStr;

                            const [year, month] = dateStr.split("-");
                            return `${month}/${year}`;
                        }}
                        formatter={(value: number | string | undefined) => {
                            if (value === undefined) return ["R$ 0,00", "Total Fatura"];

                            const numericValue = typeof value === "string" ? parseFloat(value) : value;
                            const formatted = (numericValue || 0).toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL"
                            });

                            return [formatted, "Total Fatura"] as [string, string];
                        }}
                        contentStyle={{
                            borderRadius: "12px",
                            border: "none",
                            boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)"
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="total"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorTotal)"
                        animationDuration={1200}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
