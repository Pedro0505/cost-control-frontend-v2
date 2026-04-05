import { useState, useEffect, useCallback } from "react";
import { creditCardService } from "@/services/credit-card-service";
import { CreditCardExpenseGrouped } from "@/types/credit-card";
import { AvailableMonthByYear } from "@/types/expense-graph";
import { api } from "@/services/http";

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
    const [availableData, setAvailableData] = useState<AvailableMonthByYear[]>([]);

    const refreshAvailable = async () => {
        try {
            const { data } = await api.get<AvailableMonthByYear[]>("/credit-card-expenses/available-months");
            setAvailableData(data);
        } catch (error) {
            console.error("Erro ao carregar meses disponíveis", error);
        }
    };

    useEffect(() => {
        refreshAvailable();
    }, []);

    return { availableData, refreshAvailable };
}
