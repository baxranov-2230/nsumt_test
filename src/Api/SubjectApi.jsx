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

export const detailSubjectApi = async (subjectId) => {
    const response = await axiosOrganization.get(`/subjects/get/${subjectId}`);
    return response.data;
};
export const UpdateSubjectApi = async (subjectData) => {
    const response = await axiosOrganization.put(
        `/subjects/update/${subjectData?.subjectId}`,
        {
            name: subjectData.name
        }
    );
    return response.data;
};