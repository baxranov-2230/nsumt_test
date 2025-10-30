import axiosOrganization from './axiosOrganization.jsx'

const API_URL = import.meta.env.VITE_ORGANIZATION_API_URL

export const CreateSubjectApi = async (subjectData) => {
    try {
        const response = await axiosOrganization.post(
            `/subjects/create`,
            {
                name: subjectData.name
            },
        );

        return await response.data;
    } catch (error) {
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error(error.response.data.detail);
    }
};

export const GetAllSubjectApi = async () => {
    const allSubject = await axiosOrganization.get(`/subjects`);
    return allSubject.data;
};

export const DeleteSubjectApi = async (subjectId) => {
    const response = await axiosOrganization.delete(
        `/subjects/delete/${subjectId}`
    );
    return response.data;
};
// export const detailDepartment = async (departmentId) => {
//     const department = await axiosInstance.get(`${API_URL}/department/department_detail/${departmentId}`, {});
//     return department.data;
// };
export const UpdateSubjectApi = async (subjectData) => {
    const response = await axiosOrganization.put(
        `${API_URL}/subjects/update/${subjectData?.subjectId}`,
        {
            name: subjectData.name
        }
    );
    return response.data;
};