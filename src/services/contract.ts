import { api } from "@/services/http";
import { PjContractInputCreateDTO, ContractResponseDTO, PageResponse } from "@/types/contract";

export async function createPjContract(data: PjContractInputCreateDTO): Promise<void> {
    await api.post("/contracts/employment/pj", data);
}

export async function getContracts(page: number, size: number): Promise<PageResponse<ContractResponseDTO>> {
    const { data } = await api.get<PageResponse<ContractResponseDTO>>("/contracts", {
        params: { page, size }
    });
    return data;
}