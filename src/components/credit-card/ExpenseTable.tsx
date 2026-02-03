"use client";

import { useState } from "react";
import { Fragment } from "react";
import { CreditCardExpenseGrouped } from "@/types/credit-card";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Table, TableBody, TableCell, TableRow } from "@/shadcn/ui/table";

interface Props {
    expenses: CreditCardExpenseGrouped[];
}

export function ExpenseTable({ expenses }: Props) {
    const [expanded, setExpanded] = useState<string[]>([]);

    const toggle = (id: string) => {
        setExpanded(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const totalGeneral = expenses.reduce((acc, curr) => acc + curr.totalAmount, 0);

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <Table>
                    <TableBody>
                        {expenses.map((group) => (
                            <Fragment key={group.normalizedDescription}>
                                <TableRow
                                    className="hover:bg-slate-50/50 border-b border-slate-50 cursor-pointer group/row h-14"
                                    onClick={() => toggle(group.normalizedDescription)}
                                >
                                    <TableCell className="w-12 text-center">
                                        <div className="flex justify-center">
                                            {expanded.includes(group.normalizedDescription)
                                                ? <ChevronDown className="w-4 h-4 text-slate-600" />
                                                : <ChevronRight className="w-4 h-4 text-slate-400" />}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-semibold text-slate-700 text-base">
                                        {group.normalizedDescription}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <span className="font-bold text-slate-700">
                                                R$ {group.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                    </TableCell>
                                </TableRow>

                                {expanded.includes(group.normalizedDescription) && (
                                    <>
                                        {group.expensesDetails.map((detail, idx) => (
                                            <TableRow key={idx} className="bg-slate-50/20 border-none hover:bg-slate-50/40">
                                                <TableCell></TableCell>
                                                <TableCell className="pl-10 py-3">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium text-slate-600">{detail.rawDescription}</span>
                                                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                                                            {new Date(detail.expenseDate).toLocaleDateString('pt-BR')}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right text-sm font-semibold text-slate-500 py-3">
                                                    R$ {detail.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow className="bg-indigo-50/10 border-t border-slate-100">
                                            <TableCell></TableCell>
                                            <TableCell className="pl-10 font-bold text-slate-800 text-sm">Total do Grupo</TableCell>
                                            <TableCell className="text-right font-bold text-slate-800 text-sm">
                                                R$ {group.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </TableCell>
                                        </TableRow>
                                    </>
                                )}
                            </Fragment>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="flex justify-between items-center px-6 py-5 bg-slate-800 rounded-2xl shadow-lg">
                <span className="text-sm font-bold text-slate-300 uppercase tracking-widest">Total Geral da Fatura</span>
                <span className="text-2xl font-black text-white">
                    R$ {totalGeneral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
            </div>
        </div>
    );
}
