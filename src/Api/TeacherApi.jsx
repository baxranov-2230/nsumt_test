import axiosOrganization from './axiosOrganization.jsx'


export const CreateUserApi = async (userData) => {
    try {
        const response = await axiosOrganization.post(
            `/auth/register`,
            {
                username: userData.username,
                password: userData.password,
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

export const CreateTeacherApi = async (userData) => {
    try {
        const response = await axiosOrganization.post(
            `/teachers/create`,
            {
                user_id: userData.user_id,
                chair_id: userData.chair_id,
                first_name: userData.first_name,
                last_name: userData.last_name,
                patronymic: userData.patronymic
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

export const GetAllTeacher = async () => {
    const response = await axiosOrganization.get(`/teachers`);
    return response.data;

};


export const DeleteUserApi = async (userId) => {
    const response = await axiosOrganization.delete(
        `/user/delete/${userId}`
    );
    return response.data;
};
// export const detailSubjectApi = async (subjectId) => {
//     const response = await axiosOrganization.get(`/subjects/get/${subjectId}`);
//     return response.data;
// };
// export const UpdateSubjectApi = async (subjectData) => {
//     const response = await axiosOrganization.put(
//         `/subjects/update/${subjectData?.subjectId}`,
//         {
//             name: subjectData.name
//         }
//     );
//     return response.data;
// };

