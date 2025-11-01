import axiosInstance from "./axiosTest.jsx";

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

export const GetAllQuestionApi = async () => {
  try {
    const response = await axiosInstance.get(`/questions`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.warn("Savollar mavjud emas (400 xato, lekin bu normal holat).");
      return [];
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
      `/questions/create/exel?subject_id=${questionData.subject_id}`,
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
