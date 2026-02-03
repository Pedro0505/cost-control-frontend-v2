import { useState, useEffect, useCallback } from "react";
import { creditCardService } from "@/services/credit-card-service";
import { CreditCardExpenseGrouped, AvailableMonthResponse } from "@/types/credit-card";

export function useCreditCardExpenses() {
    const [expenses, setExpenses] = useState<CreditCardExpenseGrouped[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchExpenses = useCallback(async (year: number, month: number) => {
        setLoading(true);
        try {
            const data = await creditCardService.getExpenses(year, month);
            setExpenses(data);
        } finally {
            setLoading(false);
        }
    }, []);

    return { expenses, loading, fetchExpenses };
}

export function useAvailableMonths() {
    const [availableData, setAvailableData] = useState<AvailableMonthResponse[]>([]);

    const fetchAvailable = useCallback(async () => {
        const data = await creditCardService.getAvailableMonths();
        setAvailableData(data);
    }, []);

    useEffect(() => {
        fetchAvailable();
    }, [fetchAvailable]);

    return { availableData, refreshAvailable: fetchAvailable };
}
