import axiosOrganization from "./axiosOrganization.jsx";

export const GetAllGroupApi = async ({
                                           limit = 20,
                                           offset = 0,
                                           search = "",
                                       }) => {
    try {
        const params = new URLSearchParams();
        params.append("limit", limit);
        params.append("offset", offset);

        // Agar qidiruv bo'lsa — search param qo'shiladi
        if (search) {
            params.append("search", search);
        }

        const response = await axiosOrganization.get(
            `/groups?${params.toString()}`
        );
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            return null;
        }
        throw error;
    }
};