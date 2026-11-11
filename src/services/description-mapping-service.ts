import { api } from "@/services/http";
import {
    DescriptionMapping,
    DescriptionMappingInput,
    DescriptionMappingPreview,
    DescriptionMappingReorderInput
} from "@/types/description-mapping";

const BASE = "/description-mappings";

export const descriptionMappingService = {
    list: async (): Promise<DescriptionMapping[]> => {
        const { data } = await api.get<DescriptionMapping[]>(BASE);
        return data;
    },

    getById: async (id: number): Promise<DescriptionMapping> => {
        const { data } = await api.get<DescriptionMapping>(`${BASE}/${id}`);
        return data;
    },

    create: async (input: DescriptionMappingInput): Promise<DescriptionMapping> => {
        const { data } = await api.post<DescriptionMapping>(BASE, input);
        return data;
    },

    update: async (id: number, input: DescriptionMappingInput): Promise<DescriptionMapping> => {
        const { data } = await api.put<DescriptionMapping>(`${BASE}/${id}`, input);
        return data;
    },

    remove: async (id: number): Promise<void> => {
        await api.delete(`${BASE}/${id}`);
    },

    reorder: async (ids: number[]): Promise<DescriptionMapping[]> => {
        const body: DescriptionMappingReorderInput = { ids };
        const { data } = await api.put<DescriptionMapping[]>(`${BASE}/order`, body);
        return data;
    },

    loadDefaults: async (): Promise<DescriptionMapping[]> => {
        const { data } = await api.post<DescriptionMapping[]>(`${BASE}/defaults`);
        return data;
    },

    preview: async (description: string): Promise<DescriptionMappingPreview> => {
        const { data } = await api.get<DescriptionMappingPreview>(
            `${BASE}/preview?description=${encodeURIComponent(description)}`
        );
        return data;
    }
};
