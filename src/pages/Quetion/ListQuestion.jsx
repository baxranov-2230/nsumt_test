import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
// import {DeleteCategory, GetAllCategory} from "../../Api/CategoryApi.jsx";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import {
  DeleteQuestionApi,
  GetAllQuestionApi,
} from "../../Api/QuestionApi.jsx";
import { GetAllSubjectApi } from "../../Api/SubjectApi.jsx";

function ListQuestion() {
  const [isModalOpen, setIsModalOpen] = useState(null);
  const [limit, setLimit] = useState(500);
  const [offset, setOffset] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const { isError, isSuccess, isLoading, data, error, refetch } = useQuery({
    queryKey: ["list-question"],
    queryFn: GetAllQuestionApi,
  });
  const { data: subject_data } = useQuery({
    queryKey: ["list-subject", limit, offset, searchTerm],
    queryFn: () =>
      GetAllSubjectApi({
        limit,
        offset,
        search: searchTerm,
      }),
  });

  const questionMutation = useMutation({
    mutationKey: ["delete-question"],
    mutationFn: DeleteQuestionApi,
    onSuccess: (data) => {
      toast.success(data.message || "Savol muvaffaqiyatli o'chirildi");
      window.location.reload();
    },
    onError: (error) => {
      toast.error(error.message || "Xatolik yuz berdi");
    },
  });

  const handleDeleteClick = (questionId) => {
    setIsModalOpen(questionId); // Modalni ochish
  };

  const deleteHandler = async (questionId) => {
    questionMutation
      .mutateAsync(questionId)
      .then(() => {
        refetch();
      })
      .catch((e) => console.log(e));
  };
  const cancelDelete = () => {
    setIsModalOpen(null); // Modalni bekor qilish
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Savollar</h2>
        <div>
          <Link to="/create-question" className="btn btn-primary mr-3">
            Savol qo'shish
          </Link>
          <Link to="/create-question-excel" className="btn btn-primary">
            Excelda qo'shish
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4">
          <table className="w-full">
            <thead>
              <tr className="text-left bg-gray-50">
                <th className="p-3 text-gray-600">№</th>
                <th className="p-3 text-gray-600"> Savol</th>
                <th className="p-3 text-gray-600">Fan</th>
                {/*<th className="p-3 text-gray-600">Kategoriya ru</th>*/}
                <th className="p-3 text-gray-600 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((question, index) => {
                const subjectName =
                  subject_data?.data?.find(
                    (subj) => subj.id === question.subject_id
                  )?.name || "Noma'lum fan";
                  
                return (
                  <tr className="border-t" key={question?.id}>
                    <td className="p-3 ">{index + 1}</td>
                    <td className="p-3 ">{question?.text}</td>

                    <td className="p-3">{subjectName}</td>
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
                          onClick={() => handleDeleteClick(question?.id)}
                        >
                          <MdDelete className="text-2xl text-red-600" />
                        </button>
                        {isModalOpen === question?.id && (
                          <div className="fixed inset-0 flex items-center justify-center bg-gray-500/50">
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                              <h2 className="text-lg font-semibold mb-4">
                                Haqiqatan ham o‘chirmoqchimisiz?
                              </h2>
                              <p className="mb-6">
                                <span className="text-red-600">
                                  {question?.text || "Bu element"}
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
                                  onClick={() => deleteHandler(question?.id)}
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
      </div>
    </div>
  );
}

export default ListQuestion;
