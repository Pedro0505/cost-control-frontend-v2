import { MoneySummary } from "@/types/money-summary";

export interface Cost {
    id: number;
    calculationType: "FIXED" | "PERCENTAGE";
    amount: number;
    percentage: number;
    description: string;
    recurrent: boolean;
    paid: boolean;
}

export interface UpdateCostInput {
    description: string;
    calculationType: "FIXED" | "PERCENTAGE";
    amount: number;
    percentage: number;
    recurrent: boolean;
    paid: boolean;
}

export interface MutationCostResponse extends Cost {
    moneySummary: MoneySummary;
}

export interface CreateCostInput {
    referenceMonth: number;
    referenceYear: number;
    description: string;
    recurrent: boolean;
    paid: boolean;
    calculationType: "FIXED" | "PERCENTAGE";
    percentage: number;
    amount: number;
}

export interface CreateCostResponse {
    id: number;
    calculationType: string;
    amount: number;
    description: string;
    recurrent: boolean;
    paid: boolean;
    moneySummary: MoneySummary;
}
