"use client";

import { useState, useCallback } from "react";
import { CategoryPercentage } from "@/types/credit-card-percentage";
import { creditCardService } from "@/services/credit-card-service";

export function useCategoryPercentage() {
    const [data, setData] = useState<CategoryPercentage[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchPercentage = useCallback(async (year: number, month: number) => {
        setLoading(true);
        try {
            const result = await creditCardService.getExpensesPercentage(month, year);
            setData(result);
        } catch {
            setData([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const resetPercentage = useCallback(() => {
        setData([]);
    }, []);

    return {
        percentageData: data,
        loadingPercentage: loading,
        fetchPercentage,
        resetPercentage
    };
}
