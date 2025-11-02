import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { DeleteUserApi, GetAllTeacher } from "../../Api/TeacherApi";
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";

function ListTeacher() {
  const [isModalOpen, setIsModalOpen] = useState(null);
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState("");

  // 🔹 API chaqiruv — limit, offset, search qo‘llanilgan
  const { data: teacher_data, refetch } = useQuery({
    queryKey: ["list-teacher", limit, offset, searchTerm],
    queryFn: () =>
      GetAllTeacher({
        limit,
        offset,
        search: searchTerm,
      }),
  });

  const teacherMutation = useMutation({
    mutationKey: ["teacher-delete"],
    mutationFn: DeleteUserApi,
    onSuccess: (data) => {
      toast.success(data.message || "O'qituvchi muvaffaqiyatli o'chirildi");
      setIsModalOpen(null);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Xatolik yuz berdi");
    },
  });

  const handleDeleteClick = (teacherId) => {
    setIsModalOpen(teacherId);
  };

  const deleteHandler = async (teacherId) => {
    teacherMutation
      .mutateAsync(teacherId)
      .then(() => refetch())
      .catch((e) => console.log(e));
  };

  const cancelDelete = () => {
    setIsModalOpen(null);
  };

  // 🔹 Pagination hisoblash
  const totalCount = teacher_data?.total || 0;
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
        <h2 className="text-2xl font-bold text-gray-800">
          O'qituvchilar ro'yxati
        </h2>
        <Link to="/register" className="btn btn-primary">
          Qo'shish
        </Link>
      </div>

      {/* 🔹 Qidiruv paneli */}
      <div className="w-full flex mb-4">
        <input
          type="text"
          placeholder="Ism yoki familiya orqali qidirish..."
          className="border px-3 py-2 rounded w-full mr-2"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          onClick={() => {
            setSearchTerm(inputValue);
            setOffset(0);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Qidirish
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <table className="w-full">
          <thead>
            <tr className="text-left bg-gray-50">
              <th className="p-3 text-gray-600">N</th>
              <th className="p-3 text-gray-600">F.I.O</th>
              <th className="p-3 text-gray-600 text-center">Amal</th>
            </tr>
          </thead>
          <tbody>
            {teacher_data?.data?.length > 0 ? (
              teacher_data?.data?.map((teacher, index) => (
                <tr className="border-t" key={teacher?.id}>
                  <td className="p-3">{offset + index + 1}</td>
                  <td className="p-3">
                    {teacher?.last_name} {teacher?.first_name}{" "}
                    {teacher?.patronymic}
                  </td>
                  <td className="p-3">
                    <div className="flex justify-center items-center gap-4">
                      <Link to={`/assign-teacher-subject/${teacher?.id}`}>
                        <FaRegEdit className="text-2xl text-[#3697A5]" />
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(teacher?.user_id)}
                      >
                        <MdDelete className="text-2xl text-red-600" />
                      </button>

                      {isModalOpen === teacher?.user_id && (
                        <div className="fixed inset-0 flex items-center justify-center bg-gray-500/50">
                          <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-lg font-semibold mb-4">
                              Haqiqatan ham o‘chirmoqchimisiz?
                            </h2>
                            <p className="mb-6">
                              <span className="text-red-600">
                                {teacher?.last_name} {teacher?.first_name}
                              </span>{" "}
                              ni o‘chirishni tasdiqlaysizmi?
                            </p>
                            <div className="flex justify-end gap-4">
                              <button
                                className="px-4 py-2 bg-gray-300 rounded"
                                onClick={cancelDelete}
                              >
                                Bekor qilish
                              </button>
                              <button
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                onClick={() => deleteHandler(teacher?.user_id)}
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
              ))
            ) : (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan={3}>
                  Ma'lumot topilmadi
                </td>
              </tr>
            )}
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
  );
}

export default ListTeacher;
