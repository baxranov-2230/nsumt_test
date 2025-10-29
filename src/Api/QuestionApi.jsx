import axiosInstance from './axiosTest.jsx'


const API_URL = import.meta.env.VITE_TEST_API_URL

export const CreateQuestionApi = async (questionData) => {
    try {
        const formData = new FormData();
        formData.append("text", questionData.text || "");
        if (questionData.image) {
            formData.append('image', questionData.image);
        }
        formData.append("option_a", questionData.option_a || "");
        if (questionData.option_a_image) {
            formData.append('option_a_image', questionData.option_a_image);
        }
        formData.append("option_b", questionData.option_b || "");
        if (questionData.option_b_image) {
            formData.append('option_b_image', questionData.option_b_image);
        }
        formData.append("option_c", questionData.option_c || "");
        if (questionData.option_c_image) {
            formData.append('option_c_image', questionData.option_c_image);
        }
        formData.append("option_d", questionData.option_d || "");
        if (questionData.option_d_image) {
            formData.append('option_d_image', questionData.option_d_image);
        }
        formData.append("subject_id", questionData.subjectId || "");

        console.log(formData)
        const response = await axiosInstance.post(
            `${API_URL}/questions/create`, formData,
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

export const GetAllQuestionApi = async () => {
    try {
        const response = await axiosInstance.get(`${API_URL}/questions`);
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
        `${API_URL}/questions/delete/${questionId}`
    );
    return response.data;
};

