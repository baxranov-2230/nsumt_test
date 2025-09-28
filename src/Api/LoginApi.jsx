import axios from "axios";


const API_URL = import.meta.env.VITE_ORGANIZATION_API_URL;

import axiosInstance from "./axiosinstance";

export const saveTokens = (accessToken) => {
    localStorage.setItem(
        "token",
        JSON.stringify({access_token: accessToken})
    );
};

export const LoginApi = async (loginData) => {
    const response = await axios.post(
        `${API_URL}/auth/login`,
        {
            username: loginData.username,
            password: loginData.password,
        },
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    if (response.data.access_token) {
        const {access_token} = response.data;
        saveTokens(access_token);
    }

    return response.data;
};
