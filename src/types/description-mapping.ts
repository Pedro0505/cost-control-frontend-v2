export type DescriptionMappingType = "CLASSIFY" | "IGNORE";

export interface DescriptionMapping {
    id: number;
    position: number;
    pattern: string;
    type: DescriptionMappingType;
    value: string | null;
}

export interface DescriptionMappingInput {
    pattern: string;
    type?: DescriptionMappingType;
    value?: string | null;
    position?: number | null;
}

export interface DescriptionMappingReorderInput {
    ids: number[];
}

export interface DescriptionMappingPreview {
    rawDescription: string;
    normalizedDescription: string | null;
    ignored: boolean;
    matchedMappingId: number | null;
    matchedPosition: number | null;
}

export const DESCRIPTION_MAPPING_TYPE_LABEL: Record<DescriptionMappingType, string> = {
    CLASSIFY: "Classificar",
    IGNORE: "Ignorar"
};

export const PATTERN_MAX_LENGTH = 500;
export const VALUE_MAX_LENGTH = 255;
export const FALLBACK_CATEGORY = "Outros";
