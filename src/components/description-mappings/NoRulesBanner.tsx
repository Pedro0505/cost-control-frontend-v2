"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { useHasNoDescriptionMappings } from "@/hooks/use-description-mappings";
import { CATEGORIZATION_RULES_ROUTE } from "@/components/description-mappings/routes";

export function NoRulesBanner() {
    const isEmpty = useHasNoDescriptionMappings();

    if (!isEmpty) return null;

    return (
        <div
            role="alert"
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200"
        >
            <p className="flex items-start gap-2 text-sm">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                Você ainda não tem regras de categorização. Novas faturas e reprocessamentos vão classificar todos os
                lançamentos como &quot;Outros&quot;.
            </p>
            <Link
                href={CATEGORIZATION_RULES_ROUTE}
                className="inline-flex items-center gap-1 text-sm font-semibold underline-offset-4 hover:underline shrink-0"
            >
                Configurar regras <ArrowRight className="w-4 h-4" />
            </Link>
        </div>
    );
}
