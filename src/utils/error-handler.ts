import { AxiosError } from "axios";
import { toast } from "sonner";

interface ErrorResponse {
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
