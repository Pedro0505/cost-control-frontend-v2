"use client";

import { useState } from "react";
import { InvoiceUploadCard } from "@/components/credit-card/InvoiceUploadCard";
import { ExpenseTable } from "@/components/credit-card/ExpenseTable";
import { EvolutionLineChart } from "@/components/credit-card/EvolutionLineChart";

import { useCreditCardExpenses, useAvailableMonths } from "@/hooks/use-credit-card";
import { useReprocessDescriptions } from "@/hooks/use-reprocess-descriptions";
import { useEvolutionGraph } from "@/hooks/use-evolution-graph";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select";
import { Button } from "@/shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { FileText, Loader2, Filter, RefreshCw, TrendingUp } from "lucide-react";

export default function CreditCardPage() {
    const { availableData, refreshAvailable } = useAvailableMonths();
    const { expenses, fetchExpenses, loading } = useCreditCardExpenses();

    const { data: evolutionData, categories: evolutionCategories, loading: loadingEvolution, refetch: refetchEvolution } = useEvolutionGraph();

    const [filterYear, setFilterYear] = useState<string>("");
    const [filterMonth, setFilterMonth] = useState<string>("");
    const [hasFiltered, setHasFiltered] = useState(false);

    const handleFilter = async () => {
        if (filterYear && filterMonth) {
            const year = parseInt(filterYear);
            const month = parseInt(filterMonth);

            await fetchExpenses(year, month);
            setHasFiltered(true);
        }
    };

    const { reprocess, isReprocessing } = useReprocessDescriptions(() => {
        if (hasFiltered) handleFilter();
        refetchEvolution();
    });

    const currentYearMonths = availableData.find(d => d.availableYear.toString() === filterYear)?.availableMonth || [];

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 md:p-12">
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
            `}</style>

            <div className="max-w-5xl mx-auto space-y-10">
                <Card className="bg-white shadow-sm border-slate-100 rounded-2xl overflow-hidden">
                    <CardHeader className="border-b border-slate-50 pb-4">
                        <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-800">
                            <TrendingUp className="w-5 h-5 text-emerald-500" />
                            Evolução de Gastos (Últimos 12 Meses)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <EvolutionLineChart
                            data={evolutionData}
                            categories={evolutionCategories}
                            loading={loadingEvolution}
                        />
                    </CardContent>
                </Card>

                <InvoiceUploadCard onSuccess={() => { refreshAvailable(); if (hasFiltered) handleFilter(); refetchEvolution(); }} />

                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <Filter className="w-5 h-5 text-indigo-500" /> Gastos Detalhados
                        </h2>

                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                onClick={reprocess}
                                disabled={isReprocessing || loading}
                                className="h-10 border-slate-200 text-slate-600 gap-2 px-4 shadow-sm"
                            >
                                <RefreshCw className={`w-4 h-4 ${isReprocessing ? 'animate-spin' : ''}`} />
                                {isReprocessing ? "Processando..." : "Reprocessar"}
                            </Button>

                            <div className="h-6 w-[1px] bg-slate-200 mx-1" />

                            <Select value={filterYear} onValueChange={setFilterYear} disabled={loading || isReprocessing}>
                                <SelectTrigger className="w-28 h-10 bg-white"><SelectValue placeholder="Ano" /></SelectTrigger>
                                <SelectContent>{availableData.map(d => <SelectItem key={d.availableYear} value={d.availableYear.toString()}>{d.availableYear}</SelectItem>)}</SelectContent>
                            </Select>

                            <Select value={filterMonth} onValueChange={setFilterMonth} disabled={loading || isReprocessing || !filterYear}>
                                <SelectTrigger className="w-36 h-10 bg-white"><SelectValue placeholder="Mês" /></SelectTrigger>
                                <SelectContent>{currentYearMonths.map(m => <SelectItem key={m.value} value={m.value.toString()}>{m.name}</SelectItem>)}</SelectContent>
                            </Select>

                            <Button onClick={handleFilter} disabled={loading || isReprocessing || !filterYear || !filterMonth} className="bg-slate-800 hover:bg-slate-900 h-10 px-6 rounded-lg">
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Filtrar"}
                            </Button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="py-20 flex flex-col items-center gap-4 bg-white/50 rounded-3xl border border-dashed border-slate-200">
                            <Loader2 className="w-10 h-10 text-slate-400 animate-spin" />
                            <p className="text-slate-400 font-medium text-center">Carregando dados...</p>
                        </div>
                    ) : hasFiltered && expenses.length > 0 ? (
                        <ExpenseTable expenses={expenses} />
                    ) : (
                        <div className="py-20 flex flex-col items-center gap-4 bg-white/50 rounded-3xl border border-dashed border-slate-200">
                            <FileText className="w-12 h-12 text-slate-200" />
                            <p className="text-slate-400 font-medium text-center">
                                {hasFiltered ? "Nenhum dado encontrado para o período." : "Selecione o período para visualizar os gastos."}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}