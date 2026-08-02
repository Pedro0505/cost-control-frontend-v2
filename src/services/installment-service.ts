import { api } from "@/services/http";
import { InstallmentPercentageResponse } from "@/types/installment-percentage";

export async function getInstallmentPercentage(month: number, year: number): Promise<InstallmentPercentageResponse> {
    const { data } = await api.get<InstallmentPercentageResponse>(
        `/credit-card-expenses/installment-percentage?month=${month}&year=${year}`
    );
    return data;
}