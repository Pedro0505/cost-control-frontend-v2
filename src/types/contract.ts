export type ContractKind = "PJ" | "CLT";

export interface PjContractInputCreateDTO {
    hourlyRate: number;
    contractInitDate: string;
    contractEndDate: string | null;
}

export interface ContractResponseDTO {
    id: number;
    initDate: string;
    endDate: string | null;
    contractType: "PJ" | "CLT";
    hourlyRate: number | null;
    grossSalary: number | null;
    netSalary: number | null;
}

export interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}

export interface BaseContractRequest {
    contractInitDate: string;
    contractEndDate: string | null;
}

export interface PjContractInputCreateDTO extends BaseContractRequest {
    hourlyRate: number;
}

export interface CltContractRequest extends BaseContractRequest {
    netSalary: number;
    grossSalary: number;
}