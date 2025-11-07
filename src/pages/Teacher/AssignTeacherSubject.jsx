// import React, { useEffect } from "react";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import toast from "react-hot-toast";
// import { useNavigate, useParams } from "react-router-dom";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import {
//   CreateUserApi,
//   CreateTeacherApi,
//   AssignTeacherSubjectApi,
//   detailTeacherApi,
// } from "../../Api/TeacherApi.jsx";
// import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
// import { GetAllSubjectApi } from "../../Api/SubjectApi.jsx";
// import { teal } from "@mui/material/colors";

// function AssignTeacherSubject() {
//   const { teacherId } = useParams();
//   const navigate = useNavigate();
//   const { data: subject_data, isLoading } = useQuery({
//     queryKey: ["list-subject"],
//     queryFn: GetAllSubjectApi,
//   });

//   const { data: teacher_data } = useQuery({
//     queryKey: ["teacher-detail", teacherId],
//     queryFn: () => detailTeacherApi(teacherId),
//     enabled: !!teacherId,
//   });

//   const assignTeacherSubjectMutation = useMutation({
//     mutationKey: ["assign-teacher-subject"],
//     mutationFn: AssignTeacherSubjectApi,
//     onSuccess: (data) => {
//       toast.success(data.message || "Fan muvaffaqiyatli biriktirildi");
//     },
//     onError: (error) => {
//       toast.error(error?.message || "Fan biriktirishda xatolik");
//     },
//   });

//   const formik = useFormik({
//     initialValues: {
//       subject_id: "",
//       teacher_id: "",
//     },
//     validationSchema: Yup.object({
//       subject_id: Yup.string().required("Fan tanlanishi shart"),
//     }),
//     onSubmit: async (values) => {
//       try {
//         // const teacherIdValue = data?.id || data?.teacher?.id;
//         await assignTeacherSubjectMutation.mutateAsync({
//           subject_id: values.subject_id,
//           teacher_id: teacher_data?.user_id || teacherId,
//         });
//       } catch (error) {
//         console.error(error);
//         toast.error(error.message || "Jarayon davomida xatolik yuz berdi");
//       }
//     },
//   });

//   return (
//     console.log(teacher_data),
//     console.log(teacherId),
//     (
//       <div className="space-y-6">
//         <h2 className="text-2xl font-bold text-gray-800">
//           O‘qituvchi qo‘shish
//         </h2>

//         <div className="bg-white rounded-lg shadow">
//           <div className="p-4 border-b bg-gray-50">
//             <form
//               onSubmit={formik.handleSubmit}
//               className="grid grid-cols-1 gap-3"
//             >
//               {/* Username */}
//               <div>
//                 <h1>
//                   {teacher_data?.last_name} {teacher_data?.first_name}{" "}
//                   {teacher_data?.patronymic}
//                 </h1>
//               </div>
//               <h1>Fan tanlang</h1>
//               <FormControl fullWidth>
//                 <InputLabel id="demo-simple-select-label">
//                   Fanni tanlang
//                 </InputLabel>
//                 <Select
//                   labelId="demo-simple-select-label"
//                   id="demo-simple-select"
//                   value={formik.values.facultyId}
//                   label="Chair"
//                   name="chair_id"
//                   {...formik.getFieldProps("chair_id")}
//                   onChange={formik.handleChange}
//                 >
//                   {isLoading ? (
//                     <MenuItem disabled>Loading...</MenuItem>
//                   ) : (
//                     subject_data?.data?.map((subject) => (
//                       <MenuItem key={subject?.id} value={subject?.id}>
//                         {subject?.name}
//                       </MenuItem>
//                     ))
//                   )}
//                 </Select>
//               </FormControl>

//               <button
//                 type="submit"
//                 className="focus:outline-none w-full text-white bg-[#3697A5] hover:bg-teal-700 font-medium rounded-lg text-sm px-5 py-2.5"
//                 disabled={
//                   assignTeacherSubjectMutation.isPending ||
//                   assignTeacherSubjectMutation.isPending
//                 }
//               >
//                 {assignTeacherSubjectMutation.isPending
//                   ? "Yaratilmoqda..."
//                   : "Qo‘shish"}
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     )
//   );
// }

// export default AssignTeacherSubject;

import React, { useEffect, useState } from "react";
import Select from "react-select";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  AssignTeacherSubjectApi,
  detailTeacherApi,
} from "../../Api/TeacherApi.jsx";
import { GetAllSubjectApi } from "../../Api/SubjectApi.jsx";
import { FormControl, InputLabel } from "@mui/material";

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

// 🔹 Label formatlash yana tepaga qiymat chiqib turadi
const formatGroupLabel = (data) => (
  <div style={groupStyles}>
    <span>{data.label}</span>
    <span style={groupBadgeStyles}>{data.options.length}</span>
  </div>
);

export default function AssignTeacherSubject() {
  const { teacherId } = useParams();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");

  // 🔹 O‘qituvchi ma’lumotini olish
  const { data: teacher_data } = useQuery({
    queryKey: ["teacher-detail", teacherId],
    queryFn: () => detailTeacherApi(teacherId),
    enabled: !!teacherId,
  });

  // 🔹 Fanlar ro‘yxati — limit va search bilan
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

  // 🔹 Mutation: fan biriktirish
  const assignTeacherSubjectMutation = useMutation({
    mutationKey: ["assign-teacher-subject"],
    mutationFn: AssignTeacherSubjectApi,
    onSuccess: (data) => {
      toast.success(data.message || "Fan muvaffaqiyatli biriktirildi");
      navigate(-1);
    },
    onError: (error) => {
      toast.error(error?.message || "Fan biriktirishda xatolik");
    },
  });

  // 🔹 Formik
  const formik = useFormik({
    initialValues: {
      subject_id: "",
      teacher_id: teacherId,
    },
    validationSchema: Yup.object({
      subject_id: Yup.string().required("Fan tanlanishi shart"),
    }),
    onSubmit: async (values) => {
      await assignTeacherSubjectMutation.mutateAsync({
        subject_id: values.subject_id,
        teacher_id: teacher_data?.id || teacherId,
      });
    },
  });

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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        O‘qituvchiga fan biriktirish
      </h2>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b bg-gray-50">
          <form
            onSubmit={formik.handleSubmit}
            className="grid grid-cols-1 gap-3"
          >
            {/* 🔹 O‘qituvchi F.I.SH */}
            <div>
              <h1 className="font-semibold text-gray-700">
                {teacher_data?.last_name} {teacher_data?.first_name}{" "}
                {teacher_data?.patronymic}
              </h1>
            </div>

            {/* 🔹 Fanni tanlash */}
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
              {formik.touched.subject_id && formik.errors.subject_id && (
                <p className="text-red-600 text-sm mt-1">
                  {formik.errors.subject_id}
                </p>
              )}
            </FormControl>

            {/* 🔹 Submit tugmasi */}
            <button
              type="submit"
              disabled={assignTeacherSubjectMutation.isPending}
              className="focus:outline-none w-full text-white bg-[#3697A5] hover:bg-teal-700 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              {assignTeacherSubjectMutation.isPending
                ? "Biriktirilmoqda..."
                : "Biriktirish"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
