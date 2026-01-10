import {api} from "@/services/http";
import {BalanceSummary} from "@/types/financial-balance";

export async function getFinancialBalanceByMonth(
    year: number,
    month: number
): Promise<BalanceSummary> {
    const { data } = await api.get<BalanceSummary>(
        "/financial-balance/month",
        {
            params: { year, month },
        }
    );

    return data;
}