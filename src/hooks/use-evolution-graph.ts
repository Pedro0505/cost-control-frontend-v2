import { useState, useCallback, useEffect } from "react";
import { graphService } from "@/services/graph-service";
import { toast } from "sonner";
import { EvolutionChartPoint, EvolutionGraphState, ExpenseEvolutionData } from "@/types/expense-graph";

export function useEvolutionGraph() {
    const [loading, setLoading] = useState(false);
    const [graphState, setGraphState] = useState<EvolutionGraphState>({
        data: [],
        categories: []
    });

    const processData = (rawData: ExpenseEvolutionData[]): EvolutionGraphState => {
        const uniqueCategories = Array.from(new Set(rawData.map(item => item.category))).slice(0, 8);

        const groupedByDate = rawData.reduce<Record<string, EvolutionChartPoint>>((acc, curr) => {
            const dateKey = `${curr.year}-${curr.month.toString().padStart(2, '0')}`;
            const label = `${curr.month.toString().padStart(2, '0')}/${curr.year}`;

            if (!acc[dateKey]) {
                acc[dateKey] = {
                    dateLabel: label,
                    originalDate: dateKey
                };
            }

            if (uniqueCategories.includes(curr.category)) {
                acc[dateKey][curr.category] = curr.total;
            }

            return acc;
        }, {});

        const sortedData = Object.values(groupedByDate).sort((a, b) =>
            a.originalDate.localeCompare(b.originalDate)
        );

        const normalizedData = sortedData.map(point => {
            const newPoint = { ...point };
            uniqueCategories.forEach(cat => {
                if (newPoint[cat] === undefined) {
                    newPoint[cat] = 0;
                }
            });
            return newPoint;
        });

        return {
            data: normalizedData,
            categories: uniqueCategories
        };
    };

    const fetchEvolutionData = useCallback(async () => {
        setLoading(true);
        try {
            const result = await graphService.getTopExpensesEvolution();
            const processed = processData(result);
            setGraphState(processed);
        } catch {
            toast.error("Erro ao carregar a evolução das despesas.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEvolutionData();
    }, [fetchEvolutionData]);

    return {
        data: graphState.data,
        categories: graphState.categories,
        loading,
        refetch: fetchEvolutionData
    };
}
