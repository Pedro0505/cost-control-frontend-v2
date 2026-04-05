"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select";
import { Button } from "@/shadcn/ui/button";
import { Filter, XCircle } from "lucide-react";
import { InvoiceGraphParams } from "@/types/expense-graph";
import { allMonths } from "@/utils/date-utils";

interface Props {
    onFilter: (params: InvoiceGraphParams) => void;
    onClear: () => void;
    loading: boolean;
}

export function InvoiceFilter({ onFilter, onClear, loading }: Props) {
    const [startYear, setStartYear] = useState<string>("");
    const [startMonth, setStartMonth] = useState<string>("");
    const [endYear, setEndYear] = useState<string>("");
    const [endMonth, setEndMonth] = useState<string>("");

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 2020 + 1 }, (_, i) => (2020 + i).toString()).reverse();

    const handleApply = () => {
        onFilter({
            invoiceStartYear: startYear ? parseInt(startYear) : undefined,
            invoiceStartMonth: startMonth ? parseInt(startMonth) : undefined,
            invoiceEndYear: endYear ? parseInt(endYear) : undefined,
            invoiceEndMonth: endMonth ? parseInt(endMonth) : undefined,
        });
    };

    const handleClear = () => {
        setStartYear(""); setStartMonth(""); setEndYear(""); setEndMonth("");
        onClear();
    };

    return (
        <div className="flex flex-wrap items-center gap-4 bg-slate-50/80 p-4 rounded-xl border border-slate-100 mb-6">
            <div className="flex items-center gap-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Início:</span>
                <Select value={startYear} onValueChange={setStartYear}>
                    <SelectTrigger className="w-[110px] h-9 bg-white"><SelectValue placeholder="Ano" /></SelectTrigger>
                    <SelectContent>{years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={startMonth} onValueChange={setStartMonth}>
                    <SelectTrigger className="w-[130px] h-9 bg-white"><SelectValue placeholder="Mês" /></SelectTrigger>
                    <SelectContent>{allMonths.map(m => <SelectItem key={m.month_value} value={m.month_value}>{m.month_name}</SelectItem>)}</SelectContent>
                </Select>
            </div>

            <div className="flex items-center gap-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Fim:</span>
                <Select value={endYear} onValueChange={setEndYear}>
                    <SelectTrigger className="w-[110px] h-9 bg-white"><SelectValue placeholder="Ano" /></SelectTrigger>
                    <SelectContent>{years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={endMonth} onValueChange={setEndMonth}>
                    <SelectTrigger className="w-[130px] h-9 bg-white"><SelectValue placeholder="Mês" /></SelectTrigger>
                    <SelectContent>{allMonths.map(m => <SelectItem key={m.month_value} value={m.month_value}>{m.month_name}</SelectItem>)}</SelectContent>
                </Select>
            </div>

            <div className="flex items-center gap-2 ml-auto">
                <Button onClick={handleApply} disabled={loading} size="sm" className="h-9 gap-2 bg-indigo-600 hover:bg-indigo-700 px-4">
                    <Filter className="w-3.5 h-3.5" /> Aplicar Período
                </Button>
                <Button variant="ghost" onClick={handleClear} size="sm" className="h-9 gap-2 text-slate-500 hover:bg-slate-200/50">
                    <XCircle className="w-3.5 h-3.5" /> Limpar
                </Button>
            </div>
        </div>
    );
}
