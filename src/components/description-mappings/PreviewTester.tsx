"use client";

import { useState } from "react";
import { FlaskConical, Loader2 } from "lucide-react";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { descriptionMappingService } from "@/services/description-mapping-service";
import { DescriptionMappingPreview, FALLBACK_CATEGORY } from "@/types/description-mapping";

interface Props {
    onResult: (preview: DescriptionMappingPreview | null) => void;
}

export function PreviewTester({ onResult }: Props) {
    const [description, setDescription] = useState("");
    const [result, setResult] = useState<DescriptionMappingPreview | null>(null);
    const [loading, setLoading] = useState(false);

    const handleTest = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!description.trim()) return;
        setLoading(true);
        try {
            const preview = await descriptionMappingService.preview(description);
            setResult(preview);
            onResult(preview);
        } catch {
            setResult(null);
            onResult(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-3">
            <form onSubmit={handleTest} className="flex flex-col sm:flex-row gap-2">
                <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Cole uma descrição da fatura, ex.: IFOOD CLUB - Parcela 1/3"
                    aria-label="Testar descrição"
                    className="h-10"
                />
                <Button type="submit" disabled={loading || !description.trim()} className="h-10 gap-2 shrink-0">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FlaskConical className="w-4 h-4" />}
                    Testar descrição
                </Button>
            </form>

            {result && (
                <p className="text-sm text-slate-700 dark:text-slate-200" data-testid="preview-result">
                    <span className="text-muted-foreground">&quot;{result.rawDescription}&quot;</span>{" "}
                    {result.ignored ? (
                        <>→ <strong>Ignorado</strong> (regra #{result.matchedPosition})</>
                    ) : result.matchedMappingId === null ? (
                        <>→ <strong>{FALLBACK_CATEGORY}</strong> (nenhuma regra casou)</>
                    ) : (
                        <>→ <strong>{result.normalizedDescription ?? FALLBACK_CATEGORY}</strong> (regra #{result.matchedPosition})</>
                    )}
                </p>
            )}
        </div>
    );
}
