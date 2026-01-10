import { useState } from "react";
import { ImportCostRecurrentInputDTO } from "@/types/cost-import";
import { api } from "@/services/http";

export const importRecurrentCosts = async (data: ImportCostRecurrentInputDTO): Promise<void> => {
    await api.post("/cost/import-recurrent", data);
};

export function useImportCosts() {
    const [loading, setLoading] = useState(false);

    const execute = async (data: ImportCostRecurrentInputDTO) => {
        setLoading(true);
        try {
            await importRecurrentCosts(data);
        } finally {
            setLoading(false);
        }
    };

    return { execute, loading };
}
