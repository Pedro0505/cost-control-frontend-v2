import { api } from "@/services/http";
import { ExpenseEvolutionData, InvoiceGraphParams, InvoiceSummaryByYearMonth } from "@/types/expense-graph";

export const graphService = {
    getTopExpensesEvolution: async (): Promise<ExpenseEvolutionData[]> => {
        const { data } = await api.get<ExpenseEvolutionData[]>("/credit-card-expenses/graph/top-expenses-evolution");
        return data;
    },

    getTotalAmountByMonth: async (params?: InvoiceGraphParams): Promise<InvoiceSummaryByYearMonth[]> => {
        const { data } = await api.get<InvoiceSummaryByYearMonth[]>("/credit-card-expenses/graph/total-amount-by-month", { params });
        return data;
    }
};
