export interface Income {
    id: number;
    amount: number;
    description: string;
    referenceDate: string;
    contractType: string | null;
}

export interface PjWork {
    id: number;
    referenceMonth: number;
    referenceYear: number;
    businessDays: number;
    hourlyRate: number;
}

export interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    number: number;
    last: boolean;
    first: boolean;
    size: number;
}
