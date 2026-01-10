export interface AvailableMonth {
    value: number;
    name: string;
}

export interface AvailableYear {
    availableYear: number;
    availableMonth: AvailableMonth[];
}
