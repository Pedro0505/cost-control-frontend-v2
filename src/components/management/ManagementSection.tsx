import { useState, useEffect } from "react";
import { useCreateIncome } from "@/hooks/use-create-income";
import { useIncomes } from "@/hooks/use-incomes";
import { useDeleteIncome } from "@/hooks/use-delete-income";
import { useContracts } from "@/hooks/use-contracts";
import { useCreatePjContract } from "@/hooks/use-create-pj-contract";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";
import { Table, TableBody, TableCell, TableRow } from "@/shadcn/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select";
import { Pagination } from "@/components/management/Pagination";
import { Trash2, FileText } from "lucide-react";
import { ContractType } from "@/types/income";
import { formatDateString } from "@/utils/date-utils";

export function ManagementSection() {
    const { execute: incomeExecute, loading: incomeLoading } = useCreateIncome();
    const { execute: deleteIncomeExec } = useDeleteIncome();
    const { data: incomeData, page: incomePage, setPage: setIncomePage, refresh: refreshIncomes } = useIncomes(0, 5);
    const { execute: contractExecute, loading: contractLoading } = useCreatePjContract();
    const { data: contractData, page: contractPage, setPage: setContractPage, refresh: refreshContracts } = useContracts(0, 5);

    const [contractType, setContractType] = useState<ContractType>("PJ");

    const [incomeForm, setIncomeForm] = useState({
        amount: "",
        description: "",
        referenceDate: new Date().toISOString().split('T')[0],
        businessDays: ""
    });

    const [pjContractForm, setPjContractForm] = useState({
        hourlyRate: "",
        contractInitDate: new Date().toISOString().split('T')[0],
        contractEndDate: ""
    });

    useEffect(() => {
        if (incomeData && incomeData.content.length === 0 && incomePage > 0) setIncomePage(incomePage - 1);
    }, [incomeData, incomePage, setIncomePage]);

    useEffect(() => {
        if (contractData && contractData.content.length === 0 && contractPage > 0) setContractPage(contractPage - 1);
    }, [contractData, contractPage, setContractPage]);

    const handleIncomeSubmit = async () => {
        await incomeExecute({
            amount: parseFloat(incomeForm.amount.replace(',', '.')),
            description: incomeForm.description,
            referenceDate: incomeForm.referenceDate,
            businessDays: contractType === "PJ" ? parseInt(incomeForm.businessDays) : null
        });
        setIncomeForm({ amount: "", description: "", referenceDate: new Date().toISOString().split('T')[0], businessDays: "" });
        await refreshIncomes();
    };

    const handleDeleteIncome = async (id: number) => {
        if (confirm("Deseja realmente excluir esta renda?")) {
            await deleteIncomeExec(id);
            await refreshIncomes();
        }
    };

    const handleContractSubmit = async () => {
        await contractExecute({
            hourlyRate: parseFloat(pjContractForm.hourlyRate.replace(',', '.')),
            contractInitDate: pjContractForm.contractInitDate,
            contractEndDate: pjContractForm.contractEndDate || null
        });
        setPjContractForm({ hourlyRate: "", contractInitDate: new Date().toISOString().split('T')[0], contractEndDate: "" });
        await refreshContracts();
    };

    return (
        <section className="w-full bg-[#F1F2F9] pb-10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">

                    <div className="p-8 bg-white rounded-xl shadow-sm border flex flex-col min-h-[720px]">
                        <div className="flex-1 flex flex-col">
                            <h3 className="text-lg font-bold text-gray-700 mb-6 text-center">Cadastrar Contrato PJ</h3>
                            <div className="space-y-4 mb-8">
                                <div className="space-y-2">
                                    <Label>Valor da Hora (R$)</Label>
                                    <Input
                                        type="text"
                                        placeholder="0.00"
                                        value={pjContractForm.hourlyRate}
                                        onChange={e => setPjContractForm({...pjContractForm, hourlyRate: e.target.value.replace(/[^0-9.,]/g, '')})}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Data Início</Label>
                                        <Input
                                            type="date"
                                            value={pjContractForm.contractInitDate}
                                            onChange={e => setPjContractForm({...pjContractForm, contractInitDate: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Data Fim (Opcional)</Label>
                                        <Input
                                            type="date"
                                            value={pjContractForm.contractEndDate}
                                            onChange={e => setPjContractForm({...pjContractForm, contractEndDate: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-center pt-2">
                                    <Button className="w-full max-w-[200px]" onClick={handleContractSubmit} disabled={contractLoading || !pjContractForm.hourlyRate}>
                                        {contractLoading ? "Enviando..." : "Cadastrar Contrato"}
                                    </Button>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100 flex-1 flex flex-col">
                                <h4 className="text-sm font-bold text-gray-500 mb-4 uppercase">Contratos Ativos</h4>
                                <div className="flex-1">
                                    <Table>
                                        <TableBody>
                                            {contractData?.content.map((contract) => (
                                                <TableRow key={contract.id} className="group border-none hover:bg-gray-50/50">
                                                    <TableCell className="py-2 pl-0">
                                                        <div className="flex items-center gap-3">
                                                            <FileText className="w-4 h-4 text-blue-500" />
                                                            <div className="flex flex-col">
                                                                <span className="font-medium text-gray-700">Contrato {contract.contractType}</span>
                                                                <span className="text-[10px] text-gray-400">
                                                                    {formatDateString(contract.initDate)} - {contract.endDate ? formatDateString(contract.endDate) : "Atual"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-2 text-right font-bold text-gray-600">
                                                        R$ {contract.hourlyRate?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/h
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                                <div className="mt-4">
                                    {contractData && <Pagination currentPage={contractPage} totalPages={contractData.totalPages} onPageChange={setContractPage} />}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-white rounded-xl shadow-sm border flex flex-col min-h-[720px]">
                        <div className="flex-1 flex flex-col">
                            <h3 className="text-lg font-bold text-gray-700 mb-6 text-center">Cadastrar Nova Renda</h3>
                            <div className="space-y-4 mb-8">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Tipo de Contrato</Label>
                                        <Select value={contractType} onValueChange={(v: ContractType) => setContractType(v)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="PJ">PJ</SelectItem>
                                                <SelectItem value="CLT">CLT</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Descrição</Label>
                                        <Input placeholder="Ex: Salário" value={incomeForm.description} onChange={e => setIncomeForm({...incomeForm, description: e.target.value})} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Valor (R$)</Label>
                                        <Input
                                            type="text"
                                            placeholder="0.00"
                                            value={incomeForm.amount}
                                            onChange={e => setIncomeForm({...incomeForm, amount: e.target.value.replace(/[^0-9.,]/g, '')})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Data</Label>
                                        <Input type="date" value={incomeForm.referenceDate} onChange={e => setIncomeForm({...incomeForm, referenceDate: e.target.value})} />
                                    </div>
                                </div>
                                <div className="min-h-[68px]">
                                    {contractType === "PJ" ? (
                                        <div className="space-y-2">
                                            <Label>Dias Úteis Trabalhados</Label>
                                            <Input
                                                type="text"
                                                value={incomeForm.businessDays}
                                                onChange={e => setIncomeForm({...incomeForm, businessDays: e.target.value.replace(/[^0-9]/g, '')})}
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-[68px]" />
                                    )}
                                </div>
                                <div className="flex justify-center pt-2">
                                    <Button className="w-full max-w-[200px]" onClick={handleIncomeSubmit} disabled={incomeLoading || !incomeForm.description}>
                                        {incomeLoading ? "Enviando..." : "Cadastrar Renda"}
                                    </Button>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100 flex-1 flex flex-col">
                                <h4 className="text-sm font-bold text-gray-500 mb-4 uppercase">Rendas Cadastradas</h4>
                                <div className="flex-1">
                                    <Table>
                                        <TableBody>
                                            {incomeData?.content.map((income) => (
                                                <TableRow key={income.id} className="group border-none hover:bg-gray-50/50">
                                                    <TableCell className="py-2 pl-0">
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-gray-700 flex items-center gap-2">
                                                                {income.description}
                                                                <span className="text-[9px] bg-gray-100 px-1 rounded text-gray-500 font-bold">{income.contractType}</span>
                                                            </span>
                                                            <span className="text-[10px] text-gray-400">{formatDateString(income.referenceDate)}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-2 text-right font-bold text-green-600">
                                                        R$ {income.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                    </TableCell>
                                                    <TableCell className="py-2 text-right w-10">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-300 hover:text-red-500 transition-colors" onClick={() => handleDeleteIncome(income.id)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                                <div className="mt-4">
                                    {incomeData && <Pagination currentPage={incomePage} totalPages={incomeData.totalPages} onPageChange={setIncomePage} />}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
