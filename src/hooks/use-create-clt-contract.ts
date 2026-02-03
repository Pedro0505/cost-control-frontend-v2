import { useState } from "react";
import { contractService } from "@/services/contract";
import { CltContractRequest } from "@/types/contract";

export function useCreateCltContract() {
    const [loading, setLoading] = useState(false);

    const execute = async (data: CltContractRequest) => {
        setLoading(true);
        try {
            await contractService.createClt(data);
        } finally {
            setLoading(false);
        }
    };

    return { execute, loading };
}
