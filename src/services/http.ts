import axios from "axios";
import Cookies from "js-cookie";
import { handleApiError } from "@/utils/error-handler";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL + "/api/v2"
});

api.interceptors.request.use((config) => {
    const token = Cookies.get("auth_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && typeof window !== "undefined") {
            Cookies.remove("auth_token");
            window.location.href = "/login";
        }
        handleApiError(error);
        return Promise.reject(error);
    }
);
