import { api } from "@/services/http";
import { AuthCredentials, AuthResponse, RegisterCredentials, UserProfile } from "@/types/auth";

export async function loginUser(credentials: AuthCredentials): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/auth/login", credentials);
    return data;
}

export async function registerUser(credentials: RegisterCredentials): Promise<void> {
    await api.post("/auth/register", credentials);
}

export async function getMe(): Promise<UserProfile> {
    const { data } = await api.get<UserProfile>("/auth/me");
    return data;
}