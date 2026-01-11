import { useState } from "react";
import { createCost } from "@/services/cost";
import { CreateCostInput, CreateCostResponse } from "@/types/cost";

export function useCreateCost() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = async (data: CreateCostInput): Promise<CreateCostResponse> => {
        setLoading(true);
        setError(null);
        try {
            return await createCost(data);
        } catch (err) {
            setError("Erro ao criar custo");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { execute, loading, error };
}