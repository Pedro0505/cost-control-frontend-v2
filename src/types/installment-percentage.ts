export interface InstallmentPercentageResponse {
    month: number;
    year: number;
    installmentPercentage: number;
    nonInstallmentPercentage: number;
}

export interface InstallmentPieData {
    name: string;
    percentage: number;
}