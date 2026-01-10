export type ContractType = "CLT" | "PJ";

export interface CreateIncomeInput {
    amount: number;
    description: string;
    referenceDate: string;
    businessDays?: number | null;
}

export interface Income {
    id: number;
    amount: number;
    description: string;
    referenceDate: string;
    contractType: string | null;
}

export interface IncomePageResponse {
    content: Income[];
    totalPages: number;
    totalElements: number;
    number: number;
    last: boolean;
    first: boolean;
}
