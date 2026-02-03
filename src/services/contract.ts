import { api } from "@/services/http";
import { PjContractInputCreateDTO, ContractResponseDTO, PageResponse, CltContractRequest } from "@/types/contract";

export const contractService = {
    createPj: async (data: PjContractInputCreateDTO): Promise<void> => {
        await api.post("/contracts/employment/pj", data);
    },

    createClt: async (data: CltContractRequest): Promise<void> => {
        await api.post("/contracts/employment/clt", data);
    },
};

export async function getContracts(page: number, size: number): Promise<PageResponse<ContractResponseDTO>> {
    const { data } = await api.get<PageResponse<ContractResponseDTO>>("/contracts", {
        params: { page, size }
    });
    return data;
}