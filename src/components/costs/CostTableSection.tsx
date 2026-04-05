"use client";

import { useState } from "react";
import { useCosts } from "@/hooks/use-costs";
import { MoneySummary } from "@/types/money-summary";
import { Cost, UpdateCostInput } from "@/types/cost";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { Checkbox } from "@/shadcn/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select";
import { Pencil, Trash2, Check, X, Loader2 } from "lucide-react";

type Props = {
    year: number;
    month: number;
    onSummaryUpdate: (summary: MoneySummary) => void;
};

export function CostTableSection({ year, month, onSummaryUpdate }: Props) {
    const { costs, loading, remove, edit } = useCosts(year, month);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<UpdateCostInput | null>(null);

    const startEdit = (cost: Cost) => {
        setEditingId(cost.id);
        setEditForm({
            description: cost.description,
            calculationType: cost.calculationType,
            amount: cost.amount,

            percentage: cost.percentage ?? 0,
            recurrent: cost.recurrent,
            paid: cost.paid,
        });
    };

    const handleSave = async (id: number) => {
        if (!editForm) return;

        const payload = {
            ...editForm,
            percentage: editForm.calculationType === "FIXED" ? 0 : editForm.percentage
        };

        await edit(id, payload, (newSummary) => {
            onSummaryUpdate(newSummary);
        });
        setEditingId(null);
        setEditForm(null);
    };

    if (loading && costs.length === 0) {
        return (
            <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <section className="w-full bg-[#F1F2F9] pb-10">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-xl font-bold text-gray-700 mb-4">Tabela de Gastos</h2>
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Descrição</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Valor (R$)</TableHead>
                                <TableHead>Porcentagem</TableHead>
                                <TableHead className="text-center">Recorrente</TableHead>
                                <TableHead className="text-center">Pago</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {costs.map((cost) => (
                                <TableRow key={cost.id}>
                                    {editingId === cost.id && editForm ? (
                                        <>
                                            <TableCell>
                                                <Input
                                                    value={editForm.description}
                                                    onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Select
                                                    value={editForm.calculationType}
                                                    onValueChange={(v: "FIXED" | "PERCENTAGE") =>
                                                        setEditForm({ ...editForm, calculationType: v })
                                                    }
                                                >
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="FIXED">FIXED</SelectItem>
                                                        <SelectItem value="PERCENTAGE">PERCENTAGE</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    value={editForm.amount}
                                                    onChange={e => setEditForm({ ...editForm, amount: Number(e.target.value) })}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    disabled={editForm.calculationType === "FIXED"}
                                                    value={editForm.calculationType === "FIXED" ? "" : (editForm.percentage ?? 0)}
                                                    onChange={e => {
                                                        const val = e.target.value === "" ? 0 : Number(e.target.value);
                                                        setEditForm({ ...editForm, percentage: val });
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-center">
                                                    <Checkbox checked={editForm.recurrent} onCheckedChange={v => setEditForm({ ...editForm, recurrent: !!v })} />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-center">
                                                    <Checkbox checked={editForm.paid} onCheckedChange={v => setEditForm({ ...editForm, paid: !!v })} />
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button size="icon" variant="ghost" onClick={() => handleSave(cost.id)}>
                                                    <Check className="w-4 h-4 text-green-600" />
                                                </Button>
                                                <Button size="icon" variant="ghost" onClick={() => { setEditingId(null); setEditForm(null); }}>
                                                    <X className="w-4 h-4 text-red-600" />
                                                </Button>
                                            </TableCell>
                                        </>
                                    ) : (
                                        <>
                                            <TableCell className="font-medium">{cost.description}</TableCell>
                                            <TableCell>{cost.calculationType}</TableCell>
                                            <TableCell>R$ {cost.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                                            <TableCell>
                                                {/* CORREÇÃO: Fallback visual para evitar que a célula suma se o valor for nulo */}
                                                {cost.calculationType === "PERCENTAGE" ? `${cost.percentage ?? 0}%` : "—"}
                                            </TableCell>
                                            <TableCell className="text-center">{cost.recurrent ? "Sim" : "Não"}</TableCell>
                                            <TableCell className="text-center">{cost.paid ? "Sim" : "Não"}</TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button size="icon" variant="ghost" onClick={() => startEdit(cost)}>
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" onClick={() => remove(cost.id, onSummaryUpdate)}>
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </Button>
                                            </TableCell>
                                        </>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </section>
    );
}