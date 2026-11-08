import { AxiosError } from "axios";
import { toast } from "sonner";

export interface ErrorResponse {
    message: string;
    status: number;
    timestamp: number;
}

export const handleApiError = (error: unknown) => {
    const axiosError = error as AxiosError<ErrorResponse>;

    const errorMessage = axiosError.response?.data?.message || "Ocorreu um erro inesperado.";
    const status = axiosError.response?.status;

    console.error(`[API Error ${status}]:`, errorMessage);

    toast.error("Erro na Operação", {
        description: errorMessage,
    });
};

export const getApiErrorMessage = (error: unknown, fallback = "Ocorreu um erro inesperado."): string => {
    const axiosError = error as AxiosError<ErrorResponse>;
    return axiosError?.response?.data?.message || fallback;
};

export const getApiErrorStatus = (error: unknown): number | undefined => {
    return (error as AxiosError)?.response?.status;
};
