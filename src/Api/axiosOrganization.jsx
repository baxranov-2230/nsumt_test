import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = import.meta.env.VITE_ORGANIZATION_API_URL;

const axiosOrganization = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// Token expired bo‘lsa tekshirish
const isTokenExpired = (token) => {
    if (!token) return true;
    const decoded = jwtDecode(token);
    return decoded.exp < Date.now() / 1000;
};

axiosOrganization.interceptors.request.use((config) => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token?.access_token) {
        if (isTokenExpired(token.access_token)) {
            localStorage.removeItem("token");
            window.location.href = "/login"; // Router Navigate emas, axios interceptor ichida router ishlamaydi
        } else {
            config.headers.Authorization = `Bearer ${token.access_token}`;
        }
    }
    return config;
});

export default axiosOrganization;
