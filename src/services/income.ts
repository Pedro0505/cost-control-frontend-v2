import { api } from "@/services/http";
import { CreateIncomeInput, IncomePageResponse } from "@/types/income";

export async function createIncome(input: CreateIncomeInput): Promise<void> {
    await api.post("/incomes", input);
}

export async function getIncomes(page: number, size: number): Promise<IncomePageResponse> {
    const { data } = await api.get<IncomePageResponse>(`/incomes`, {
        params: { page, size }
    });
    return data;
}

export async function deleteIncome(id: number): Promise<void> {
    await api.delete("/incomes", {
        params: { id }
    });
}