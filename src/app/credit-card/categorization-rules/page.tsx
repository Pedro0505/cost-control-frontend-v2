"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ListOrdered, Loader2, Plus, Search, FlaskConical, Download, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { useDescriptionMappings } from "@/hooks/use-description-mappings";
import { MappingTable } from "@/components/description-mappings/MappingTable";
import { MappingFormDialog } from "@/components/description-mappings/MappingFormDialog";
import { DeleteMappingDialog } from "@/components/description-mappings/DeleteMappingDialog";
import { PreviewTester } from "@/components/description-mappings/PreviewTester";
import { ReprocessRulesBanner } from "@/components/description-mappings/ReprocessRulesBanner";
import { DescriptionMapping, DescriptionMappingInput, DescriptionMappingPreview } from "@/types/description-mapping";

type FormState = { open: false } | { open: true; mapping?: DescriptionMapping };

export default function CategorizationRulesPage() {
    const {
        mappings, loading, error, reordering, loadingDefaults,
        retry, create, update, remove, move, reorder, loadDefaults
    } = useDescriptionMappings();

    const [filter, setFilter] = useState("");
    const [form, setForm] = useState<FormState>({ open: false });
    const [toDelete, setToDelete] = useState<DescriptionMapping | null>(null);
    const [highlightedId, setHighlightedId] = useState<number | null>(null);

    const normalizedFilter = filter.trim().toLowerCase();
    const isFiltering = normalizedFilter.length > 0;

    const visibleMappings = useMemo(() => {
        if (!isFiltering) return mappings;
        return mappings.filter(m =>
            m.pattern.toLowerCase().includes(normalizedFilter) ||
            (m.value ?? "").toLowerCase().includes(normalizedFilter)
        );
    }, [mappings, isFiltering, normalizedFilter]);

    const valueSuggestions = useMemo(() => {
        const values = mappings.map(m => m.value).filter((v): v is string => !!v);
        return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b, "pt-BR"));
    }, [mappings]);

    const handleSubmit = (input: DescriptionMappingInput) => {
        if (form.open && form.mapping) return update(form.mapping.id, input);
        return create(input);
    };

    const handlePreview = (preview: DescriptionMappingPreview | null) => {
        const id = preview?.matchedMappingId ?? null;
        if (id !== null && !visibleMappings.some(m => m.id === id)) setFilter("");
        setHighlightedId(id);
    };

    const orderDisabled = isFiltering || reordering;

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-transparent p-6 md:p-12">
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="space-y-2">
                    <Link
                        href="/credit-card"
                        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="w-4 h-4" /> Cartão de crédito
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <ListOrdered className="w-6 h-6 text-indigo-500" /> Regras de Categorização
                    </h1>
                    <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
                        <strong>As regras são testadas de cima para baixo; a primeira que casar define a categoria.</strong>{" "}
                        &quot;Ignorar&quot; tira o lançamento dos totais e gráficos. Se nenhuma regra casar, o lançamento vira
                        &quot;Outros&quot;. Mudanças valem para novas faturas; para as já importadas, reprocesse.
                    </p>
                </div>

                <ReprocessRulesBanner />

                {!loading && !error && mappings.length > 0 && (
                    <Card className="bg-card shadow-sm border-slate-100 dark:border-border rounded-2xl">
                        <CardHeader className="border-b border-slate-50 dark:border-border pb-4">
                            <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-800 dark:text-slate-100">
                                <FlaskConical className="w-5 h-5 text-emerald-500" /> Testar descrição
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-5">
                            <PreviewTester onResult={handlePreview} />
                        </CardContent>
                    </Card>
                )}

                {loading ? (
                    <div className="py-20 flex flex-col items-center gap-4 bg-card/50 rounded-3xl border border-dashed border-slate-200 dark:border-border">
                        <Loader2 className="w-10 h-10 text-slate-400 animate-spin" />
                        <p className="text-slate-400 font-medium">Carregando regras...</p>
                    </div>
                ) : error ? (
                    <div className="py-16 flex flex-col items-center gap-4 bg-card/50 rounded-3xl border border-dashed border-red-200 dark:border-red-500/30">
                        <AlertCircle className="w-10 h-10 text-red-400" />
                        <p className="text-slate-600 dark:text-slate-300 font-medium text-center">{error}</p>
                        <Button variant="outline" onClick={retry}>Tentar de novo</Button>
                    </div>
                ) : mappings.length === 0 ? (
                    <div className="py-16 px-6 flex flex-col items-center gap-4 bg-card/50 rounded-3xl border border-dashed border-slate-200 dark:border-border text-center">
                        <ListOrdered className="w-12 h-12 text-slate-200 dark:text-slate-700" />
                        <div className="space-y-1 max-w-lg">
                            <p className="font-semibold text-slate-700 dark:text-slate-200">Nenhuma regra cadastrada</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Sem regras, <strong>todos os lançamentos serão classificados como &quot;Outros&quot;</strong>.
                                Carregue as regras padrão para começar ou crie a sua primeira regra.
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-3">
                            <Button onClick={loadDefaults} disabled={loadingDefaults} className="gap-2">
                                {loadingDefaults ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                Carregar regras padrão
                            </Button>
                            <Button variant="outline" onClick={() => setForm({ open: true })} disabled={loadingDefaults} className="gap-2">
                                <Plus className="w-4 h-4" /> Nova regra
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="relative sm:w-80">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    placeholder="Filtrar por regex ou valor"
                                    aria-label="Filtrar regras"
                                    className="pl-9 h-10 bg-card"
                                />
                            </div>
                            <Button onClick={() => setForm({ open: true })} className="h-10 gap-2">
                                <Plus className="w-4 h-4" /> Nova regra
                            </Button>
                        </div>

                        <p className="text-xs text-muted-foreground min-h-4">
                            {isFiltering
                                ? `Mostrando ${visibleMappings.length} de ${mappings.length} regras. A reordenação fica desabilitada enquanto houver filtro.`
                                : reordering
                                    ? "Salvando a nova ordem..."
                                    : `${mappings.length} regras. Arraste as linhas ou use as setas para mudar a ordem.`}
                        </p>

                        {visibleMappings.length === 0 ? (
                            <div className="py-12 text-center text-sm text-slate-400 bg-card/50 rounded-2xl border border-dashed border-slate-200 dark:border-border">
                                Nenhuma regra corresponde ao filtro.
                            </div>
                        ) : (
                            <MappingTable
                                mappings={visibleMappings}
                                total={mappings.length}
                                orderDisabled={orderDisabled}
                                highlightedId={highlightedId}
                                onMove={move}
                                onReorder={reorder}
                                onEdit={(mapping) => setForm({ open: true, mapping })}
                                onDelete={setToDelete}
                            />
                        )}
                    </div>
                )}
            </div>

            <MappingFormDialog
                open={form.open}
                onOpenChange={(open) => { if (!open) setForm({ open: false }); }}
                mapping={form.open ? form.mapping : undefined}
                total={mappings.length}
                valueSuggestions={valueSuggestions}
                onSubmit={handleSubmit}
            />

            <DeleteMappingDialog
                mapping={toDelete}
                onCancel={() => setToDelete(null)}
                onConfirm={(mapping) => remove(mapping.id)}
            />
        </div>
    );
}
