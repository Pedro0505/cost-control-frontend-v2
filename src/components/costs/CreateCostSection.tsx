import { useState } from "react";
import { useCreateCost } from "@/hooks/use-create-cost";
import { MoneySummary } from "@/types/money-summary";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";
import { Checkbox } from "@/shadcn/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select";
import { ImportRecurrentModal } from "./ImportRecurrentModal";

type Props = {
    year: number;
    month: number;
    onSummaryUpdate: (summary: MoneySummary) => void;
};

export function CreateCostSection({ year, month, onSummaryUpdate }: Props) {
    const { execute, loading } = useCreateCost();

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 11 }, (_, i) => currentYear - 1 + i);
    const months = Array.from({ length: 12 }, (_, i) => ({
        value: i + 1,
        label: new Date(0, i).toLocaleString("pt-BR", { month: "long" }),
    }));

    const [form, setForm] = useState({
        referenceMonth: month,
        referenceYear: year,
        description: "",
        amount: "" as string | number,
        recurrent: false,
        paid: false,
        calculationType: "FIXED" as "FIXED" | "PERCENTAGE",
        percentage: "" as string | number,
    });

    const isPercentage = form.calculationType === "PERCENTAGE";

    const handleValueChange = (val: string) => {
        const cleanVal = val.replace(/[^0-9.,]/g, '');
        if (isPercentage) {
            setForm({ ...form, percentage: cleanVal, amount: "" });
        } else {
            setForm({ ...form, amount: cleanVal, percentage: "" });
        }
    };

    async function handleSubmit() {
        const response = await execute({
            referenceMonth: form.referenceMonth,
            referenceYear: form.referenceYear,
            description: form.description,
            recurrent: form.recurrent,
            paid: form.paid,
            calculationType: form.calculationType,
            percentage: isPercentage ? Number(form.percentage.toString().replace(',', '.')) : 0,
            amount: !isPercentage ? Number(form.amount.toString().replace(',', '.')) : 0,
        });

        if (form.referenceMonth === month && form.referenceYear === year) {
            onSummaryUpdate(response.moneySummary);
        }

        setForm((prev) => ({
            ...prev,
            description: "",
            amount: "",
            percentage: "",
            recurrent: false,
            paid: false,
        }));
    }

    return (
        <section className="w-full bg-[#F1F2F9]">
            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="bg-white rounded-xl shadow-sm border px-8 py-10">

                    <div className="relative flex items-center justify-center mb-10">
                        <h2 className="text-xl font-bold text-gray-700">
                            Adicionar Novo Gasto
                        </h2>
                        <div className="absolute right-0">
                            <ImportRecurrentModal onImportSuccess={() => window.location.reload()} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                        <div className="md:col-span-2 space-y-2">
                            <Label>Mês</Label>
                            <Select
                                value={form.referenceMonth.toString()}
                                onValueChange={(v) => setForm({ ...form, referenceMonth: Number(v) })}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {months.map((m) => (
                                        <SelectItem key={m.value} value={m.value.toString()}>
                                            {m.label.charAt(0).toUpperCase() + m.label.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <Label>Ano</Label>
                            <Select
                                value={form.referenceYear.toString()}
                                onValueChange={(v) => setForm({ ...form, referenceYear: Number(v) })}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {years.map((y) => (
                                        <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="md:col-span-4 space-y-2">
                            <Label htmlFor="description">Descrição</Label>
                            <Input
                                id="description"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                            />
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <Label>Tipo</Label>
                            <Select
                                value={form.calculationType}
                                onValueChange={(v: "FIXED" | "PERCENTAGE") => setForm({ ...form, calculationType: v, amount: "", percentage: "" })}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="FIXED">Fixo</SelectItem>
                                    <SelectItem value="PERCENTAGE">Percentual</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <Label>{isPercentage ? "Porcentagem (%)" : "Valor (R$)"}</Label>
                            <Input
                                type="text"
                                placeholder="0.00"
                                value={isPercentage ? form.percentage : form.amount}
                                onChange={(e) => handleValueChange(e.target.value)}
                            />
                        </div>

                        <div className="md:col-span-12 flex justify-center gap-10 py-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="recurrent"
                                    checked={form.recurrent}
                                    onCheckedChange={(v) => setForm({ ...form, recurrent: !!v })}
                                />
                                <Label htmlFor="recurrent" className="cursor-pointer">Recorrente</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="paid"
                                    checked={form.paid}
                                    onCheckedChange={(v) => setForm({ ...form, paid: !!v })}
                                />
                                <Label htmlFor="paid" className="cursor-pointer">Já está pago</Label>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center mt-6">
                        <Button
                            onClick={handleSubmit}
                            disabled={loading || !form.description || (!form.amount && !form.percentage)}
                            className="px-20 py-6 text-base font-bold"
                        >
                            {loading ? "Salvando..." : "Adicionar Gasto"}
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
