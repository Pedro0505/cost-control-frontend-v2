import { useState, useEffect, useCallback } from "react";
import { getCosts, deleteCost, updateCost } from "@/services/cost";
import { Cost, UpdateCostInput } from "@/types/cost";
import { MoneySummary } from "@/types/money-summary";

export function useCosts(year: number, month: number) {
    const [costs, setCosts] = useState<Cost[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchCosts = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getCosts(year, month);
            setCosts(data);
        } finally {
            setLoading(false);
        }
    }, [year, month]);

    useEffect(() => {
        fetchCosts();
    }, [fetchCosts]);

    const remove = async (id: number, onUpdate: (s: MoneySummary) => void) => {
        const response = await deleteCost(id);
        setCosts((prev) => prev.filter((c) => c.id !== id));
        onUpdate(response.moneySummary);
    };

    const edit = async (id: number, data: UpdateCostInput, onUpdate: (s: MoneySummary) => void) => {
        const response = await updateCost(id, data);
        setCosts((prev) => prev.map((c) => (c.id === id ? response : c)));
        onUpdate(response.moneySummary);
    };

    return { costs, loading, remove, edit, refresh: fetchCosts };
}
