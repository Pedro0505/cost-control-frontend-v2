import { useState } from "react";
import { deleteIncome } from "@/services/income";

export function useDeleteIncome() {
    const [loading, setLoading] = useState(false);

    const execute = async (id: number) => {
        setLoading(true);
        try {
            await deleteIncome(id);
        } catch (error) {
            console.error("Erro ao deletar renda:", error);
        } finally {
            setLoading(false);
        }
    };

    return { execute, loading };
}
