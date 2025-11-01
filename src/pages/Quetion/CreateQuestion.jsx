// import React, { useEffect, useMemo, useRef } from "react";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
// import { GetAllSubjectApi } from "../../Api/SubjectApi.jsx";
// import { CreateQuestionApi } from "../../Api/QuestionApi.jsx";

// import JoditEditor from "jodit-react";
// const API_URL = import.meta.env.VITE_TEST_API_URL;

// function CreateQuestion() {
//   const navigate = useNavigate();
//   const editorRef = useRef(null);

//   const { data: subjects_data } = useQuery({
//     queryKey: ["list-subject"],
//     queryFn: GetAllSubjectApi,
//   });

//   const questionMutation = useMutation({
//     mutationKey: ["create-question"],
//     mutationFn: CreateQuestionApi,
//     onSuccess: (data) => {
//       toast.success(data.message || "Savol muvaffaqiyatli yaratildi");
//     },
//     onError: (error) => {
//       toast.error(error.message || "Xatolik yuz berdi");
//     },
//   });
//   const formik = useFormik({
//     initialValues: {
//       text: "",
//       option_a: "",
//       option_b: "",
//       option_c: "",
//       option_d: "",
//       subjectId: "",
//     },
//     validationSchema: Yup.object({
//       // name_uz: Yup.string().required("!!! To'ldirish shart"),
//       // name_ru: Yup.string().required("!!! To'ldirish shart"),
//       // name_en: Yup.string().required("!!! To'ldirish shart"),
//       // faculty_icon: Yup.string().required("!!! To'ldirish shart"),
//     }),
//     onSubmit: (values) => {
//       const questionData = {
//         text: values.text,
//         option_a: values.option_a,
//         option_b: values.option_b,
//         option_c: values.option_c,
//         option_d: values.option_d,
//         subjectId: values.subjectId,
//       };

//       console.log(values);
//       questionMutation.mutate(questionData);
//     },
//   });

//   const config = useMemo(
//     () => ({
//       readonly: false,
//       height: 300,
//       toolbarButtonSize: "middle",
//       style: {
//         table: {
//           border: "1px solid #ccc",
//           "border-collapse": "collapse",
//         },
//         "td, th": {
//           border: "1px solid #ccc",
//           padding: "5px",
//         },
//       },
//       uploader: {
//         url: `${API_URL}/quiz/upload`,
//         insertImageAsBase64URI: false,
//         imagesExtensions: ["jpg", "png", "jpeg", "gif"],
//         method: "POST",
//         format: "json",
//         prepareData: function (formData) {
//           const file = formData.get("files[0]");
//           formData.delete("files[0]"); // eski nomni o‘chirib tashlaymiz
//           formData.append("file", file); // backend kutayotgan nom
//           return formData;
//           // const formData = new FormData();
//           // const file = data.files[0];
//           // if (file) {
//           //     formData.append("upload_file", file);
//           // } else {
//           //     console.error("Fayl yo‘q yoki noto‘g‘ri format!");
//           // }
//           // return formData;
//         },
//         headers: {},
//         isSuccess: function (resp) {
//           return resp.file_url !== undefined;
//         },
//         process: function (resp) {
//           console.log("Serverdan qaytgan javob:", resp.file_url);
//           if (resp.file_url) {
//             return {
//               files: [resp.file_url],
//             };
//           }
//           return {
//             files: [],
//           };
//         },
//         defaultHandlerSuccess: function (data) {
//           if (data.files && data.files[0]) {
//             const fileUrl = data.files[0]; // Fayl URL manzili
//             let htmlContent = "";

//             // Fayl turini aniqlash uchun URL oxirgi qismini tekshirish
//             const fileExtension = fileUrl.split(".").pop().toLowerCase();

//             switch (fileExtension) {
//               case "jpg":
//               case "jpeg":
//               case "png":
//               case "gif":
//                 // Rasm fayllari uchun
//                 htmlContent = `<img src="${fileUrl}" alt="Yuklangan rasm" style="max-width: 100%;">`;
//                 break;

//               case "pdf":
//                 htmlContent = `<a href="${fileUrl}" target="_blank"
//                             class="text-blue-600 cursor-pointer"> pdf </a>`;

//                 break;

//               case "doc":
//               case "docx":
//                 // Word fayllari uchun havola
//                 htmlContent = `<a href="${fileUrl}" target="_blank">Word faylni yuklab olish</a>`;
//                 break;

//               case "xls":
//               case "xlsx":
//                 // Excel fayllari uchun havola
//                 htmlContent = `<a href="${fileUrl}" target="_blank">Excel faylni yuklab olish</a>`;
//                 break;

