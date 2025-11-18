import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { detailSubjectApi, UpdateSubjectApi } from "../../Api/SubjectApi";

function UpdateSubject() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  // const { isError, isLoading, data: data_faculty, error, refetch } = useQuery({
  //     queryKey: ["list-faculty"],
  //     queryFn: GetAllFaculty,
  // });

  const { data } = useQuery({
    queryKey: ["subject-detail"],
    queryFn: () => detailSubjectApi(subjectId),
  });
  const updateSubjectMutation = useMutation({
    mutationKey: ["update-subject"],
    mutationFn: UpdateSubjectApi,
    onSuccess: (data) => {
      toast.success(data.message || "Fan muvaffaqiyatli o'zgartirildi");
    },
    onError: (error) => {
      toast.error(error.message || "Xatolik yuz berdi");
    },
  });
  const formik = useFormik({
    initialValues: {
      name: data?.name || "",
    },
    enableReinitialize: true, //update qilishda qayta render qiladi 1 ta kechmasligi uchun
    validationSchema: Yup.object({
      name: Yup.string().required("!!! To'ldirish shart"),
    }),
    onSubmit: (values) => {
      // setFormData(values);
      const subjectData = {
        subjectId: subjectId,
        name: values.name,
      };
      updateSubjectMutation.mutate(subjectData);
    },
  });

  const isSuccess = updateSubjectMutation.isSuccess;

  useEffect(() => {
    if (isSuccess) {
      navigate("/list-subject");
    }
  }, [navigate, isSuccess]);
// 🔹 Jodit sozlamalari
  const config = useMemo(
      () => ({
        readonly: false,
        height: 300,
        toolbarButtonSize: "middle",
        style: {
          table: {
            border: "1px solid #ccc",
            "border-collapse": "collapse",
          },
          "td, th": {
            border: "1px solid #ccc",
            padding: "5px",
          },
        },
        uploader: {
          url: `${API_URL}/quiz/upload`,
          insertImageAsBase64URI: false,
          imagesExtensions: ["jpg", "png", "jpeg", "gif"],
          method: "POST",
          format: "json",
          prepareData: function (formData) {
            const file = formData.get("files[0]");
            formData.delete("files[0]");
            formData.append("file", file);
            return formData;
          },
          isSuccess: function (resp) {
            return resp.file_url !== undefined;
          },
          process: function (resp) {
            if (resp.file_url) {
              return { files: [resp.file_url] };
            }
            return { files: [] };
          },
          defaultHandlerSuccess: function (data) {
            if (data.files && data.files[0]) {
              const fileUrl = data.files[0];
              const ext = fileUrl.split(".").pop().toLowerCase();
              let html = "";
              if (["jpg", "jpeg", "png", "gif"].includes(ext)) {
                html = `<img src="${fileUrl}" alt="image" style="max-width:100%">`;
              } else {
                html = `<a href="${fileUrl}" target="_blank">Faylni ochish</a>`;
              }
              this.s.insertHTML(html);
            }
          },
        },
      }),
      []
  );
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Fanni o'zgartirish</h2>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b bg-gray-50  ">
          <form
            onSubmit={formik.handleSubmit}
            className="grid grid-cols-1 gap-3"
          >
            <div className="w-full">
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                O'zgartirilayotgan fan nomi
              </label>
              <input
                type="text"
                id="name"
                name="name"
                {...formik.getFieldProps("name")}
                className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="focus:outline-none w-full text-white bg-[#3697A5] hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
            >
              Qo'shish
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateSubject;
