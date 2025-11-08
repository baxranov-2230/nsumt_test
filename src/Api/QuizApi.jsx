import axiosInstance from "./axiosTest.jsx";
import axiosOrganization from "./axiosOrganization.jsx";

export const GetAllQuizApi = async ({
                                        limit = 20,
                                        offset = 0,
                                    }) => {
    try {
        const params = new URLSearchParams();
        params.append("limit", limit);
        params.append("offset", offset);

        const response = await axiosInstance.get(
            `/quiz?${params.toString()}`
        );
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            return null;
        }
        throw error;
    }
};

export const DeleteQuizApi = async (quizId) => {
    const response = await axiosInstance.delete(
        `/quiz/delete/${quizId}`
    );
    return response.data;
};

export const CreateQuizApi = async (quizData) => {
    try {
        console.log(quizData);
        const response = await axiosInstance.post(`/quiz/create`, {
            user_id: quizData.user_id,
            subject_id: quizData.subject_id,
            group_id: quizData.group_id,
            quiz_name: quizData.quiz_name,
            question_number: quizData.question_number,
            quiz_time: quizData.quiz_time,
            start_time: quizData.start_time,
            quiz_pin: quizData.quiz_pin
        });

        return await response.data;
    } catch (error) {
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error(error.response.data.detail);
    }
};

export const startQuizApi = async ({quiz_id, quiz_pin}) => {
    try {
        const params = new URLSearchParams();
        params.append("quiz_id", quiz_id);
        params.append("quiz_pin", quiz_pin);

        const response = await axiosInstance.get(
            `/quiz_process/start?${params.toString()}`
        );
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            return null;
        }
        throw error;
    }
};

export const submitQuizApi = async (data) => {
    console.log(data);
    try {
        const response = await axiosInstance.post("/quiz_process/end", data);
        return response.data;
    } catch (error) {
        console.error("Submit error:", error);
        throw error;
    }
};
