"use client";

import type { CSSProperties } from "react";
import { useTheme } from "next-themes";

export interface ChartTheme {
    isDark: boolean;
    grid: string;
    gridSubtle: string;
    axis: string;
    axisSubtle: string;
    label: string;
    cursor: string;
    dotFill: string;
    tooltipContent: CSSProperties;
    tooltipLabel: CSSProperties;
    tooltipItem: CSSProperties;
}

const BASE_TOOLTIP: CSSProperties = { borderRadius: "12px" };

const LIGHT: ChartTheme = {
    isDark: false,
    grid: "#e2e8f0",
    gridSubtle: "#f1f5f9",
    axis: "#64748b",
    axisSubtle: "#94a3b8",
    label: "#475569",
    cursor: "#94a3b8",
    dotFill: "#ffffff",
    tooltipContent: {
        ...BASE_TOOLTIP,
        backgroundColor: "#ffffff",
        border: "none",
        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
    },
    tooltipLabel: { color: "#1e293b" },
    tooltipItem: {},
};

const DARK: ChartTheme = {
    isDark: true,
    grid: "#2a3446",
    gridSubtle: "#1e2738",
    axis: "#94a3b8",
    axisSubtle: "#8b98ad",
    label: "#cbd5e1",
    cursor: "#64748b",
    dotFill: "#141924",
    tooltipContent: {
        ...BASE_TOOLTIP,
        backgroundColor: "#1a2130",
        border: "1px solid #2a3446",
        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.5)",
    },
    tooltipLabel: { color: "#f1f5f9" },
    tooltipItem: { color: "#e2e8f0" },
};

export function useChartTheme(): ChartTheme {
    const { resolvedTheme } = useTheme();
    return resolvedTheme === "dark" ? DARK : LIGHT;
}
