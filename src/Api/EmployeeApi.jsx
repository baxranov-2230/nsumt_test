import axiosInstance from './axiosinstance'
import axiosInstancePost from './axiosinstance'

const API_URL = import.meta.env.VITE_API_URL


export const GetListEmployeeApi = async () => {
    try {
        const response = await axiosInstance.get(`${API_URL}/users`,);
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            return null;
        }
        throw error;
    }
};

export const CreateEmployeeApi = async (employeeData) => {
    try {
        const formData = new FormData();
        formData.append("username", employeeData.username  || "");
        formData.append("first_name", employeeData.first_name || "");
        formData.append("last_name", employeeData.last_name || "");
        formData.append("third_name", employeeData.third_name || "");
        formData.append("passport_serial", employeeData.passport_serial || "");
        formData.append("department", employeeData.department || "");
        if (employeeData.file) {
            formData.append('file', employeeData.file);
        }
        console.log(formData)
        const response = await axiosInstance.post(
            `${API_URL}/users/create`, formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data", // Fayl yuborish uchun zarur sarlavha
                },
            }
        );
        console.log("Serverdan kelgan javob:", response.data)
        return await response.data;
    } catch (error) {
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error(error.response.data.detail);
    }
};

export const DeleteEmployeeApi = async (employeeId) => {
    const response = await axiosInstance.delete(
        `${API_URL}/users/delete/${employeeId}`
    );
    return response.data;
};
//
// export const UpdateStudyDirectionApi = async ({id, studyDirectionData}) => {
//     console.log(id, studyDirectionData)
//     const response = await axiosInstance.put(
//         `${API_URL}/api/study_direction/update/${id}`,
//         {
//             name: studyDirectionData.name,
//             exam_title: studyDirectionData.exam_title,
//             education_years: studyDirectionData.education_years,
//             contract_sum: studyDirectionData.contract_sum,
//             study_code: studyDirectionData.study_code,
//             study_form_id: studyDirectionData.study_form_id
//         },
//         {
//             headers: {
//                 "Content-Type": "application/json",
//             },
//         }
//     );
//     return response.data;
// };