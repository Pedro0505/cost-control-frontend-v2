export type MoneySummary = {
    income: number;
    expense: number;
    balance: number;
};

export type Cost = {
    id: number;
    calculationType: "FIXED" | "PERCENTAGE";
    amount: number;
    description: string;
    recurrent: boolean;
    paid: boolean;
};

export type BalanceSummary = {
    moneySummary: MoneySummary;
    costs: Cost[];
};