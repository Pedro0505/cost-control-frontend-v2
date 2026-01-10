import { useState, useEffect, useCallback } from "react";
import { IncomePageResponse } from "@/types/income";
import { getIncomes } from "@/services/income";

export function useIncomes(initialPage: number = 0, size: number = 5) {
    const [data, setData] = useState<IncomePageResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(initialPage);

    const fetchIncomes = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getIncomes(page, size);
            setData(response);
        } catch (error) {
            console.error("Erro ao carregar rendas:", error);
        } finally {
            setLoading(false);
        }
    }, [page, size]);

    useEffect(() => {
        fetchIncomes();
    }, [fetchIncomes]);

    return { data, loading, page, setPage, refresh: fetchIncomes };
}