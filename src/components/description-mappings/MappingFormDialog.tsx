"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { Loader2, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select";
import {
    DescriptionMapping,
    DescriptionMappingInput,
    DescriptionMappingType,
    PATTERN_MAX_LENGTH,
    VALUE_MAX_LENGTH
} from "@/types/description-mapping";
import { getJsRegexError, testPatternLocally } from "@/utils/description-mapping-utils";
import { getApiErrorMessage, getApiErrorStatus } from "@/utils/error-handler";

const POSITION_END = "end";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mapping?: DescriptionMapping;
    total: number;
    valueSuggestions: string[];
    onSubmit: (input: DescriptionMappingInput) => Promise<unknown>;
}

interface FormErrors {
    pattern?: string;
    value?: string;
}

export function MappingFormDialog({ open, onOpenChange, mapping, total, valueSuggestions, onSubmit }: Props) {
    const isEdit = !!mapping;
    const datalistId = useId();

    const [type, setType] = useState<DescriptionMappingType>("CLASSIFY");
    const [pattern, setPattern] = useState("");
    const [value, setValue] = useState("");
    const [position, setPosition] = useState<string>(POSITION_END);
    const [sample, setSample] = useState("");
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!open) return;
        setType(mapping?.type ?? "CLASSIFY");
        setPattern(mapping?.pattern ?? "");
        setValue(mapping?.value ?? "");
        setPosition(mapping ? String(mapping.position) : POSITION_END);
        setSample("");
        setErrors({});
    }, [open, mapping]);

    const positionOptions = useMemo(() => {
        const max = isEdit ? total : total + 1;
        return Array.from({ length: Math.max(max, 0) }, (_, i) => i + 1);
    }, [isEdit, total]);

    const jsRegexError = pattern ? getJsRegexError(pattern) : null;
    const sampleMatches = testPatternLocally(pattern, sample);

    const validate = (): FormErrors => {
        const result: FormErrors = {};
        if (!pattern.trim()) result.pattern = "Informe a regex.";
        else if (pattern.length > PATTERN_MAX_LENGTH) result.pattern = `Máximo de ${PATTERN_MAX_LENGTH} caracteres.`;

        if (type === "CLASSIFY") {
            if (!value.trim()) result.value = "Informe o valor normalizado.";
            else if (value.length > VALUE_MAX_LENGTH) result.value = `Máximo de ${VALUE_MAX_LENGTH} caracteres.`;
        }
        return result;
    };

    const buildInput = (): DescriptionMappingInput => {
        const input: DescriptionMappingInput = {
            pattern,
            type,
            value: type === "IGNORE" ? null : value.trim()
        };

        if (isEdit) {
            const chosen = Number(position);
            if (chosen !== mapping!.position) input.position = chosen;
        } else if (position !== POSITION_END) {
            input.position = Number(position);
        }
        return input;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const validation = validate();
        setErrors(validation);
        if (Object.keys(validation).length > 0) return;

        setSubmitting(true);
        try {
            await onSubmit(buildInput());
            onOpenChange(false);
        } catch (err) {
            if (getApiErrorStatus(err) === 400) {
                setErrors({ pattern: getApiErrorMessage(err) });
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(next) => !submitting && onOpenChange(next)}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>{isEdit ? `Editar regra #${mapping!.position}` : "Nova regra"}</DialogTitle>
                    <DialogDescription>
                        A regex é comparada sem diferenciar maiúsculas/minúsculas e acentos, e o sufixo
                        &quot; - Parcela X/Y&quot; é removido antes da comparação.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    <div className="space-y-2">
                        <Label>Tipo</Label>
                        <Select value={type} onValueChange={(v) => setType(v as DescriptionMappingType)}>
                            <SelectTrigger aria-label="Tipo">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="CLASSIFY">Classificar como</SelectItem>
                                <SelectItem value="IGNORE">Ignorar lançamento</SelectItem>
                            </SelectContent>
                        </Select>
                        {type === "IGNORE" && (
                            <p className="text-xs text-muted-foreground">
                                Lançamentos ignorados não entram nos totais nem nos gráficos (ex.: estornos, pagamentos recebidos).
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="mapping-pattern">Regex</Label>
                        <Input
                            id="mapping-pattern"
                            value={pattern}
                            onChange={(e) => { setPattern(e.target.value); setErrors(prev => ({ ...prev, pattern: undefined })); }}
                            maxLength={PATTERN_MAX_LENGTH}
                            placeholder="ex.: ifood\s*club"
                            className="font-mono"
                            autoComplete="off"
                            spellCheck={false}
                            aria-invalid={!!errors.pattern}
                        />
                        {errors.pattern ? (
                            <p className="text-xs text-red-600 dark:text-red-400">{errors.pattern}</p>
                        ) : jsRegexError ? (
                            <p className="text-xs text-amber-600 dark:text-amber-400 flex items-start gap-1">
                                <AlertTriangle className="w-3.5 h-3.5 mt-px shrink-0" />
                                <span>
                                    O navegador não conseguiu compilar esta regex ({jsRegexError}). A sintaxe aceita é a de
                                    regex Java, então o servidor fará a validação final.
                                </span>
                            </p>
                        ) : null}
                    </div>

                    {type === "CLASSIFY" && (
                        <div className="space-y-2">
                            <Label htmlFor="mapping-value">Valor normalizado (categoria)</Label>
                            <Input
                                id="mapping-value"
                                value={value}
                                onChange={(e) => { setValue(e.target.value); setErrors(prev => ({ ...prev, value: undefined })); }}
                                maxLength={VALUE_MAX_LENGTH}
                                placeholder="ex.: Assinaturas"
                                list={datalistId}
                                autoComplete="off"
                                aria-invalid={!!errors.value}
                            />
                            <datalist id={datalistId}>
                                {valueSuggestions.map(s => <option key={s} value={s} />)}
                            </datalist>
                            {errors.value ? (
                                <p className="text-xs text-red-600 dark:text-red-400">{errors.value}</p>
                            ) : (
                                <p className="text-xs text-muted-foreground">
                                    Reutilize um valor existente: &quot;Delivery&quot; e &quot;delivery&quot; viram categorias diferentes.
                                </p>
                            )}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label>Posição</Label>
                        <Select value={position} onValueChange={setPosition}>
                            <SelectTrigger aria-label="Posição">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="max-h-72">
                                {!isEdit && <SelectItem value={POSITION_END}>No final</SelectItem>}
                                {positionOptions.map(p => (
                                    <SelectItem key={p} value={String(p)}>
                                        {isEdit && p === mapping!.position ? `Posição ${p} (atual)` : `Na posição ${p}`}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            A primeira regra que casar define a categoria. As regras a partir da posição escolhida são deslocadas.
                        </p>
                    </div>

                    <div className="space-y-2 rounded-lg border border-dashed border-slate-200 dark:border-border p-3">
                        <Label htmlFor="mapping-sample">Testar com uma descrição</Label>
                        <Input
                            id="mapping-sample"
                            value={sample}
                            onChange={(e) => setSample(e.target.value)}
                            placeholder="ex.: IFOOD CLUB - Parcela 1/3"
                            autoComplete="off"
                        />
                        {sampleMatches !== null && (
                            <p className={`text-xs flex items-center gap-1 ${sampleMatches ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"}`}>
                                {sampleMatches ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                                {sampleMatches ? "Esta regex casa com a descrição." : "Esta regex não casa com a descrição."}
                            </p>
                        )}
                        <p className="text-[11px] text-muted-foreground">
                            Prévia local, só desta regex. O resultado real, considerando a ordem das regras, aparece no
                            &quot;Testar descrição&quot; da página.
                        </p>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isEdit ? "Salvar" : "Criar regra"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
