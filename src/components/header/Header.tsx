"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wallet, User, LogOut, UserCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { getMe } from "@/services/auth-service";
import { UserProfile } from "@/types/auth";
import { Button } from "@/shadcn/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shadcn/ui/dropdown-menu";

export function Header() {
    const pathname = usePathname();
    const { logout } = useAuth();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loadingUser, setLoadingUser] = useState(false);

    useEffect(() => {
        async function fetchUserProfile() {
            setLoadingUser(true);
            try {
                const profile = await getMe();
                setUser(profile);
            } catch {
                setUser(null);
            } finally {
                setLoadingUser(false);
            }
        }

        fetchUserProfile();
    }, []);

    function NavItem({ href, label }: { href: string; label: string }) {
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

                <div className="flex items-center gap-6">
                    <nav className="flex items-center gap-6">
                        <NavItem href="/" label="Dashboard" />
                        <NavItem
                            href="/credit-card"
                            label="Discriminação do Cartão de Crédito"
                        />
                    </nav>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 rounded-full border-slate-200 bg-white text-slate-600 hover:text-slate-900 shadow-sm"
                            >
                                <User className="h-5 w-5" />
                                <span className="sr-only">Menu de usuário</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 bg-white rounded-xl shadow-lg border-slate-100 p-1">
                            <div className="px-3 py-2.5">
                                {loadingUser ? (
                                    <div className="flex items-center justify-center py-1">
                                        <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-sm font-semibold text-slate-900 truncate">
                                            {user?.username || "Usuário"}
                                        </p>
                                        <p className="text-xs text-slate-500 truncate">
                                            {user?.email || ""}
                                        </p>
                                    </>
                                )}
                            </div>

                            <DropdownMenuSeparator className="my-1 bg-slate-100" />

                            <DropdownMenuItem asChild>
                                <Link
                                    href="/profile"
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                                >
                                    <UserCircle className="h-4 w-4" />
                                    Meu Perfil
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="my-1 bg-slate-100" />

                            <DropdownMenuItem
                                onClick={logout}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 rounded-lg cursor-pointer transition-colors hover:!bg-red-600 hover:!text-white focus:!bg-red-600 focus:!text-white"
                            >
                                <LogOut className="h-4 w-4" />
                                Sair
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}