import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { DeleteTeacherApi, GetAllTeacher } from "../../Api/TeacherApi";
import { MdDelete } from "react-icons/md";

function ListTeacher() {
  const [isModalOpen, setIsModalOpen] = useState(null);
  const { data: teacher_data } = useQuery({
    queryKey: ["list-teacher"],
    queryFn: GetAllTeacher,
  });

  const teacherMutation = useMutation({
    mutationKey: ["teacher-delete"],
    mutationFn: DeleteTeacherApi,
    onSuccess: (data) => {
      toast.success(data.message || "O'qituvchi muvaffaqiyatli o'chirildi");
      setIsModalOpen(null);
    },
    onError: (error) => {
      toast.error(error.message || "Xatolik yuz berdi");
    },
  });

  const handleDeleteClick = (subjectId) => {
    setIsModalOpen(subjectId); // Modalni ochish
  };

  const deleteHandler = async (subjectId) => {
    teacherMutation
      .mutateAsync(subjectId)
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">O'qituvchilar ro'yxati</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {/* {teacher_data?.map((teacher) => {
          return (
            <div key={teacher.id}>
              <h1>
                {teacher.first_name} {teacher.last_name} {teacher.patronymic}
              </h1>
            </div>
          );
        })} */}

        <table className="w-full">
          <thead>
            <tr className="text-left bg-gray-50">
              <th className="p-3 text-gray-600">N</th>
              <th className="p-3 text-gray-600">F.I.O</th>

              <th className="p-3 text-gray-600 flex justify-center ">Action</th>
            </tr>
          </thead>
          <tbody>
            {teacher_data?.map((teacher, index) => {
              return (
                <tr className="border-t" key={teacher?.id}>
                  <td className="p-3 ">{index + 1}</td>
                  <td className="p-3 ">
                    {teacher?.last_name} {teacher?.first_name}{" "}
                    {teacher?.patronymic}{" "}
                  </td>
                  <td className="p-3">
                    <div className="flex justify-center">
                      {/* <Link
                        className=" flex items-center justify-start   pr-8"
                        to={`/update-subject/${teacher?.id}`}
                      >
                        <button>
                          <FaRegEdit className="text-2xl text-[#3697A5]" />
                        </button>
                      </Link> */}
                      <button
                        className="flex items-center justify-start  "
                        onClick={() => handleDeleteClick(teacher?.id)}
                      >
                        <MdDelete className="text-2xl text-red-600" />
                      </button>
                      {isModalOpen === teacher?.id && (
                        <div className="fixed inset-0 flex items-center justify-center bg-gray-500/50">
                          <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-lg font-semibold mb-4">
                              Haqiqatan ham o‘chirmoqchimisiz?
                            </h2>
                            <p className="mb-6">
                              <span className="text-red-600">
                                {teacher?.name || "Bu element"}
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
                                onClick={() => deleteHandler(teacher?.id)}
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
  );
}

export default ListTeacher;
