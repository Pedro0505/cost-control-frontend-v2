"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
    const pathname = usePathname();

    function NavItem({ href,label }: { href: string; label: string; }) {
        const isActive = pathname === href;

        return (
            <Link
                href={href}
                className={cn(
                    "relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors",
                    isActive && "text-foreground"
                )}
            >
                {label}

                {isActive && (
                    <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
                )}
            </Link>
        );
    }

    return (
        <header className="relative border-b bg-[#F3F3FB] border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Wallet className="h-6 w-6" />
                    <span className="text-sm font-medium">Controle de Finanças</span>
                </div>

                <nav className="flex items-center gap-6">
                    <NavItem href="/" label="Dashboard" />
                    <NavItem
                        href="/credit-card"
                        label="Discriminação do Cartão de Crédito"
                    />
                </nav>
            </div>
        </header>
    );
}
