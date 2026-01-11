"use client";

import { useState } from "react";
import { SummarySection } from "@/components/summary/SummarySection";
import { MonthYearFilter } from "@/components/filters/MonthYearFilter";
import { CreateCostSection } from "@/components/costs/CreateCostSection";
import { CostTableSection } from "@/components/costs/CostTableSection";
import { ManagementSection } from "@/components/management/ManagementSection";
import { MoneySummary } from "@/types/money-summary";

export default function Home() {
    const [year, setYear] = useState<number>();
    const [month, setMonth] = useState<number>();
    const [summaryOverride, setSummaryOverride] = useState<MoneySummary | undefined>();
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    function handleApply(y: number, m: number) {
        setYear(y);
        setMonth(m);
        setSummaryOverride(undefined);
    }

    function handleCostCreated(newSummary: MoneySummary) {
        setSummaryOverride(newSummary);
        setRefreshTrigger(prev => prev + 1);
    }

    return (
        <main className="min-h-screen bg-[#F1F2F9]">
            <section className="w-full border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="bg-white rounded-xl shadow-sm border px-6 py-5">
                        <MonthYearFilter onApply={handleApply} />
                    </div>
                </div>
            </section>

            {year && month ? (
                <div className="space-y-0">
                    <SummarySection
                        year={year}
                        month={month}
                        overrideSummary={summaryOverride}
                    />

                    <CreateCostSection
                        year={year}
                        month={month}
                        onSummaryUpdate={handleCostCreated}
                    />

                    <CostTableSection
                        key={`${year}-${month}-${refreshTrigger}`}
                        year={year}
                        month={month}
                        onSummaryUpdate={setSummaryOverride}
                    />
                </div>
            ) : (
                <div className="max-w-7xl mx-auto px-6 py-20 text-center">
                    <p className="text-gray-400 font-medium">
                        Selecione um período para visualizar os dados financeiros.
                    </p>
                </div>
            )}

            <div className="mt-6">
                <ManagementSection />
            </div>
        </main>
    );
}