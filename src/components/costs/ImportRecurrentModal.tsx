import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shadcn/ui/dialog";
import { Button } from "@/shadcn/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table";
import { RefreshCw, Search, ArrowRight } from "lucide-react";
import { getAvailableFinancialPeriods } from "@/services/monthly-balance";
import {  getPreviewRecurrentCostsForImport } from "@/services/cost";
import { AvailableYear } from "@/types/availability";
import { PreviewImportCosts } from "@/types/cost";
import { useImportCosts } from "@/hooks/use-import-costs";

interface SelectedPeriod {
    year: number;
    month: number;
}

export function ImportRecurrentModal({ onImportSuccess }: { onImportSuccess: () => void }) {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState<AvailableYear[]>([]);
    const [source, setSource] = useState<SelectedPeriod>({ year: 0, month: 0 });
    const [target, setTarget] = useState<SelectedPeriod>({ year: 0, month: 0 });
    const [previewCosts, setPreviewCosts] = useState<PreviewImportCosts[]>([]);
    const [searching, setSearching] = useState(false);
    const { execute, loading: importing } = useImportCosts();

    useEffect(() => {
        if (open) {
            getAvailableFinancialPeriods().then(setData);
        }
    }, [open]);

    const handleSearchSource = async () => {
        setSearching(true);
        try {
            const response = await getPreviewRecurrentCostsForImport({
                sourceReferenceYear: source.year,
                sourceReferenceMonth: source.month,
                targetReferenceYear: target.year,
                targetReferenceMonth: target.month
            });
            setPreviewCosts(response);
        } finally {
            setSearching(false);
        }
    };

    const handleImport = async () => {
        await execute({
            sourceReferenceYear: source.year,
            sourceReferenceMonth: source.month,
            targetReferenceYear: target.year,
            targetReferenceMonth: target.month
        });
        setOpen(false);
        onImportSuccess();
    };

    const isSameDate = source.year === target.year && source.month === target.month && source.year !== 0;
    const canSearch = source.year > 0 && source.month > 0 && target.year > 0 && target.month > 0 && !isSameDate;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 border-primary text-primary hover:bg-primary/5">
                    <RefreshCw className="w-4 h-4" /> Transferir Recorrentes
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Transferir Custos Recorrentes</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-11 gap-4 items-center py-6">
                    <div className="col-span-5 space-y-4 p-4 bg-gray-50 rounded-lg">
                        <p className="text-xs font-bold uppercase text-gray-500">Origem (Fonte)</p>
                        <PeriodSelector data={data} value={source} onChange={setSource} />
                    </div>

                    <div className="col-span-1 flex justify-center">
                        <ArrowRight className="text-gray-300" />
                    </div>

                    <div className="col-span-5 space-y-4 p-4 bg-gray-50 rounded-lg">
                        <p className="text-xs font-bold uppercase text-gray-500">Destino (Alvo)</p>
                        <PeriodSelector data={data} value={target} onChange={setTarget} />
                    </div>
                </div>

                {isSameDate && <p className="text-xs text-red-500 text-center -mt-4 mb-4">A origem e o destino não podem ser iguais.</p>}

                <div className="flex justify-center mb-6">
                    <Button onClick={handleSearchSource} disabled={!canSearch || searching} variant="secondary" className="gap-2">
                        {searching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                        Buscar Custos Recorrentes
                    </Button>
                </div>

                {previewCosts.length > 0 && (
                    <div className="space-y-4">
                        <div className="max-h-60 overflow-y-auto border rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Descrição</TableHead>
                                        <TableHead className="text-right">Valor</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {previewCosts.map(cost => (
                                        <TableRow key={cost.id}>
                                            <TableCell className="py-2">{cost.description}</TableCell>
                                            <TableCell className="py-2 text-right font-medium">
                                                R$ {cost.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="flex justify-end">
                            <Button onClick={handleImport} disabled={importing} className="px-10">
                                {importing ? "Importando..." : "Confirmar Importação"}
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

interface PeriodSelectorProps {
    data: AvailableYear[];
    value: SelectedPeriod;
    onChange: (period: SelectedPeriod) => void;
}

function PeriodSelector({ data, value, onChange }: PeriodSelectorProps) {
    const months = data.find(y => y.availableYear === value.year)?.availableMonth ?? [];
    return (
        <div className="grid grid-cols-2 gap-2">
            <Select
                value={value.year > 0 ? value.year.toString() : ""}
                onValueChange={v => onChange({ year: Number(v), month: 0 })}
            >
                <SelectTrigger><SelectValue placeholder="Ano" /></SelectTrigger>
                <SelectContent>
                    {data.map(y => (
                        <SelectItem key={y.availableYear} value={y.availableYear.toString()}>
                            {y.availableYear}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select
                value={value.month > 0 ? value.month.toString() : ""}
                onValueChange={v => onChange({ ...value, month: Number(v) })}
                disabled={value.year === 0}
            >
                <SelectTrigger><SelectValue placeholder="Mês" /></SelectTrigger>
                <SelectContent>
                    {months.map(m => (
                        <SelectItem key={m.value} value={m.value.toString()}>
                            {m.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}