import { Button } from "@/shadcn/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

export function Pagination({ currentPage, totalPages, onPageChange }: Props) {
    const getVisiblePages = () => {
        const pages: number[] = [];
        const start = Math.max(1, Math.min(currentPage - 1, totalPages - 3));
        const end = Math.min(totalPages - 1, start + 2);

        for (let i = start; i <= end; i++) {
            if (i > 0 && i < totalPages - 1) pages.push(i);
        }
        return pages;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center space-x-1 mt-4">
            <Button
                variant="outline"
                size="icon"
                disabled={currentPage === 0}
                onClick={() => onPageChange(currentPage - 1)}
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
                variant={currentPage === 0 ? "default" : "outline"}
                onClick={() => onPageChange(0)}
            >
                1
            </Button>

            {currentPage > 2 && totalPages > 5 && <span className="px-1">...</span>}

            {getVisiblePages().map((p) => (
                <Button
                    key={p}
                    variant={currentPage === p ? "default" : "outline"}
                    onClick={() => onPageChange(p)}
                >
                    {p + 1}
                </Button>
            ))}

            {currentPage < totalPages - 3 && totalPages > 5 && <span className="px-1">...</span>}

            {totalPages > 1 && (
                <Button
                    variant={currentPage === totalPages - 1 ? "default" : "outline"}
                    onClick={() => onPageChange(totalPages - 1)}
                >
                    {totalPages}
                </Button>
            )}

            <Button
                variant="outline"
                size="icon"
                disabled={currentPage === totalPages - 1}
                onClick={() => onPageChange(currentPage + 1)}
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
}
