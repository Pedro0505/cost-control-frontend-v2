import { api } from "@/services/http";
import {
    CreditCardExpenseGrouped,
    AvailableMonthResponse
} from "@/types/credit-card";

export const creditCardService = {
    uploadInvoice: async (file: File, year: number, month: number): Promise<void> => {
        const formData = new FormData();
        formData.append("file", file);

        await api.post(`/file/invoices`, formData, {
            params: {
                invoiceReferenceYear: year,
                invoiceReferenceMonth: month
            },
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
    },

    getAvailableMonths: async (): Promise<AvailableMonthResponse[]> => {
        const { data } = await api.get<AvailableMonthResponse[]>("/credit-card-expenses/available-months");
        return data;
    },

    getExpenses: async (year: number, month: number): Promise<CreditCardExpenseGrouped[]> => {
        const { data } = await api.get<CreditCardExpenseGrouped[]>("/credit-card-expenses", {
            params: {
                invoiceYear: year,
                invoiceMonth: month
            }
        });
        return data;
    },

    reprocessDescriptions: async (): Promise<void> => {
        await api.put("/credit-card-expenses/reprocessing-descriptions");
    }
};
