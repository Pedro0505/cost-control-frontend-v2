"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { descriptionMappingService } from "@/services/description-mapping-service";
import { DescriptionMapping, DescriptionMappingInput } from "@/types/description-mapping";
import { getApiErrorMessage, getApiErrorStatus } from "@/utils/error-handler";
import { markRulesChanged } from "@/utils/description-mapping-utils";

export function useDescriptionMappings() {
    const [mappings, setMappings] = useState<DescriptionMapping[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reordering, setReordering] = useState(false);
    const [loadingDefaults, setLoadingDefaults] = useState(false);

    const reorderingRef = useRef(false);
    const mappingsRef = useRef<DescriptionMapping[]>([]);
    mappingsRef.current = mappings;

    const refetch = useCallback(async () => {
        try {
            const data = await descriptionMappingService.list();
            setMappings(data);
            setError(null);
        } catch (err) {
            setError(getApiErrorMessage(err, "Não foi possível carregar as regras."));
        } finally {
            setLoading(false);
        }
    }, []);

    const retry = useCallback(async () => {
        setLoading(true);
        await refetch();
    }, [refetch]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    const create = useCallback(async (input: DescriptionMappingInput) => {
        const created = await descriptionMappingService.create(input);
        await refetch();
        markRulesChanged();
        return created;
    }, [refetch]);

    const update = useCallback(async (id: number, input: DescriptionMappingInput) => {
        const updated = await descriptionMappingService.update(id, input);
        await refetch();
        markRulesChanged();
        return updated;
    }, [refetch]);

    const remove = useCallback(async (id: number) => {
        await descriptionMappingService.remove(id);
        await refetch();
        markRulesChanged();
    }, [refetch]);

    const runOrderAction = useCallback(async (action: () => Promise<void>) => {
        if (reorderingRef.current) return;
        reorderingRef.current = true;
        setReordering(true);
        try {
            await action();
        } finally {
            reorderingRef.current = false;
            setReordering(false);
        }
    }, []);

    const move = useCallback((mapping: DescriptionMapping, delta: -1 | 1) => runOrderAction(async () => {
        try {
            await descriptionMappingService.update(mapping.id, {
                pattern: mapping.pattern,
                type: mapping.type,
                value: mapping.type === "IGNORE" ? null : mapping.value,
                position: mapping.position + delta
            });
            markRulesChanged();
        } finally {
            await refetch();
        }
    }), [runOrderAction, refetch]);

    const reorder = useCallback((orderedIds: number[]) => runOrderAction(async () => {
        const previous = mappingsRef.current;
        const byId = new Map(previous.map(m => [m.id, m]));
        setMappings(orderedIds
            .map(id => byId.get(id))
            .filter((m): m is DescriptionMapping => !!m));

        try {
            const serverList = await descriptionMappingService.reorder(orderedIds);
            setMappings(serverList);
            markRulesChanged();
        } catch (err) {
            setMappings(previous);
            if (getApiErrorStatus(err) === 400) {
                toast.warning("A lista mudou, confira a ordem e tente novamente.");
                await refetch();
            }
        }
    }), [runOrderAction, refetch]);

    const loadDefaults = useCallback(async () => {
        setLoadingDefaults(true);
        try {
            const data = await descriptionMappingService.loadDefaults();
            setMappings(data);
            markRulesChanged();
            toast.success(`${data.length} regras padrão carregadas.`);
        } catch (err) {
            if (getApiErrorStatus(err) === 409) {
                await refetch();
            }
        } finally {
            setLoadingDefaults(false);
        }
    }, [refetch]);

    return {
        mappings,
        loading,
        error,
        reordering,
        loadingDefaults,
        refetch,
        retry,
        create,
        update,
        remove,
        move,
        reorder,
        loadDefaults
    };
}

export function useHasNoDescriptionMappings() {
    const [isEmpty, setIsEmpty] = useState(false);

    useEffect(() => {
        let active = true;
        descriptionMappingService.list()
            .then(data => { if (active) setIsEmpty(data.length === 0); })
            .catch(() => undefined);
        return () => { active = false; };
    }, []);

    return isEmpty;
}
