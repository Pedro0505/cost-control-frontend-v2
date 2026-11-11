import { useState } from "react";
import { creditCardService } from "@/services/credit-card-service";
import { toast } from "sonner";
import { ApiError } from "@/types/axios";
import { clearRulesChanged } from "@/utils/description-mapping-utils";

export function useReprocessDescriptions(onSuccess?: () => void) {
    const [isReprocessing, setIsReprocessing] = useState(false);

    const reprocess = async () => {
        setIsReprocessing(true);
        try {
            await creditCardService.reprocessDescriptions();
            clearRulesChanged();
            toast.success("Reprocessamento concluído");
            if (onSuccess) onSuccess();
        } catch (err: unknown) {
            const error = err as ApiError;
            const errorMessage = error.message || "Ocorreu um erro inesperado ao reprocessar.";
            toast.error(errorMessage);
        } finally {
            setIsReprocessing(false);
        }
    };

    return { reprocess, isReprocessing };
}
