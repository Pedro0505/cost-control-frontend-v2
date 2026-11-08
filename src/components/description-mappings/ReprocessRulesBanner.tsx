"use client";

import { RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/shadcn/ui/button";
import { useReprocessDescriptions } from "@/hooks/use-reprocess-descriptions";
import { useRulesChanged } from "@/utils/description-mapping-utils";

export function ReprocessRulesBanner({ onReprocessed }: { onReprocessed?: () => void }) {
    const { rulesChanged } = useRulesChanged();
    const { reprocess, isReprocessing } = useReprocessDescriptions(onReprocessed);

    if (!rulesChanged) return null;

    return (
        <div
            role="status"
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200"
        >
            <p className="flex items-start gap-2 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                As regras mudaram. Reprocesse as faturas para aplicar aos lançamentos já importados.
            </p>
            <Button onClick={reprocess} disabled={isReprocessing} className="gap-2 shrink-0">
                <RefreshCw className={`w-4 h-4 ${isReprocessing ? "animate-spin" : ""}`} />
                {isReprocessing ? "Reprocessando..." : "Reprocessar agora"}
            </Button>
        </div>
    );
}
