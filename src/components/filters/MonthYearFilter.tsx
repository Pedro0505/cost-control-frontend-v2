"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/shadcn/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select";
import { getAvailableFinancialPeriods } from "@/services/monthly-balance";
import { AvailableYear } from "@/types/availability";

type Props = {
    onApply: (year: number, month: number) => void;
};

export function MonthYearFilter({ onApply }: Props) {
    const [data, setData] = useState<AvailableYear[]>([]);
    const [year, setYear] = useState<number | undefined>();
    const [month, setMonth] = useState<number | undefined>();

    const initialized = useRef(false);

    useEffect(() => {
        async function load() {
            try {
                const response = await getAvailableFinancialPeriods();

                if (!response || response.length === 0) return;

                setData(response);

                if (initialized.current) return;

                const today = new Date();
                const currentYear = today.getFullYear();
                const currentMonth = today.getMonth() + 1;

                const yearMatch = response.find((y) => y.availableYear === currentYear);

                if (yearMatch) {
                    const monthMatch = yearMatch.availableMonth.find((m) => m.value === currentMonth);
                    if (monthMatch) {
                        setYear(currentYear);
                        setMonth(currentMonth);
                        onApply(currentYear, currentMonth);
                        initialized.current = true;
                        return;
                    }
                }

                const fallbackYear = response[0];
                if (fallbackYear && fallbackYear.availableMonth?.length > 0) {
                    const fallbackMonth = fallbackYear.availableMonth[0];
                    setYear(fallbackYear.availableYear);
                    setMonth(fallbackMonth.value);
                    onApply(fallbackYear.availableYear, fallbackMonth.value);
                }

                initialized.current = true;
            } catch (error) {
                console.error(error);
            }
        }

        load();
    }, [onApply]);

    const availableMonths = data.find((y) => y.availableYear === year)?.availableMonth ?? [];
    const hasData = data.length > 0;

    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <label className="text-sm text-muted-foreground font-medium">Ano</label>
                <Select
                    disabled={!hasData}
                    value={year?.toString()}
                    onValueChange={(v) => {
                        const newYear = Number(v);
                        setYear(newYear);
                        const firstMonth = data.find(y => y.availableYear === newYear)?.availableMonth[0];
                        setMonth(firstMonth?.value);
                    }}
                >
                    <SelectTrigger className="w-28 bg-white">
                        <SelectValue placeholder="—" />
                    </SelectTrigger>
                    <SelectContent>
                        {data.map((item) => (
                            <SelectItem key={item.availableYear} value={item.availableYear.toString()}>
                                {item.availableYear}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center gap-2">
                <label className="text-sm text-muted-foreground font-medium">Mês</label>
                <Select
                    disabled={!year || availableMonths.length === 0}
                    value={month?.toString()}
                    onValueChange={(v) => setMonth(Number(v))}
                >
                    <SelectTrigger className="w-44 bg-white">
                        <SelectValue placeholder="—" />
                    </SelectTrigger>
                    <SelectContent>
                        {availableMonths.map((m) => (
                            <SelectItem key={m.value} value={m.value.toString()}>
                                {m.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Button
                className="h-10 px-6 font-bold"
                disabled={!year || !month}
                onClick={() => onApply(year!, month!)}
            >
                Filtrar
            </Button>
        </div>
    );
}
