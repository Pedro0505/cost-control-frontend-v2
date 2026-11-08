import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import React from "react";

type SummaryCardProps = {
    title: string;
    value: string;
    color: "green" | "red" | "blue";
    icon: React.ReactNode;
};

const colorMap = {
    green: "text-green-600 dark:text-green-400",
    red: "text-red-600 dark:text-red-400",
    blue: "text-blue-600 dark:text-blue-400",
};

const footerLineMap = {
    green: "bg-green-600 dark:bg-green-500",
    red: "bg-red-600 dark:bg-red-500",
    blue: "bg-blue-600 dark:bg-blue-500",
};


export function SummaryCard({ title, value, color, icon }: SummaryCardProps) {
    return (
        <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
                <span className={colorMap[color]}>{icon}</span>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
            </CardHeader>

            <CardContent>
                <div className={`text-2xl font-bold ${colorMap[color]}`}>
                    {value}
                </div>
            </CardContent>
            <div
                className={`absolute left-4 right-4 bottom-3 h-1 rounded-full ${footerLineMap[color]}`}
            />
        </Card>
    );
}
