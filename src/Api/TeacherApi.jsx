import axiosOrganization from "./axiosOrganization.jsx";

export const CreateUserApi = async (userData) => {
  try {
    const response = await axiosOrganization.post(`/auth/register`, {
      username: userData.username,
      password: userData.password,
    });

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
    const response = await axiosOrganization.post(`/teachers/create`, {
      user_id: userData.user_id,
      chair_id: userData.chair_id,
      first_name: userData.first_name,
      last_name: userData.last_name,
      patronymic: userData.patronymic,
    });

    return await response.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.response.data.detail);
  }
};

// export const GetAllTeacher = async () => {
//   const response = await axiosOrganization.get(`/teachers`);
//   return response.data;
// };

export const GetAllTeacher = async ({ limit = 20, offset = 0, search = "" }) => {
  try {
    const params = new URLSearchParams();
    params.append("limit", limit);
    params.append("offset", offset);
    if (search) params.append("search", search);

    const res = await axiosOrganization.get(`/teachers?${params.toString()}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};


export const DeleteUserApi = async (userId) => {
  const response = await axiosOrganization.delete(`/user/delete/${userId}`);
  return response.data;
};

export const AssignTeacherSubjectApi = async (teacherAssignSubjectData) => {
  const response = await axiosOrganization.post(`/subjects/assign_teacher`, {
    subject_id: teacherAssignSubjectData.subject_id,
    teacher_id: teacherAssignSubjectData.teacher_id,
  });
  console.log(response.data);
  return response.data;
};
export const detailTeacherApi = async (teacherId) => {
  const response = await axiosOrganization.get(`/teachers/get/${teacherId}`, {
    params: { teacher_id: Number(teacherId) },
  });
  console.log(response.data);
  return response.data;
};
// export const UpdateSubjectApi = async (subjectData) => {
//     const response = await axiosOrganization.put(
//         `/subjects/update/${subjectData?.subjectId}`,
//         {
//             name: subjectData.name
//         }
//     );
//     return response.data;
// };
