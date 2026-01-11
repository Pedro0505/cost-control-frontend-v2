import { useFinancialBalance } from "@/hooks/use-financial-balance";
import { ArrowDownIcon, ArrowUpIcon, WalletIcon } from "lucide-react";
import { SummaryCard } from "@/components/summary/SummaryCards";
import { MoneySummary } from "@/types/money-summary";

type Props = {
    year: number;
    month: number;
    overrideSummary?: MoneySummary
};


export function SummarySection({ year, month, overrideSummary }: Props) {
    const { data, loading } = useFinancialBalance(year, month);

    if (loading || !data) {
        return (
            <div className="w-full border-b border-gray-200 bg-[#F3F3FB]">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="h-6 w-24 bg-gray-200 animate-pulse mb-4 rounded" />
                    <div className="grid grid-cols-3 gap-6">
                        <div className="h-32 rounded-xl bg-gray-200 animate-pulse" />
                        <div className="h-32 rounded-xl bg-gray-200 animate-pulse" />
                        <div className="h-32 rounded-xl bg-gray-200 animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    const summary = overrideSummary ?? data.moneySummary;

    const { income, expense, balance } = summary;

    return (
        <section className="w-full border-b border-gray-200 bg-[#F3F3FB]">

            <div className="max-w-7xl mx-auto px-6 py-8">

                <h2 className="text-xl font-bold text-gray-500 mb-4">
                    Resumo
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <SummaryCard
                        title="Receitas"
                        value={`R$ ${income.toFixed(2)}`}
                        color="green"
                        icon={<ArrowUpIcon className="h-4 w-4" />}
                    />

                    <SummaryCard
                        title="Despesas"
                        value={`R$ ${expense.toFixed(2)}`}
                        color="red"
                        icon={<ArrowDownIcon className="h-4 w-4" />}
                    />

                    <SummaryCard
                        title="Saldo"
                        value={`R$ ${balance.toFixed(2)}`}
                        color="blue"
                        icon={<WalletIcon className="h-4 w-4" />}
                    />
                </div>
            </div>
        </section>
    );
}