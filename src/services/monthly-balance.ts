import { AvailableYear } from "@/types/availability";
import { api } from "@/services/http";

export async function getAvailableFinancialPeriods(): Promise<AvailableYear[]> {
    const availablePeriods = await api.get("/monthly-balance/available-periods", {});

    return availablePeriods.data;
}
