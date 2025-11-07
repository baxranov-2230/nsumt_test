import React, {useState} from "react";
import {useQuery, useMutation} from "@tanstack/react-query";
// import {DeleteCategory, GetAllCategory} from "../../Api/CategoryApi.jsx";
import toast from "react-hot-toast";
import {Link} from "react-router-dom";
import {FaRegEdit} from "react-icons/fa";
import {MdDelete} from "react-icons/md";

import {
    DeleteQuestionApi,
    GetAllQuestionApi,
} from "../../Api/QuestionApi.jsx";
import {GetAllSubjectApi} from "../../Api/SubjectApi.jsx";
import {DeleteQuizApi, GetAllQuizApi} from "../../Api/QuizApi.jsx";

function ListQuiz() {
    const [isModalOpen, setIsModalOpen] = useState(null);
    const [limit, setLimit] = useState(20);
    const [offset, setOffset] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    // const {isError, isSuccess, isLoading, data, error, refetch} = useQuery({
    //     queryKey: ["list-question", limitQuestion, offsetQuestion],
    //     queryFn: () => GetAllQuestionApi({
    //         limit: limitQuestion,
    //         offset: offsetQuestion
    //     }),
    // });
    const {data: quiz_data} = useQuery({
        queryKey: ["list-quiz", limit, offset, searchTerm],
        queryFn: () =>
            GetAllQuizApi({
                limit,
                offset,
                search: searchTerm,
            }),
    });

    const quizMutation = useMutation({
        mutationKey: ["delete-quiz"],
        mutationFn: DeleteQuizApi,
        onSuccess: (data) => {
            toast.success(data.message || "Quiz muvaffaqiyatli o'chirildi");
            window.location.reload();
        },
        onError: (error) => {
            toast.error(error.message || "Xatolik yuz berdi");
        },
    });

    const handleDeleteClick = (quizId) => {
        setIsModalOpen(quizId); // Modalni ochish
    };

    const deleteHandler = async (quizId) => {
        quizMutation
            .mutateAsync(quizId)
            .then(() => {
                refetch();
            })
            .catch((e) => console.log(e));
    };
    const cancelDelete = () => {
        setIsModalOpen(null); // Modalni bekor qilish
    };

    const totalCount = quiz_data?.total || 0;
    const totalPages = Math.ceil(totalCount / limit);
    const currentPage = Math.floor(offset / limit) + 1;

    const nextPage = () => {
        if (offset + limit < totalCount) setOffset((prev) => prev + limit);
    };

    const prevPage = () => {
        if (offset > 0) setOffset((prev) => Math.max(prev - limit, 0));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Savollar</h2>
                <div>
                    <Link to="/create-quiz" className="btn btn-primary mr-3">
                        Savol qo'shish
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow">
                <div className="p-4">
                    <table className="w-full">
                        <thead>
                        <tr className="text-left bg-gray-50">
                            <th className="p-3 text-gray-600">№</th>
                            <th className="p-3 text-gray-600"> O'qituvchi</th>
                            <th className="p-3 text-gray-600">Fan</th>
                            <th className="p-3 text-gray-600">Guruh</th>
                            <th className="p-3 text-gray-600">Boshlanish vaqti</th>
                            <th className="p-3 text-gray-600 text-center">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {quiz_data?.data?.map((quiz, index) => {
                            // const subjectName =
                            //     subject_data?.data?.find(
                            //         (subj) => subj.id === question.subject_id
                            //     )?.name || "Noma'lum fan";

                            return (
                                <tr className="border-t" key={quiz?.id}>
                                    <td className="p-3 ">{index + 1}</td>
                                    <td className="p-3 ">{quiz?.teacher_first_name} {quiz?.teacher_last_name}</td>
                                    <td className="p-3 ">{quiz?.subject_name}</td>
                                    <td className="p-3 ">{quiz?.group_name}</td>
                                    <td className="p-3 ">{quiz?.start_time.split("T")[0]}</td>

                                    {/*<td className="p-3">{subjectName}</td>*/}
                                    {/*<td className="p-3">{category?.category_name_en}</td>*/}
                                    <td className="p-3">
                                        <div className="flex justify-center">
                                            {/* <Link
                          className=" flex items-center justify-start   pr-8"
                          to={`/update-subject/${employee?.id}`}
                        >
                          <button>
                            <FaRegEdit className="text-2xl text-[#3697A5]" />
                          </button>
                        </Link> */}
                                            <button
                                                className="flex items-center justify-start  "
                                                // onClick={() => deleteHandler(faculty?.id)}
                                                onClick={() => handleDeleteClick(quiz?.quiz_id)}
                                            >
                                                <MdDelete className="text-2xl text-red-600"/>
                                            </button>
                                            {isModalOpen === quiz?.quiz_id && (
                                                <div
                                                    className="fixed inset-0 flex items-center justify-center bg-gray-500/50">
                                                    <div className="bg-white p-6 rounded-lg shadow-lg">
                                                        <h2 className="text-lg font-semibold mb-4">
                                                            Haqiqatan ham o‘chirmoqchimisiz?
                                                        </h2>
                                                        <p className="mb-6">
                                <span className="text-red-600">
                                  {quiz?.quiz_name || "Bu element"}
                                </span>{" "}
                                                            ni o‘chirishni tasdiqlaysizmi?
                                                        </p>
                                                        <div className="flex justify-end gap-4">
                                                            <button
                                                                className="px-4 py-2 bg-gray-300 rounded "
                                                                onClick={cancelDelete}
                                                            >
                                                                Bekor qilish
                                                            </button>
                                                            <button
                                                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                                                onClick={() => deleteHandler(quiz?.quiz_id)}
                                                            >
                                                                O‘chirish
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
                {/* 🔹 Pagination tugmalari */}
                <div className="flex justify-between items-center px-20 pb-4">
                    <button
                        onClick={prevPage}
                        disabled={offset === 0}
                        className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
                    >
                        Oldingi
                    </button>

                    <span className="text-sm text-gray-600">
          Sahifa: {currentPage} / {totalPages || 1}
        </span>

                    <button
                        onClick={nextPage}
                        disabled={offset + limit >= totalCount}
                        className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
                    >
                        Keyingi
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ListQuiz;
