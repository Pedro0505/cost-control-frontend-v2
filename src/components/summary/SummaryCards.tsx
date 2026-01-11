import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import React from "react";

type SummaryCardProps = {
    title: string;
    value: string;
    color: "green" | "red" | "blue";
    icon: React.ReactNode;
};

const colorMap = {
    green: "text-green-600",
    red: "text-red-600",
    blue: "text-blue-600",
};

const footerLineMap = {
    green: "bg-green-600",
    red: "bg-red-600",
    blue: "bg-blue-600",
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
