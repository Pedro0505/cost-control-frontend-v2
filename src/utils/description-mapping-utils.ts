"use client";

import { useEffect, useState, useCallback } from "react";

const INSTALLMENT_SUFFIX = /\s*-\s*Parcela\s+\d+\s*\/\s*\d+\s*$/i;

export function prepareDescriptionForMatch(description: string): string {
    return description
        .replace(INSTALLMENT_SUFFIX, "")
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "");
}

export function getJsRegexError(pattern: string): string | null {
    try {
        new RegExp(pattern);
        return null;
    } catch (err) {
        return err instanceof Error ? err.message : "Regex inválida";
    }
}

export function testPatternLocally(pattern: string, description: string): boolean | null {
    if (!pattern || !description) return null;
    try {
        return new RegExp(pattern, "i").test(prepareDescriptionForMatch(description));
    } catch {
        return null;
    }
}

const RULES_CHANGED_KEY = "description-mappings:rules-changed";
const RULES_CHANGED_EVENT = "description-mappings:rules-changed";

function readRulesChanged(): boolean {
    try {
        return window.localStorage.getItem(RULES_CHANGED_KEY) === "1";
    } catch {
        return false;
    }
}

function writeRulesChanged(value: boolean) {
    try {
        if (value) window.localStorage.setItem(RULES_CHANGED_KEY, "1");
        else window.localStorage.removeItem(RULES_CHANGED_KEY);
    } catch {
    }
    window.dispatchEvent(new CustomEvent<boolean>(RULES_CHANGED_EVENT, { detail: value }));
}

export const markRulesChanged = () => writeRulesChanged(true);
export const clearRulesChanged = () => writeRulesChanged(false);

export function useRulesChanged() {
    const [changed, setChanged] = useState(false);

    useEffect(() => {
        setChanged(readRulesChanged());
        const handler = (event: Event) => setChanged((event as CustomEvent<boolean>).detail);
        window.addEventListener(RULES_CHANGED_EVENT, handler);
        return () => window.removeEventListener(RULES_CHANGED_EVENT, handler);
    }, []);

    const mark = useCallback(() => markRulesChanged(), []);
    const clear = useCallback(() => clearRulesChanged(), []);

    return { rulesChanged: changed, markRulesChanged: mark, clearRulesChanged: clear };
}
