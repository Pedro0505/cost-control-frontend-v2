import { Payload, NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import { LegendPayload } from "recharts/types/component/DefaultLegendContent";

export interface ExpenseEvolutionData {
    category: string;
    year: number;
    month: number;
    total: number;
}

export interface EvolutionChartPoint {
    dateLabel: string;
    originalDate: string;
    [category: string]: number | string;
}

export interface CustomTooltipProps {
    active?: boolean;
    payload?: readonly Payload<ValueType, NameType>[];
    label?: string | number;
}

export interface LegendClickData extends LegendPayload {
    value: string;
}

export interface EvolutionGraphState {
    data: EvolutionChartPoint[];
    categories: string[];
}
