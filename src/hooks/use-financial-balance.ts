"use client";

import { useEffect, useState } from "react";
import { getFinancialBalanceByMonth } from "@/services/financial-balance.service";
import { BalanceSummary } from "@/types/financial-balance";

export function useFinancialBalance(year: number, month: number) {
    const [data, setData] = useState<BalanceSummary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        getFinancialBalanceByMonth(year, month)
            .then(setData)
            .finally(() => setLoading(false));
    }, [year, month]);

    return { data, loading };
}