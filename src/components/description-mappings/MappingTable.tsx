"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, GripVertical, Pencil, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table";
import { Button } from "@/shadcn/ui/button";
import { Badge } from "@/shadcn/ui/badge";
import { cn } from "@/lib/utils";
import { DESCRIPTION_MAPPING_TYPE_LABEL, DescriptionMapping } from "@/types/description-mapping";

interface Props {
    mappings: DescriptionMapping[];
    total: number;
    orderDisabled: boolean;
    highlightedId: number | null;
    onMove: (mapping: DescriptionMapping, delta: -1 | 1) => void;
    onReorder: (orderedIds: number[]) => void;
    onEdit: (mapping: DescriptionMapping) => void;
    onDelete: (mapping: DescriptionMapping) => void;
}

export function MappingTable({
    mappings, total, orderDisabled, highlightedId, onMove, onReorder, onEdit, onDelete
}: Props) {
    const [draggingId, setDraggingId] = useState<number | null>(null);
    const [dropTargetId, setDropTargetId] = useState<number | null>(null);
    const rowRefs = useRef(new Map<number, HTMLTableRowElement>());

    useEffect(() => {
        if (highlightedId === null) return;
        rowRefs.current.get(highlightedId)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, [highlightedId]);

    const resetDrag = () => {
        setDraggingId(null);
        setDropTargetId(null);
    };

    const handleDrop = (targetId: number) => {
        if (draggingId === null || draggingId === targetId) return resetDrag();
        const ids = mappings.map(m => m.id);
        const from = ids.indexOf(draggingId);
        const to = ids.indexOf(targetId);
        if (from < 0 || to < 0) return resetDrag();
        ids.splice(from, 1);
        ids.splice(to, 0, draggingId);
        resetDrag();
        onReorder(ids);
    };

    return (
        <div className="bg-card rounded-2xl shadow-sm border border-slate-100 dark:border-border overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-10" aria-label="Arrastar" />
                        <TableHead className="w-20 text-center">Posição</TableHead>
                        <TableHead>Regex</TableHead>
                        <TableHead className="w-28">Tipo</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead className="w-44 text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mappings.map((mapping) => {
                        const isFirst = mapping.position === 1;
                        const isLast = mapping.position === total;
                        const isHighlighted = mapping.id === highlightedId;

                        return (
                            <TableRow
                                key={mapping.id}
                                ref={(el) => {
                                    if (el) rowRefs.current.set(mapping.id, el);
                                    else rowRefs.current.delete(mapping.id);
                                }}
                                data-testid={`mapping-row-${mapping.id}`}
                                draggable={!orderDisabled}
                                onDragStart={(e) => {
                                    e.dataTransfer.effectAllowed = "move";
                                    e.dataTransfer.setData("text/plain", String(mapping.id));
                                    setDraggingId(mapping.id);
                                }}
                                onDragOver={(e) => {
                                    if (draggingId === null) return;
                                    e.preventDefault();
                                    e.dataTransfer.dropEffect = "move";
                                    if (dropTargetId !== mapping.id) setDropTargetId(mapping.id);
                                }}
                                onDrop={(e) => { e.preventDefault(); handleDrop(mapping.id); }}
                                onDragEnd={resetDrag}
                                className={cn(
                                    "border-b border-slate-50 dark:border-border transition-colors",
                                    draggingId === mapping.id && "opacity-40",
                                    dropTargetId === mapping.id && draggingId !== mapping.id && "outline outline-2 -outline-offset-2 outline-blue-400",
                                    isHighlighted && "bg-amber-100/70 hover:bg-amber-100 dark:bg-amber-500/20 dark:hover:bg-amber-500/25"
                                )}
                            >
                                <TableCell className="text-center">
                                    <GripVertical
                                        className={cn(
                                            "w-4 h-4 mx-auto",
                                            orderDisabled ? "text-slate-200 dark:text-slate-700" : "text-slate-400 cursor-grab"
                                        )}
                                        aria-hidden
                                    />
                                </TableCell>
                                <TableCell className="text-center">
                                    <span className="inline-flex h-8 min-w-8 px-2 items-center justify-center rounded-full bg-slate-800 text-white dark:bg-primary dark:text-primary-foreground text-sm font-bold tabular-nums">
                                        {mapping.position}
                                    </span>
                                </TableCell>
                                <TableCell className="font-mono text-sm break-all text-slate-700 dark:text-slate-200">
                                    {mapping.pattern}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={mapping.type === "IGNORE"
                                            ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
                                            : "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300"}
                                    >
                                        {DESCRIPTION_MAPPING_TYPE_LABEL[mapping.type]}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                    {mapping.type === "IGNORE" ? <span className="text-muted-foreground">-</span> : mapping.value}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-end gap-1">
                                        <Button
                                            variant="ghost" size="icon"
                                            onClick={() => onMove(mapping, -1)}
                                            disabled={orderDisabled || isFirst}
                                            title="Mover para cima"
                                            aria-label={`Mover regra ${mapping.position} para cima`}
                                        >
                                            <ArrowUp />
                                        </Button>
                                        <Button
                                            variant="ghost" size="icon"
                                            onClick={() => onMove(mapping, 1)}
                                            disabled={orderDisabled || isLast}
                                            title="Mover para baixo"
                                            aria-label={`Mover regra ${mapping.position} para baixo`}
                                        >
                                            <ArrowDown />
                                        </Button>
                                        <Button
                                            variant="ghost" size="icon"
                                            onClick={() => onEdit(mapping)}
                                            title="Editar"
                                            aria-label={`Editar regra ${mapping.position}`}
                                        >
                                            <Pencil />
                                        </Button>
                                        <Button
                                            variant="ghost" size="icon"
                                            onClick={() => onDelete(mapping)}
                                            title="Excluir"
                                            aria-label={`Excluir regra ${mapping.position}`}
                                        >
                                            <Trash2 className="text-red-500 dark:text-red-400" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
