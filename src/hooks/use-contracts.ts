import { useState, useEffect, useCallback } from "react";
import { getContracts } from "@/services/contract";
import { PageResponse, ContractResponseDTO } from "@/types/contract";

export function useContracts(initialPage = 0, size = 5) {
    const [data, setData] = useState<PageResponse<ContractResponseDTO>>();
    const [page, setPage] = useState(initialPage);

    const refresh = useCallback(async () => {
        const res = await getContracts(page, size);
        setData(res);
    }, [page, size]);

    useEffect(() => { refresh(); }, [refresh]);

    return { data, page, setPage, refresh };
}