//               default:
//                 // Noma'lum fayl turlari uchun umumiy havola
//                 htmlContent = `<a href="${fileUrl}" target="_blank">Faylni yuklab olish</a>`;
//                 break;
//             }

//             console.log("HTML Content:", htmlContent);
//             this.s.insertHTML(htmlContent); // Mavjud kontentga qo‘shish
//           }
//         },
//       },
//     }),
//     []
//   );

//   const isSuccess = questionMutation.isSuccess;
//   const isLoading = questionMutation.isLoading;
//   useEffect(() => {
//     if (isSuccess) {
//       navigate("/list-question");
//     }
//   }, [navigate, isSuccess]);
//   return (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-bold text-gray-800">Savol qo'shish</h2>
//       <div className="bg-white rounded-lg shadow">
//         <div className="p-4 border-b bg-gray-50">
//           <form
//             onSubmit={formik.handleSubmit}
//             className="grid grid-cols-1 gap-3"
//           >
//             <FormControl fullWidth>
//               <InputLabel id="demo-simple-select-label">
//                 Fanni tanlash
//               </InputLabel>
//               <Select
//                 labelId="demo-simple-select-label"
//                 id="demo-simple-select"
//                 value={formik.values.subjectId}
//                 label="Subject"
//                 name="subjectId"
//                 onChange={formik.handleChange}
//               >
//                 {isLoading ? (
//                   <MenuItem disabled>Loading...</MenuItem>
//                 ) : (
//                   subjects_data?.data?.map((subject) => (
//                     <MenuItem key={subject?.id} value={subject?.id}>
//                       {subject?.name}
//                     </MenuItem>
//                   ))
//                 )}
//               </Select>
//             </FormControl>
//             <div className="w-full">
//               <label
//                 htmlFor="text"
//                 className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//               >
//                 <h1 className="text-2xl">Savolni kiriting</h1>
//               </label>

//               <JoditEditor
//                 ref={editorRef}
//                 config={config}
//                 value={formik.values.text}
//                 onChange={(value) => {
//                   formik.setFieldValue("text", value);
//                 }}
//               />
//             </div>
//             <div className="grid grid-cols-1 gap-3">
//               <div className="w-full mt-4">
//                 <label
//                   htmlFor="option_a"
//                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//                 >
//                   <h1 className="text-2xl"> A variantini kiriting</h1>
//                 </label>
//                 <JoditEditor
//                   ref={editorRef}
//                   config={config}
//                   value={formik.values.option_a}
//                   onChange={(value) => {
//                     formik.setFieldValue("option_a", value);
//                   }}
//                 />
//                 {/* <input
//                   type="text"
//                   id="option_a"
//                   name="option_a"
//                   {...formik.getFieldProps("option_a")}
//                   className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                 /> */}
//               </div>

//               <div className="w-full mt-4">
//                 <label
//                   htmlFor="option_b"
//                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//                 >
//                   <h1 className="text-2xl"> B variantini kiriting</h1>
//                 </label>
//                 <JoditEditor
//                   ref={editorRef}
//                   config={config}
//                   value={formik.values.option_b}
//                   onChange={(value) => {
//                     formik.setFieldValue("option_b", value);
//                   }}
//                 />
//                 {/* <input
//                   type="text"
//                   id="option_b"
//                   name="option_b"
//                   {...formik.getFieldProps("option_b")}
//                   className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                 /> */}
//               </div>
//               <div className="w-full mt-4">
//                 <label
//                   htmlFor="option_c"
//                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//                 >
//                   <h1 className="text-2xl">C variantini kiriting</h1>
//                 </label>
//                 <JoditEditor
//                   ref={editorRef}
//                   config={config}
//                   value={formik.values.option_c}
//                   onChange={(value) => {
//                     formik.setFieldValue("option_c", value);
//                   }}
//                 />
//                 {/* <input
//                   type="text"
//                   id="option_c"
//                   name="option_c"
//                   {...formik.getFieldProps("option_c")}
//                   className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                 /> */}
//               </div>
//               <div className="w-full mt-4">
//                 <label
//                   htmlFor="option_d"
//                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//                 >
//                   <h1 className="text-2xl">D variantini kiriting</h1>
//                 </label>
//                 <JoditEditor
//                   ref={editorRef}
//                   config={config}
//                   value={formik.values.option_d}
//                   onChange={(value) => {
//                     formik.setFieldValue("option_d", value);
//                   }}
//                 />
//                 {/* <input
//                   type="text"
//                   id="option_d"
//                   name="option_d"
//                   {...formik.getFieldProps("option_d")}
//                   className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                 /> */}
//               </div>
//             </div>

