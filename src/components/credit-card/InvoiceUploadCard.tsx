"use client";

import { useState, useMemo, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select";
import { Button } from "@/shadcn/ui/button";
import { UploadCloud, FileText, Trash2, Loader2 } from "lucide-react";
import { creditCardService } from "@/services/credit-card-service";
import { allMonths } from "@/utils/date-utils";
import { toast } from "sonner";

interface Props {
    onSuccess: () => void;
}

interface QueuedFile {
    id: string;
    file: File;
    month: string;
    year: string;
}

const MAX_FILES = 12;

// Extrai mês/ano de nomes no padrão "Nubank_2026-11-16.csv" (data em AAAA-MM-DD).
// Retorna null se não houver data válida ou se o ano não estiver entre as opções do select.
function extractPeriodFromFileName(fileName: string, availableYears: string[]): { month: string; year: string } | null {
    const match = fileName.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (!match) return null;

    const [, year, monthStr] = match;
    const month = parseInt(monthStr, 10);
    if (month < 1 || month > 12 || !availableYears.includes(year)) return null;

    return { month: month.toString(), year };
}

export function InvoiceUploadCard({ onSuccess }: Props) {
    const [queuedFiles, setQueuedFiles] = useState<QueuedFile[]>([]);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const years = useMemo(() => {
        const current = new Date().getFullYear();
        return Array.from({ length: current - 2020 + 1 }, (_, i) => (2020 + i).toString()).reverse();
    }, []);

    const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const remainingSlots = MAX_FILES - queuedFiles.length;
        if (remainingSlots <= 0) {
            toast.error(`Limite de ${MAX_FILES} arquivos atingido.`);
            return;
        }

        const filesToAdd = files.slice(0, remainingSlots);

        const newQueuedFiles: QueuedFile[] = filesToAdd.map((file) => {
            const period = extractPeriodFromFileName(file.name, years);
            return {
                id: crypto.randomUUID(),
                file,
                month: period?.month ?? (new Date().getMonth() + 1).toString(),
                year: period?.year ?? new Date().getFullYear().toString(),
            };
        });

        setQueuedFiles((prev) => [...prev, ...newQueuedFiles]);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const removeFile = (id: string) => {
        setQueuedFiles((prev) => prev.filter((f) => f.id !== id));
    };

    const updateFileData = (id: string, field: "month" | "year", value: string) => {
        setQueuedFiles((prev) =>
            prev.map((f) => (f.id === id ? { ...f, [field]: value } : f))
        );
    };

    const handleUploadAll = async () => {
        if (queuedFiles.length === 0) return;
        setLoading(true);

        try {
            await Promise.all(
                queuedFiles.map((item) =>
                    creditCardService.uploadInvoice(item.file, parseInt(item.year), parseInt(item.month))
                )
            );

            toast.success(`${queuedFiles.length} fatura(s) cadastradas com sucesso!`);
            setQueuedFiles([]);
            onSuccess();
        } catch (error) {
            console.error(error);
            toast.error("Erro ao realizar o upload de um ou mais arquivos.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: hsl(var(--border));
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: hsl(var(--muted-foreground) / 0.5);
                }
            `}</style>

            <Card className="bg-card shadow-md border-none rounded-2xl overflow-hidden">
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                        Cadastrar Faturas ({queuedFiles.length}/{MAX_FILES})
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">

                    {queuedFiles.length < MAX_FILES && (
                        <div className="group relative border-2 border-dashed border-slate-100 dark:border-border rounded-2xl p-8 transition-all hover:border-indigo-200 dark:hover:border-indigo-500/40 hover:bg-indigo-50/10 dark:hover:bg-indigo-500/10 flex flex-col items-center justify-center">
                            <input
                                type="file"
                                multiple
                                ref={fileInputRef}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleFileSelection}
                            />
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/15 rounded-full flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                                    <UploadCloud className="w-6 h-6" />
                                </div>
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                    Clique para adicionar até {MAX_FILES - queuedFiles.length} arquivos
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-3 max-h-[420px] overflow-y-auto pr-3 custom-scrollbar scroll-smooth">
                        {queuedFiles.map((item) => (
                            <div key={item.id} className="group/item flex items-center gap-4 p-4 bg-slate-50/50 dark:bg-muted/40 border border-slate-100 dark:border-border rounded-xl transition-all hover:border-indigo-100 dark:hover:border-indigo-500/40 hover:bg-card hover:shadow-sm">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-1.5 bg-card border border-slate-100 dark:border-border rounded-lg shadow-xs group-hover/item:border-indigo-100 dark:group-hover/item:border-indigo-500/40 transition-colors">
                                            <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                                        </div>
                                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">
                                            {item.file.name}
                                        </span>
                                    </div>

                                    <div className="flex gap-3">
                                        <div className="flex-1">
                                            <Select
                                                value={item.month}
                                                onValueChange={(v) => updateFileData(item.id, "month", v)}
                                            >
                                                <SelectTrigger className="h-9 text-xs bg-card border-slate-200 dark:border-border focus:ring-1 focus:ring-indigo-100 dark:focus:ring-indigo-500/40"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    {allMonths.map(m =>
                                                        <SelectItem key={m.month_value} value={m.month_value}>{m.month_name}</SelectItem>)
                                                    }
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex-1">
                                            <Select
                                                value={item.year}
                                                onValueChange={(v) => updateFileData(item.id, "year", v)}
                                            >
                                                <SelectTrigger className="h-9 text-xs bg-card border-slate-200 dark:border-border focus:ring-1 focus:ring-indigo-100 dark:focus:ring-indigo-500/40"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeFile(item.id)}
                                    className="text-slate-300 dark:text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/15 shrink-0 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>

                    {queuedFiles.length > 0 && (
                        <div className="pt-2">
                            <Button
                                className="w-full h-12 bg-slate-800 dark:bg-primary hover:bg-slate-900 dark:hover:bg-primary/90 text-white dark:text-primary-foreground font-semibold rounded-xl transition-all shadow-lg shadow-slate-100 dark:shadow-none"
                                onClick={handleUploadAll}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Cadastrando faturas...
                                    </>
                                ) : (
                                    `Confirmar Cadastro (${queuedFiles.length})`
                                )}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    );
}
