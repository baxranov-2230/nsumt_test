import axiosOrganization from './axiosOrganization.jsx'

export const GetAllTeacher = async () => {
    const response = await axiosOrganization.get(`/teachers`);
    return response.data;
};