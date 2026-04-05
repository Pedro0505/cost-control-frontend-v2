import { useState, useEffect, useCallback } from "react";
import { InvoiceChartPoint, InvoiceGraphParams } from "@/types/expense-graph";
import { graphService } from "@/services/graph-service";

export function useInvoiceGraph() {
    const [data, setData] = useState<InvoiceChartPoint[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async (params?: InvoiceGraphParams) => {
        setLoading(true);
        try {
            const response = await graphService.getTotalAmountByMonth(params);
            const formattedData = response.map(item => ({
                dateLabel: new Date(item.invoiceYear, item.invoiceMonth - 1).toLocaleString("pt-BR", { month: "short", year: "2-digit" }),
                originalDate: `${item.invoiceYear}-${String(item.invoiceMonth).padStart(2, "0")}`,
                total: item.total
            })).sort((a, b) => a.originalDate.localeCompare(b.originalDate));

            setData(formattedData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, refetch: fetchData };
}
