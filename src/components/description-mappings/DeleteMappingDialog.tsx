"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
import { Button } from "@/shadcn/ui/button";
import { DescriptionMapping } from "@/types/description-mapping";

interface Props {
    mapping: DescriptionMapping | null;
    onCancel: () => void;
    onConfirm: (mapping: DescriptionMapping) => Promise<void>;
}

export function DeleteMappingDialog({ mapping, onCancel, onConfirm }: Props) {
    const [deleting, setDeleting] = useState(false);

    const handleConfirm = async () => {
        if (!mapping) return;
        setDeleting(true);
        try {
            await onConfirm(mapping);
            onCancel();
        } catch {
        } finally {
            setDeleting(false);
        }
    };

    return (
        <Dialog open={!!mapping} onOpenChange={(open) => !open && !deleting && onCancel()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Excluir regra #{mapping?.position}?</DialogTitle>
                    <DialogDescription>
                        As regras abaixo dela sobem uma posição. Lançamentos já importados só mudam após reprocessar.
                    </DialogDescription>
                </DialogHeader>

                {mapping && (
                    <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 rounded-lg bg-slate-50 dark:bg-muted/40 p-4 text-sm">
                        <dt className="text-muted-foreground">Regex</dt>
                        <dd className="font-mono break-all">{mapping.pattern}</dd>
                        <dt className="text-muted-foreground">Resultado</dt>
                        <dd className="font-medium">{mapping.type === "IGNORE" ? "Ignorar lançamento" : mapping.value}</dd>
                    </dl>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={onCancel} disabled={deleting}>Cancelar</Button>
                    <Button variant="destructive" onClick={handleConfirm} disabled={deleting}>
                        {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                        Excluir
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
