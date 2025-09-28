import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = import.meta.env.VITE_TEST_API_URL;

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Token muddati tugaganini tekshirish
export const isTokenExpired = (token) => {
    if (!token) return true;
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
};

axiosInstance.interceptors.request.use(
    (config) => {
        const token = JSON.parse(localStorage.getItem("token"));

        if (token?.access_token) {
            if (isTokenExpired(token.access_token)) {
                localStorage.removeItem("token");
                window.location.href = "/login"; // Navigate o‘rniga
                return Promise.reject(new Error("Token expired"));
            } else {
                config.headers.Authorization = `Bearer ${token.access_token}`;
            }
        } else {
            localStorage.removeItem("token");
            window.location.href = "/login"; // Navigate o‘rniga
            return Promise.reject(new Error("No token"));
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
