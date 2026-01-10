import axios from "axios";
import { handleApiError } from "@/utils/error-handler";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL + '/api/v2',
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        handleApiError(error);
        return Promise.reject(error);
    }
);
