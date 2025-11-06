import React, { useEffect, useState } from "react";
import Select from "react-select";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FormControl, InputLabel } from "@mui/material";
import { CreateQuestionExcelApi } from "../../Api/QuestionApi";
import {
  GetAllSubjectApi,
  detailSubjectByTeacherApi,
} from "../../Api/SubjectApi";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// 🔹 react-select guruh label style
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

export default function CreateQuestionExcel() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [userRole, setUserRole] = useState("");
  const [teacherId, setTeacherId] = useState(null);

  // 🔹 Token orqali rol va user_id aniqlash
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
    }
  }, []);

  // 🔹 Excel yuklash uchun mutation
  const createQuestionExcelMutation = useMutation({
    mutationKey: ["create-question-excel"],
    mutationFn: CreateQuestionExcelApi,
    onSuccess: (data) => {
      toast.success(data.message || "Savollar muvaffaqiyatli yuklandi");
    },
    onError: (error) => {
      toast.error(error.message || "Xatolik yuz berdi");
    },
  });

  // 🔹 Agar ADMIN bo‘lsa — barcha fanlar
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
    enabled: userRole === "admin",
  });

  // 🔹 Agar O‘QITUVCHI bo‘lsa — faqat o‘z fanlari
  const {
    data: subject_data_by_teacher,
    isLoading: isTeacherSubjectsLoading,
    refetch: refetchTeacherSubjects,
  } = useQuery({
    queryKey: ["subject-detail-by-teacher", teacherId],
    queryFn: () => detailSubjectByTeacherApi(teacherId),
    enabled: userRole === "teacher" && !!teacherId,
  });

  const formik = useFormik({
    initialValues: {
      subject_id: "",
      file: null,
    },
    onSubmit: (values) => {
      const questionData = {
        subject_id: values.subject_id,
        file: values.file,
      };
      createQuestionExcelMutation.mutate(questionData);
    },
  });

  const isSuccess = createQuestionExcelMutation.isSuccess;

  useEffect(() => {
    if (isSuccess) {
      navigate("/list-question");
    }
  }, [navigate, isSuccess]);

  // 🔹 react-select uchun ma’lumot tayyorlash
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
  } else if (userRole === "admin") {
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
    groupedOptions[0]?.options?.find(
      (opt) => opt.value === formik.values.subject_id
    ) || null;

  return (
    <div className="w-full mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Excel fayl yuklash</h2>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* 🔹 Fan tanlash */}
        <FormControl fullWidth>
          <InputLabel shrink sx={{ mb: 0.5 }}>
            Fanni tanlash
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
              formik.setFieldValue("subject_id", selected?.value || "")
            }
            onInputChange={(inputValue, actionMeta) => {
              if (
                actionMeta.action === "input-change" &&
                userRole === "admin"
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

        {/* 🔹 Excel fayl yuklash */}
        <div className="w-full">
          <label
            className="block mb-2 text-sm font-medium text-gray-900"
            htmlFor="file"
          >
            Excelni yuklang
          </label>
          <input
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
            id="file"
            name="file"
            type="file"
            onChange={(event) => {
              formik.setFieldValue("file", event.currentTarget.files[0]);
            }}
          />
        </div>

        {/* 🔹 Submit tugmasi */}
        <button
          type="submit"
          disabled={createQuestionExcelMutation.isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {createQuestionExcelMutation.isLoading
            ? "Yuklanmoqda..."
            : "Yuklash"}
        </button>
      </form>
    </div>
  );
}

