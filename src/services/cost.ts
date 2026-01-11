import { api } from "@/services/http";
import { Cost, UpdateCostInput, MutationCostResponse, CreateCostInput, CreateCostResponse } from "@/types/cost";

export async function createCost(
    input: CreateCostInput
): Promise<CreateCostResponse> {
    const { data } = await api.post<CreateCostResponse>("/cost", input);
    return data;
}

export async function getCosts(year: number, month: number): Promise<Cost[]> {
    const { data } = await api.get<Cost[]>(`/cost?year=${year}&month=${month}`);
    return data;
}

export async function deleteCost(id: number): Promise<MutationCostResponse> {
    const { data } = await api.delete<MutationCostResponse>(`/cost?id=${id}`);
    return data;
}

export async function updateCost(id: number, input: UpdateCostInput): Promise<MutationCostResponse> {
    const { data } = await api.put<MutationCostResponse>(`/cost?id=${id}`, input);
    return data;
}