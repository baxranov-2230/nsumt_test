import axiosInstance from "./axiosTest.jsx";
import axiosOrganization from "./axiosOrganization.jsx";

export const GetResultByFiledApi = async ({
                                              quiz_id = null
                                          }) => {
    try {
        const params = new URLSearchParams();
        params.append("quiz_id", quiz_id);


        const response = await axiosInstance.get(
            `/result/get_by_filed?${params.toString()}`
        );
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            return null;
        }
        throw error;
    }
};