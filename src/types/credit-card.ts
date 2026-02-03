export interface CreditCardExpenseDetail {
    rawDescription: string;
    expenseDate: string;
    amount: number;
}

export interface CreditCardExpenseGrouped {
    normalizedDescription: string;
    totalAmount: number;
    expensesDetails: CreditCardExpenseDetail[];
}

export interface AvailableMonth {
    value: number;
    name: string;
}

export interface AvailableMonthResponse {
    availableYear: number;
    availableMonth: AvailableMonth[];
}