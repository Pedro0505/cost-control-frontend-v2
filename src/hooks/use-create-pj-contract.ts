import { useState } from "react";
import { createPjContract } from "@/services/contract";
import { PjContractInputCreateDTO } from "@/types/contract";

export function useCreatePjContract() {
    const [loading, setLoading] = useState(false);
    const execute = async (data: PjContractInputCreateDTO) => {
        setLoading(true);
        try {
            await createPjContract(data);
        } finally {
            setLoading(false);
        }
    };
    return { execute, loading };
}
