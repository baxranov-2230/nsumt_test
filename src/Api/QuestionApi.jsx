import axiosInstance from "./axiosTest.jsx";
import axiosOrganization from "./axiosOrganization.jsx";

const API_URL = import.meta.env.VITE_TEST_API_URL;

export const CreateQuestionApi = async (questionData) => {
  try {
    const formData = new FormData();
    formData.append("text", questionData.text || "");
    formData.append("option_a", questionData.option_a || "");
    formData.append("option_b", questionData.option_b || "");
    formData.append("option_c", questionData.option_c || "");
    formData.append("option_d", questionData.option_d || "");
    formData.append("subject_id", questionData.subjectId || "");

    console.log(formData);
    const response = await axiosInstance.post(`/questions/create`, formData);
    console.log("Serverdan kelgan javob:", response.data);
    return await response.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.response.data.detail);
  }
};

// export const GetAllQuestionApi = async () => {
//   try {
//     const response = await axiosInstance.get(`/questions`);
//     return response.data;
//   } catch (error) {
//     if (error.response && error.response.status === 400) {
//       console.warn("Savollar mavjud emas (400 xato, lekin bu normal holat).");
//       return [];
//     }
//     throw error;
//   }
// };

export const GetAllQuestionApi = async ({
                                         limit = 20,
                                         offset = 0,

                                       }) => {
  try {
    const params = new URLSearchParams();
    params.append("limit", limit);
    params.append("offset", offset);

    // Agar qidiruv bo'lsa — search param qo'shiladi
    // if (search) {
    //   params.append("search", search);
    // }

    const response = await axiosInstance.get(
        `/questions?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};


export const DeleteQuestionApi = async (questionId) => {
  const response = await axiosInstance.delete(
    `/questions/delete/${questionId}`
  );
  return response.data;
};

export const CreateQuestionExcelApi = async (questionData) => {
  try {
    const formData = new FormData();
    formData.append("subject_id", questionData.subject_id || "");
    if (questionData.file) {
      formData.append("file", questionData.file);
    }
    // console.log(formData)
    const response = await axiosInstance.post(
      `/questions/create/excel?subject_id=${questionData.subject_id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Fayl yuborish uchun zarur sarlavha
        },
      }
    );
    console.log("Serverdan kelgan javob:", response.data);
    return await response.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.response.data.detail);
  }
};
