import { api } from "@/services/http";
import { ExpenseCategoryData, ExpenseGraphParams, ExpenseEvolutionData } from "@/types/expense-graph";

export const graphService = {
    getTotalByExpenseType: async (params?: ExpenseGraphParams): Promise<ExpenseCategoryData[]> => {
        const { data } = await api.get<ExpenseCategoryData[]>("/credit-card-expenses/graph/total-by-expense-type", { params });
        return data;
    },

    getTopExpensesEvolution: async (): Promise<ExpenseEvolutionData[]> => {
        const { data } = await api.get<ExpenseEvolutionData[]>("/credit-card-expenses/graph/top-expenses-evolution");
        return data;
    }
};
