"use client";

import { useState, useCallback } from "react";
import { InstallmentPieData } from "@/types/installment-percentage";
import { getInstallmentPercentage } from "@/services/installment-service";

export function useInstallmentPercentage() {
    const [data, setData] = useState<InstallmentPieData[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchInstallment = useCallback(async (year: number, month: number) => {
        setLoading(true);
        try {
            const result = await getInstallmentPercentage(month, year);

            const formattedData: InstallmentPieData[] = [
                {
                    name: "Parcelado",
                    percentage: result.installmentPercentage
                },
                {
                    name: "À Vista",
                    percentage: result.nonInstallmentPercentage
                }
            ];

            setData(formattedData);
        } catch {
            setData([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const resetInstallment = useCallback(() => {
        setData([]);
    }, []);

    return {
        installmentData: data,
        loadingInstallment: loading,
        fetchInstallment,
        resetInstallment
    };
}