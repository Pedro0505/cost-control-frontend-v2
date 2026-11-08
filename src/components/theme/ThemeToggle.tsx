"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Check, Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/shadcn/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shadcn/ui/dropdown-menu";

const OPTIONS = [
    { value: "light", label: "Claro", icon: Sun },
    { value: "dark", label: "Escuro", icon: Moon },
    { value: "system", label: "Sistema", icon: Monitor },
] as const;

type Props = {
    className?: string;
};

export function ThemeToggle({ className }: Props) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // O tema salvo só é conhecido no cliente; evita marcar a opção errada na hidratação.
    useEffect(() => setMounted(true), []);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    title="Alterar tema"
                    className={cn(
                        "relative h-9 w-9 rounded-full bg-card text-muted-foreground shadow-sm hover:text-foreground",
                        className
                    )}
                >
                    {/* Os ícones trocam via CSS, então não há "piscar" antes da hidratação */}
                    <Sun className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-transform duration-300 dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-transform duration-300 dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Alterar tema</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 rounded-xl p-1 shadow-lg">
                <DropdownMenuLabel className="px-3 py-1.5 text-xs font-medium text-muted-foreground">
                    Aparência
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-1" />
                {OPTIONS.map(({ value, label, icon: Icon }) => {
                    const selected = mounted && theme === value;
                    return (
                        <DropdownMenuItem
                            key={value}
                            onClick={() => setTheme(value)}
                            aria-checked={selected}
                            role="menuitemradio"
                            className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm"
                        >
                            <Icon className="h-4 w-4" />
                            <span className="flex-1">{label}</span>
                            {selected && <Check className="h-4 w-4 text-primary" />}
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