//             <button
//               type="submit"
//               className="focus:outline-none w-full text-white bg-[#3697A5] hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
//             >
//               Qo'shish
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CreateQuestion;

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import Select from "react-select";
import { FormControl, InputLabel } from "@mui/material";
import { GetAllSubjectApi } from "../../Api/SubjectApi.jsx";
import { CreateQuestionApi } from "../../Api/QuestionApi.jsx";
import JoditEditor from "jodit-react";

const API_URL = import.meta.env.VITE_TEST_API_URL;

// 🔹 react-select style
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

  // 🔹 Fanlar — search bilan
  const { data: subjects_data, isLoading: isSubjectsLoading } = useQuery({
    queryKey: ["list-subject", searchValue],
    queryFn: () =>
      GetAllSubjectApi({
        limit: 20,
        offset: 0,
        search: searchValue,
      }),
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

  // 🔹 Formik
  const formik = useFormik({
    initialValues: {
      text: "",
      option_a: "",
      option_b: "",
      option_c: "",
      option_d: "",
      subjectId: "",
    },
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

  // 🔹 react-select uchun ma’lumot
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

  const selectedOption = groupedOptions[0].options.find(
    (opt) => opt.value === formik.values.subjectId
  );

  // 🔹 Jodit config
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
          formData.delete("files[0]"); // eski nomni o‘chirib tashlaymiz
          formData.append("file", file); // backend kutayotgan nom
          return formData;
          // const formData = new FormData();
          // const file = data.files[0];
          // if (file) {
          //     formData.append("upload_file", file);
          // } else {
          //     console.error("Fayl yo‘q yoki noto‘g‘ri format!");
          // }
          // return formData;
        },
        headers: {},
        isSuccess: function (resp) {
          return resp.file_url !== undefined;
        },
        process: function (resp) {
          console.log("Serverdan qaytgan javob:", resp.file_url);
          if (resp.file_url) {
            return {
              files: [resp.file_url],
            };
          }
          return {
            files: [],
          };
        },
        defaultHandlerSuccess: function (data) {
          if (data.files && data.files[0]) {
            const fileUrl = data.files[0]; // Fayl URL manzili
            let htmlContent = "";

            // Fayl turini aniqlash uchun URL oxirgi qismini tekshirish
            const fileExtension = fileUrl.split(".").pop().toLowerCase();

            switch (fileExtension) {
              case "jpg":
              case "jpeg":
              case "png":
              case "gif":
                // Rasm fayllari uchun
                htmlContent = `<img src="${fileUrl}" alt="Yuklangan rasm" style="max-width: 100%;">`;
                break;

              case "pdf":
                htmlContent = `<a href="${fileUrl}" target="_blank" 
                            class="text-blue-600 cursor-pointer"> pdf </a>`;

                break;

              case "doc":
              case "docx":
                // Word fayllari uchun havola
                htmlContent = `<a href="${fileUrl}" target="_blank">Word faylni yuklab olish</a>`;
                break;

              case "xls":
              case "xlsx":
                // Excel fayllari uchun havola
                htmlContent = `<a href="${fileUrl}" target="_blank">Excel faylni yuklab olish</a>`;
                break;

              default:
                // Noma'lum fayl turlari uchun umumiy havola
                htmlContent = `<a href="${fileUrl}" target="_blank">Faylni yuklab olish</a>`;
                break;
            }

            console.log("HTML Content:", htmlContent);
            this.s.insertHTML(htmlContent); // Mavjud kontentga qo‘shish
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
          <form
            onSubmit={formik.handleSubmit}
            className="grid grid-cols-1 gap-3"
          >
            {/* 🔹 Fanni tanlash (react-select bilan) */}
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
                  formik.setFieldValue("subjectId", selected?.value || "")
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

            {/* 🔹 Savol matni */}
            <div className="w-full">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                <h1 className="text-2xl">Savolni kiriting</h1>
              </label>
              <JoditEditor
                ref={editorRef}
                config={config}
                value={formik.values.text}
                onChange={(value) => formik.setFieldValue("text", value)}
              />
            </div>

            {/* 🔹 Variantlar */}
            {["A", "B", "C", "D"].map((letter) => (
              <div className="w-full mt-4" key={letter}>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  <h1 className="text-2xl">{letter} variantini kiriting</h1>
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

            {/* 🔹 Submit */}
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
