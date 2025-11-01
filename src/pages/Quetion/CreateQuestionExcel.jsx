// import React, { useEffect, useState, CSSProperties } from "react";
// import axios from "axios";
// import * as Yup from "yup";
// import toast from "react-hot-toast";
// import { CreateQuestionExcelApi } from "../../Api/QuestionApi";
// import { useFormik } from "formik";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
// import { GetAllSubjectApi } from "../../Api/SubjectApi";
// import { useNavigate } from "react-router-dom";

// export default function CreateQuestionExcel() {
//   const navigate = useNavigate();
//   const createQuestionExcelMutation = useMutation({
//     mutationKey: ["create-question-excel"],
//     mutationFn: CreateQuestionExcelApi,
//     onSuccess: (data) => {
//       toast.success(data.message || "Savollar muvaffaqiyatli yaratildi");
//     },
//     onError: (error) => {
//       toast.error(error.message || "Xatolik yuz berdi");
//     },
//   });
//   const { data: subjects_data } = useQuery({
//     queryKey: ["list-subject"],
//     queryFn: GetAllSubjectApi,
//   });

//   const formik = useFormik({
//     initialValues: {
//       subject_id: "",
//       file: null,
//     },
//     // validationSchema: Yup.object({
//     //   name_uz: Yup.string().required("!!! To'ldirish shart"),
//     //   name_ru: Yup.string().required("!!! To'ldirish shart"),
//     //   name_en: Yup.string().required("!!! To'ldirish shart"),
//     //   // faculty_icon: Yup.string().required("!!! To'ldirish shart"),
//     // }),
//     onSubmit: (values) => {
//       const questionData = {
//         subject_id: values.subject_id,
//         file: values.file,
//       };

//       createQuestionExcelMutation.mutate(questionData);
//     },
//   });
//   const isSuccess = createQuestionExcelMutation.isSuccess;
//   const isLoading = createQuestionExcelMutation.isLoading;

//   useEffect(() => {
//     if (isSuccess) {
//       navigate("/list-question");
//     }
//   }, [navigate, isSuccess]);

//   return (
//     <div className="w-full mx-auto bg-white p-6 rounded-lg shadow">
//       <h2 className="text-xl font-bold mb-4 text-center">Excel fayl yuklash</h2>

//       <form onSubmit={formik.handleSubmit} className="space-y-4">
//         <div>
//           <FormControl fullWidth>
//             <InputLabel id="demo-simple-select-label">Fanni tanlash</InputLabel>
//             <Select
//               labelId="demo-simple-select-label"
//               id="demo-simple-select"
//               value={formik.values.subject_id}
//               label="Subject"
//               name="subject_id"
//               onChange={formik.handleChange}
//             >
//               {isLoading ? (
//                 <MenuItem disabled>Loading...</MenuItem>
//               ) : (
//                 subjects_data?.data?.map((subject) => (
//                   <MenuItem key={subject?.id} value={subject?.id}>
//                     {subject?.name}
//                   </MenuItem>
//                 ))
//               )}
//             </Select>
//           </FormControl>
//         </div>

//         <div className="w-full">
//           <label
//             className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//             htmlFor="faculty_icon"
//           >
//             Excelni yuklang
//           </label>
//           <input
//             className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
//             id="file"
//             name="file"
//             type="file"
//             onChange={(event) => {
//               formik.setFieldValue("file", event.currentTarget.files[0]);
//             }}
//           />
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
//         >
//           Yuklash
//         </button>
//       </form>
//     </div>
//   );
// }

// import React, { useEffect } from "react";
// import Select from "react-select";
// import axios from "axios";
// import * as Yup from "yup";
// import toast from "react-hot-toast";
// import { useFormik } from "formik";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import { FormControl, InputLabel } from "@mui/material";
// import { CreateQuestionExcelApi } from "../../Api/QuestionApi";
// import { GetAllSubjectApi } from "../../Api/SubjectApi";
// import { useNavigate } from "react-router-dom";

// // 🔹 Guruhlangan label uchun style
// const groupStyles = {
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "space-between",
// };
// const groupBadgeStyles = {
//   backgroundColor: "#EBECF0",
//   borderRadius: "2em",
//   color: "#172B4D",
//   display: "inline-block",
//   fontSize: 12,
//   fontWeight: "normal",
//   lineHeight: "1",
//   minWidth: 1,
//   padding: "0.16666666666667em 0.5em",
//   textAlign: "center",
// };

// // 🔹 Label formatlash
// const formatGroupLabel = (data) => (
//   <div style={groupStyles}>
//     <span>{data.label}</span>
//     <span style={groupBadgeStyles}>{data.options.length}</span>
//   </div>
// );

// export default function CreateQuestionExcel() {
//   const navigate = useNavigate();

//   // 🔹 Excel fayl yuklash mutation
//   const createQuestionExcelMutation = useMutation({
//     mutationKey: ["create-question-excel"],
//     mutationFn: CreateQuestionExcelApi,
//     onSuccess: (data) => {
//       toast.success(data.message || "Savollar muvaffaqiyatli yaratildi");
//     },
//     onError: (error) => {
//       toast.error(error.message || "Xatolik yuz berdi");
//     },
//   });

//   // 🔹 Fanlar ro‘yxati
//   const { data: subjects_data, isLoading: isSubjectsLoading } = useQuery({
//     queryKey: ["list-subject"],
//     queryFn: GetAllSubjectApi,
//   });

