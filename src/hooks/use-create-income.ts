import { useState } from "react";
import { toast } from "sonner";
import {CreateIncomeInput} from "@/types/income";
import {createIncome} from "@/services/income";

export function useCreateIncome() {
    const [loading, setLoading] = useState(false);

    const execute = async (data: CreateIncomeInput) => {
        setLoading(true);
        try {
            await createIncome(data);
            toast.success("Renda cadastrada com sucesso");
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return { execute, loading };
}