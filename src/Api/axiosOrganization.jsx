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
    console.log(token);
    if (token?.access_token) {
        if (isTokenExpired(token?.access_token)) {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        else {
            // config.headers.Authorization = `ApiKey ${token.access_token}`;
            // config.headers["X-API-KEY"] = token.access_token;
            config.headers.Authorization = token.access_token;
        }
    }
    return config;
});

export default axiosOrganization;
