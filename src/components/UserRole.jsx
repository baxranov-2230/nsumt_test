import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const useUserRole = () => {
    const [userRole, setUserRole] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decoded = jwtDecode(token);
            setUserRole(decoded?.role?.[0]);
        } else {
            setUserRole(null);
        }
    }, [localStorage.getItem("token")]);

    return userRole;
};
