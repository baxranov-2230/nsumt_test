

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import Select from "react-select";
import { FormControl, InputLabel } from "@mui/material";
import {
  detailSubjectByTeacherApi,
  GetAllSubjectApi,
} from "../../Api/SubjectApi.jsx";
import { CreateQuestionApi } from "../../Api/QuestionApi.jsx";
import JoditEditor from "jodit-react";
import { jwtDecode } from "jwt-decode";

const API_URL = import.meta.env.VITE_TEST_API_URL;

// 🔹 react-select dizayni uchun
const groupStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};
const groupBadgeStyles = {
  backgroundColor: "#EBECF0",
  borderRadius: "2em",
  color: "#172B4D",
  display: "inline-block",
  fontSize: 12,
  fontWeight: "normal",
  lineHeight: "1",
  minWidth: 1,
  padding: "0.16666666666667em 0.5em",
  textAlign: "center",
};
const formatGroupLabel = (data) => (
  <div style={groupStyles}>
    <span>{data.label}</span>
    <span style={groupBadgeStyles}>{data.options.length}</span>
  </div>
);

function CreateQuestion() {
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const [searchValue, setSearchValue] = useState("");
  const [userRole, setUserRole] = useState("");
  const [teacherId, setTeacherId] = useState(null);

  // 🔹 Token orqali foydalanuvchini aniqlash
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) {
      try {
        const decoded = jwtDecode(token.access_token || token);
        setUserRole(decoded?.role?.[0]);
        setTeacherId(decoded?.user_id);
      } catch (error) {
        console.error("Token decode qilishda xatolik:", error);
      }
    } else {
      setUserRole(null);
      setTeacherId(null);
    }
  }, []);

  // 🔹 Agar ADMIN bo‘lsa - barcha fanlar
  const {
    data: subjects_data,
    isLoading: isSubjectsLoading,
    refetch: refetchSubjects,
  } = useQuery({
    queryKey: ["list-subject", searchValue],
    queryFn: () =>
      GetAllSubjectApi({
        limit: 20,
        offset: 0,
        search: searchValue,
      }),
    enabled: userRole === "admin", // faqat admin uchun
  });

  // 🔹 Agar O‘QITUVCHI bo‘lsa - o‘z fanlari
  const {
    data: subject_data_by_teacher,
    isLoading: isTeacherSubjectsLoading,
    refetch: refetchTeacherSubjects,
  } = useQuery({
    queryKey: ["subject-detail-by-teacher", teacherId],
    queryFn: () => detailSubjectByTeacherApi(teacherId),
    enabled: userRole === "teacher" && !!teacherId, // faqat o‘qituvchi uchun
  });

  // 🔹 Savol yaratish mutation
  const questionMutation = useMutation({
    mutationKey: ["create-question"],
    mutationFn: CreateQuestionApi,
    onSuccess: (data) => {
      toast.success(data.message || "Savol muvaffaqiyatli yaratildi");
    },
    onError: (error) => {
      toast.error(error.message || "Xatolik yuz berdi");
    },
  });

  // 🔹 Formik sozlamalari
  const formik = useFormik({
    initialValues: {
      text: "",
      option_a: "",
      option_b: "",
      option_c: "",
      option_d: "",
      subjectId: "",
    },
    validationSchema: Yup.object({
      subjectId: Yup.string().required("Fan tanlanishi shart!"),
      text: Yup.string().required("Savol matni kiritilishi shart!"),
    }),
    onSubmit: (values) => {
      const questionData = {
        text: values.text,
        option_a: values.option_a,
        option_b: values.option_b,
        option_c: values.option_c,
        option_d: values.option_d,
        subjectId: values.subjectId,
      };
      questionMutation.mutate(questionData);
    },
  });

  const isSuccess = questionMutation.isSuccess;
  const isLoading = questionMutation.isLoading;

  useEffect(() => {
    if (isSuccess) {
      navigate("/list-question");
    }
  }, [navigate, isSuccess]);

  // 🔹 react-select ma’lumotini tayyorlash
  let groupedOptions = [];
  if (userRole === "teacher") {
    groupedOptions = [
      {
        label: "Mening fanlarim",
        options:
          subject_data_by_teacher?.map((subject) => ({
            value: subject.id,
            label: subject.name,
          })) || [],
      },
    ];
  } else {
    groupedOptions = [
      {
        label: "Barcha fanlar ro‘yxati",
        options:
          subjects_data?.data?.map((subject) => ({
            value: subject.id,
            label: subject.name,
          })) || [],
      },
    ];
  }

  const selectedOption =
    groupedOptions[0].options.find(
      (opt) => opt.value === formik.values.subjectId
    ) || null;

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
      <h2 className="text-2xl font-bold text-gray-800">Savol qo'shish</h2>
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b bg-gray-50">
          <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 gap-3">
            {/* 🔹 Fan tanlash */}
            <FormControl fullWidth>
              <InputLabel shrink sx={{ mb: 0.5 }}>
                Fanni tanlang
              </InputLabel>
              <Select
                isClearable
                isLoading={
                  userRole === "teacher"
                    ? isTeacherSubjectsLoading
                    : isSubjectsLoading
                }
                options={groupedOptions}
                formatGroupLabel={formatGroupLabel}
                placeholder="Fan tanlang..."
                value={selectedOption}
                onChange={(selected) =>
                  formik.setFieldValue("subjectId", selected?.value || "")
                }
                onInputChange={(inputValue, actionMeta) => {
                  if (
                    actionMeta.action === "input-change" &&
                    userRole !== "TEACHER"
                  ) {
                    setSearchValue(inputValue);
                    refetchSubjects();
                  }
                }}
                noOptionsMessage={() => "Fan topilmadi"}
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: "#ccc",
                    minHeight: "40px",
                    boxShadow: "none",
                  }),
                  menu: (base) => ({
                    ...base,
                    zIndex: 9999,
                  }),
                }}
              />
            </FormControl>

            {/* 🔹 Savol matni */}
            <div className="w-full">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                <h1 className="text-2xl">Savol matni</h1>
              </label>
              <JoditEditor
                ref={editorRef}
                config={config}
                value={formik.values.text}
                onChange={(value) => formik.setFieldValue("text", value)}
              />
            </div>

            {/* 🔹 Variantlar (A, B, C, D) */}
            {["A", "B", "C", "D"].map((letter) => (
              <div className="w-full mt-4" key={letter}>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  <h1 className="text-2xl">{letter} varianti</h1>
                </label>
                <JoditEditor
                  ref={editorRef}
                  config={config}
                  value={formik.values[`option_${letter.toLowerCase()}`]}
                  onChange={(value) =>
                    formik.setFieldValue(
                      `option_${letter.toLowerCase()}`,
                      value
                    )
                  }
                />
              </div>
            ))}

            {/* 🔹 Submit tugmasi */}
            <button
              type="submit"
              disabled={isLoading}
              className="focus:outline-none w-full text-white bg-[#3697A5] hover:bg-[#2b808e] focus:ring-4 focus:ring-cyan-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
            >
              {isLoading ? "Yuklanmoqda..." : "Qo'shish"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateQuestion;
