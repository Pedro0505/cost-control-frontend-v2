"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/header/Header";

const HIDDEN_ROUTES = ["/login", "/register"];

export function HeaderWrapper() {
    const pathname = usePathname();

    if (HIDDEN_ROUTES.includes(pathname)) {
        return null;
    }

    return <Header />;
}