//   const formik = useFormik({
//     initialValues: {
//       subject_id: "",
//       file: null,
//     },
//     onSubmit: (values) => {
//       const questionData = {
//         subject_id: values.subject_id,
//         file: values.file,
//       };
//       createQuestionExcelMutation.mutate(questionData);
//     },
//   });

//   const isSuccess = createQuestionExcelMutation.isSuccess;

//   useEffect(() => {
//     if (isSuccess) {
//       navigate("/list-question");
//     }
//   }, [navigate, isSuccess]);

//   // 🔹 API ma’lumotni react-select formatiga keltirish
//   const groupedOptions = [
//     {
//       label: "Fanlar ro‘yxati",
//       options:
//         subjects_data?.data?.map((subject) => ({
//           value: subject.id,
//           label: subject.name,
//         })) || [],
//     },
//   ];

//   // 🔹 Formik bilan sync qilish
//   const selectedOption = groupedOptions[0].options.find(
//     (opt) => opt.value === formik.values.subject_id
//   );

//   return (
//     <div className="w-full mx-auto bg-white p-6 rounded-lg shadow">
//       <h2 className="text-xl font-bold mb-4 text-center">Excel fayl yuklash</h2>

//       <form onSubmit={formik.handleSubmit} className="space-y-4">
//         {/* 🔹 Fanni tanlash react-select */}
//         <FormControl fullWidth>
//           <InputLabel shrink sx={{ mb: 0.5 }}>
//             Fanni tanlash
//           </InputLabel>
//           <Select
//             isClearable
//             isLoading={isSubjectsLoading}
//             options={groupedOptions}
//             formatGroupLabel={formatGroupLabel}
//             placeholder="Fan tanlang..."
//             value={selectedOption || null}
//             onChange={(selected) =>
//               formik.setFieldValue("subject_id", selected?.value || "")
//             }
//             noOptionsMessage={() => "Fan topilmadi"}
//             styles={{
//               control: (base) => ({
//                 ...base,
//                 borderColor: "#ccc",
//                 minHeight: "40px",
//                 boxShadow: "none",
//               }),
//               menu: (base) => ({
//                 ...base,
//                 zIndex: 9999,
//               }),
//             }}
//           />
//         </FormControl>

//         {/* 🔹 Excel fayl yuklash */}
//         <div className="w-full">
//           <label
//             className="block mb-2 text-sm font-medium text-gray-900"
//             htmlFor="file"
//           >
//             Excelni yuklang
//           </label>
//           <input
//             className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
//             id="file"
//             name="file"
//             type="file"
//             onChange={(event) => {
//               formik.setFieldValue("file", event.currentTarget.files[0]);
//             }}
//           />
//         </div>

//         {/* 🔹 Submit tugmasi */}
//         <button
//           type="submit"
//           disabled={createQuestionExcelMutation.isLoading}
//           className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
//         >
//           {createQuestionExcelMutation.isLoading ? "Yuklanmoqda..." : "Yuklash"}
//         </button>
//       </form>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import Select from "react-select";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FormControl, InputLabel } from "@mui/material";
import { CreateQuestionExcelApi } from "../../Api/QuestionApi";
import { GetAllSubjectApi } from "../../Api/SubjectApi";
import { useNavigate } from "react-router-dom";

// 🔹 Guruhlangan label uchun style
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

// 🔹 Label formatlash
const formatGroupLabel = (data) => (
  <div style={groupStyles}>
    <span>{data.label}</span>
    <span style={groupBadgeStyles}>{data.options.length}</span>
  </div>
);

export default function CreateQuestionExcel() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");

  // 🔹 Excel fayl yuklash mutation
  const createQuestionExcelMutation = useMutation({
    mutationKey: ["create-question-excel"],
    mutationFn: CreateQuestionExcelApi,
    onSuccess: (data) => {
      toast.success(data.message || "Savollar muvaffaqiyatli yaratildi");
    },
    onError: (error) => {
      toast.error(error.message || "Xatolik yuz berdi");
    },
  });

  // 🔹 Fanlar ro‘yxati — qidiruv bilan
  const {
    data: subjects_data,
    isLoading: isSubjectsLoading,
    refetch,
  } = useQuery({
    queryKey: ["list-subject", searchValue],
    queryFn: () =>
      GetAllSubjectApi({
        limit: 20,
        offset: 0,
        search: searchValue,
      }),
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

  // 🔹 API ma’lumotni react-select formatiga keltirish
  const groupedOptions = [
    {
      label: "Fanlar ro‘yxati",
      options:
        subjects_data?.data?.map((subject) => ({
          value: subject.id,
          label: subject.name,
        })) || [],
    },
  ];

  // 🔹 Formik bilan sync
  const selectedOption = groupedOptions[0].options.find(
    (opt) => opt.value === formik.values.subject_id
  );

  return (
    <div className="w-full mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Excel fayl yuklash</h2>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* 🔹 Fanni tanlash react-select */}
        <FormControl fullWidth>
          <InputLabel shrink sx={{ mb: 0.5 }}>
            Fanni tanlash
          </InputLabel>
          <Select
            isClearable
            isLoading={isSubjectsLoading}
            options={groupedOptions}
            formatGroupLabel={formatGroupLabel}
            placeholder="Fan tanlang..."
            value={selectedOption || null}
            onChange={(selected) =>
              formik.setFieldValue("subject_id", selected?.value || "")
            }
            onInputChange={(inputValue, actionMeta) => {
              if (actionMeta.action === "input-change") {
                setSearchValue(inputValue);
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
          {createQuestionExcelMutation.isLoading ? "Yuklanmoqda..." : "Yuklash"}
        </button>
      </form>
    </div>
  );
}
