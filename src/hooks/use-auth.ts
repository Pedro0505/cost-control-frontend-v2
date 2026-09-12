"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { AuthCredentials, RegisterCredentials } from "@/types/auth";
import { loginUser, registerUser } from "@/services/auth-service";

export function useAuth() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const saveToken = (token: string) => {
        Cookies.set("auth_token", token, { expires: 1, path: "/" });
    };

    const login = async (credentials: AuthCredentials) => {
        setLoading(true);
        try {
            const response = await loginUser(credentials);
            saveToken(response.token);
            router.push("/");
        } finally {
            setLoading(false);
        }
    };

    const register = async (credentials: RegisterCredentials) => {
        setLoading(true);
        try {
            await registerUser(credentials);
            return true;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        Cookies.remove("auth_token");
        router.push("/login");
    };

    return {
        login,
        register,
        logout,
        loading
    };
}
