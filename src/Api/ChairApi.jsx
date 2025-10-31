
import axiosOrganization from './axiosOrganization.jsx'
export const GetAllChairApi = async () => {
    const response = await axiosOrganization.get(`/chairs`);
    return response.data;
};