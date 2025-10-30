import axiosOrganization from './axiosOrganization.jsx'

export const GetAllTeacher = async () => {
    const response = await axiosOrganization.get(`/teachers`);
    return response.data;
};


export const DeleteTeacherApi = async (teacherId) => {
    const response = await axiosOrganization.delete(
        `/teachers/delete/${teacherId}`
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