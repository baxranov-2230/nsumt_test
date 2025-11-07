// import React, {useEffect, useState} from "react";
// import {useFormik} from "formik";
// import * as Yup from "yup";
// import toast from "react-hot-toast";
// import {useNavigate} from "react-router-dom";
// import {useMutation, useQuery} from "@tanstack/react-query";
// import {CreateUserApi, CreateTeacherApi, GetAllTeacher} from "../../Api/TeacherApi.jsx";
// import {FormControl, InputLabel, MenuItem} from "@mui/material";
// import {CreateQuizApi} from "../../Api/QuizApi.jsx";
// import Select from "react-select";
// import {GetAllSubjectApi} from "../../Api/SubjectApi.jsx";
// import {GetAllGroupApi} from "../../Api/GroupApi.jsx";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import dayjs from "dayjs";
//
// const groupStyles = {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
// };
// const groupBadgeStyles = {
//     backgroundColor: "#EBECF0",
//     borderRadius: "2em",
//     color: "#172B4D",
//     display: "inline-block",
//     fontSize: 12,
//     fontWeight: "normal",
//     lineHeight: "1",
//     minWidth: 1,
//     padding: "0.16666666666667em 0.5em",
//     textAlign: "center",
// };
//
// function CreateQuiz() {
//     const navigate = useNavigate();
//     const [searchValueSubject, setSearchValueSubject] = useState("");
//     const [searchValueTeacher, setSearchValueTeacher] = useState("");
//     const [searchValueGroup, setSearchValueGroup] = useState("");
//
//     // 1️ Quiz yaratish
//     const createQuizMutation = useMutation({
//         mutationKey: ["create-quiz"],
//         mutationFn: CreateQuizApi,
//         onSuccess: (data) => {
//             toast.success(data.message || "Quiz muvaffaqiyatli yaratildi");
//             navigate("/list-quiz");
//         },
//         onError: (error) => {
//             toast.error(error?.message || "Quiz yaratishda xatolik");
//         },
//     });
//
//     // 🔹 Fanlar ro‘yxati — limit va search bilan
//     const {
//         data: subjects_data,
//         isLoading: isSubjectsLoading,
//
//     } = useQuery({
//         queryKey: ["list-subject", searchValueSubject],
//         queryFn: () =>
//             GetAllSubjectApi({
//                 limit: 20,
//                 offset: 0,
//                 search: searchValueSubject,
//             }),
//     });
//     // 🔹 O'qituvchilar ro‘yxati — limit va search bilan
//     const {
//         data: teachers_data,
//         isLoading: isTeachersLoading,
//
//     } = useQuery({
//         queryKey: ["list-teacher", searchValueTeacher],
//         queryFn: () =>
//             GetAllTeacher({
//                 limit: 20,
//                 offset: 0,
//                 search: searchValueTeacher,
//             }),
//     });
//
//     // 🔹 Guruhlar ro‘yxati — limit va search bilan
//
//     const {
//         data: groups_data,
//         isLoading: isGroupsLoading,
//
//     } = useQuery({
//         queryKey: ["list-group", searchValueGroup],
//         queryFn: () =>
//             GetAllGroupApi({
//                 limit: 20,
//                 offset: 0,
//                 search: searchValueGroup,
//             }),
//     });
//
//     const formik = useFormik({
//         initialValues: {
//             user_id: "",
//             subject_id: "",
//             group_id: "",
//             quiz_name: "",
//             question_number: "",
//             quiz_time: "",
//             start_time: null,
//             quiz_pin: "",
//         },
//         validationSchema: Yup.object({
//             user_id: Yup.string().required("Foydalanuvchi tanlanishi shart"),
//             subject_id: Yup.string().required("Fan tanlanishi shart"),
//             group_id: Yup.string().required("Guruh tanlanishi shart"),
//             quiz_name: Yup.string().required("Quiz nomi tanlanishi shart"),
//             question_number: Yup.string().required("Savol soni tanlanishi shart"),
//             quiz_time: Yup.string().required("Quiz vaqti tanlanishi shart"),
//             start_time: Yup.string().required("Boshlanish vaqti tanlanishi shart"),
//             quiz_pin: Yup.string().required("Quiz PIN tanlanishi shart"),
//         }),
//         onSubmit: (values) => {
//             // setFormData(values);
//             const quizData = {
//                 user_id: values.user_id,
//                 subject_id: values.subject_id,
//                 group_id: values.group_id,
//                 quiz_name: values.quiz_name,
//                 question_number: values.question_number,
//                 quiz_time: values.quiz_time,
//                 start_time: values.start_time,
//                 quiz_pin: values.quiz_pin
//             };
//             createQuizMutation.mutate(quizData);
//         },
//     });
//
//     // Fani olib kelish Start
//     const groupedOptionsSubject = [
//         {
//             label: "Fanlar ro‘yxati",
//             options:
//                 subjects_data?.data?.map((subject) => ({
//                     value: subject.id,
//                     label: subject.name,
//                 })) || [],
//         },
//     ];
//     const selectedOptionSubject = groupedOptionsSubject[0].options.find(
//         (opt) => opt.value === formik.values.subject_id
//     );
//     // Fani olib kelish End
//
//     // O'qituvchini olib kelish Start
//     const groupedOptionsTeacher = [
//         {
//             label: "Fanlar ro‘yxati",
//             options:
//                 teachers_data?.data?.map((teacher) => ({
//                     value: teacher.user_id,
//                     label: teacher.first_name + " " + teacher.last_name,
//                 })) || [],
//         },
//     ];
//     const selectedOptionTeacher = groupedOptionsTeacher[0].options.find(
//         (opt) => opt.value === formik.values.user_id
//     );
//     // O'qituvchini olib kelish End
//
//     // Guruhni olib kelish Start
//     const groupedOptionsGroup = [
//         {
//             label: "Guruhlar ro‘yxati",
//             options:
//                 groups_data?.data?.map((group) => ({
//                     value: group.id,
//                     label: group.name,
//                 })) || [],
//         },
//     ];
//     const selectedOptionGroup = groupedOptionsGroup[0].options.find(
//         (opt) => opt.value === formik.values.group_id
//     );
//     // Guruhni olib kelish End
//
//     return (
//         <div className="space-y-6">
//             <h2 className="text-2xl font-bold text-gray-800">Quiz yaratish</h2>
//
//             <div className="bg-white rounded-lg shadow">
//                 <div className="p-4 border-b bg-gray-50">
//                     <form
//                         onSubmit={formik.handleSubmit}
//                         className="grid grid-cols-1 gap-3"
//                     >
//                         <div className="w-full">
//                             <label
//                                 htmlFor="quiz_name"
//                                 className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//                             >
//                                 Quiz nomini kiriting
//                             </label>
//                             <input
//                                 type="text"
//                                 id="quiz_name"
//                                 name="quiz_name"
//                                 {...formik.getFieldProps("quiz_name")}
//                                 className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                             />
//                         </div>
//                         <hr/>
//                         <div className="w-full">
//                             <label
//                                 htmlFor="question_number"
//                                 className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//                             >
//                                 Savol sonini kiriting
//                             </label>
//                             <input
//                                 type="text"
//                                 id="question_number"
//                                 name="question_number"
//                                 {...formik.getFieldProps("question_number")}
//                                 className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                             />
//                         </div>
//                         <hr/>
//                         <div className="w-full">
//                             <label
//                                 htmlFor="quiz_time"
//                                 className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//                             >
//                                 Quiz vaqtini kiriting
//                             </label>
//                             <input
//                                 type="text"
//                                 id="quiz_time"
//                                 name="quiz_time"
//                                 {...formik.getFieldProps("quiz_time")}
//                                 className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                             />
//                         </div>
//                         <hr/>
//                         <div className="w-full">
//                             <label
//                                 htmlFor="quiz_pin"
//                                 className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//                             >
//                                 Quiz pinini kiriting
//                             </label>
//                             <input
//                                 type="text"
//                                 id="quiz_pin"
//                                 name="quiz_pin"
//                                 {...formik.getFieldProps("quiz_pin")}
//                                 className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                             />
//                         </div>
//                         <hr/>
//                         {/* 📅 Boshlanish vaqti */}
//                         <div className="flex flex-col ">
//                             <label className="flex w-full mb-2 text-sm font-medium text-gray-900 ">
//                                 Boshlanish sanasi va vaqti
//                             </label>
//                             <DatePicker
//                                 selected={formik.values.start_time ? new Date(formik.values.start_time) : null}
//                                 onChange={(date) => {
//                                     if (date) {
//                                         const formatted = dayjs(date).format("YYYY-MM-DDTHH:mm:ss");
//                                         formik.setFieldValue("start_time", formatted);
//                                     }
//                                 }}
//                                 showTimeSelect
//                                 timeFormat="HH:mm"
//                                 timeIntervals={15}
//                                 dateFormat="yyyy-MM-dd HH:mm"
//                                 placeholderText="Sanani va vaqtni tanlang"
//                                 className="flex w-full p-3 border rounded-lg"
//                             />
//                             {formik.touched.start_time && formik.errors.start_time && (
//                                 <p className="text-red-500 text-sm">{formik.errors.start_time}</p>
//                             )}
//                         </div>
//
//                         {/* 🔹 Fanni tanlash */}
//                         <h1>Fanni tanlang</h1>
//                         <FormControl fullWidth>
//                             <Select
//                                 isClearable
//                                 isLoading={isSubjectsLoading}
//                                 options={groupedOptionsSubject}
//                                 placeholder="Fan tanlang..."
//                                 value={selectedOptionSubject || null}
//                                 onChange={(selected) =>
//                                     formik.setFieldValue("subject_id", selected?.value || "")
//                                 }
//                                 onInputChange={(inputValue, actionMeta) => {
//                                     if (actionMeta.action === "input-change") {
//                                         setSearchValueSubject(inputValue);
//                                     }
//                                 }}
//                                 noOptionsMessage={() => "Fan topilmadi"}
//                                 styles={{
//                                     control: (base) => ({
//                                         ...base,
//                                         borderColor: "#ccc",
//                                         minHeight: "40px",
//                                         boxShadow: "none",
//                                     }),
//                                     menu: (base) => ({
//                                         ...base,
//                                         zIndex: 9999,
//                                     }),
//                                 }}
//                             />
//                             {formik.touched.subject_id && formik.errors.subject_id && (
//                                 <p className="text-red-600 text-sm mt-1">
//                                     {formik.errors.subject_id}
//                                 </p>
//                             )}
//                         </FormControl>
//                         <hr/>
//                         {/* 🔹 O'qituvchini tanlash */}
//                         <h1>O'qituvchini tanlang</h1>
//                         <FormControl fullWidth>
//                             <Select
//                                 isClearable
//                                 isLoading={isTeachersLoading}
//                                 options={groupedOptionsTeacher}
//                                 placeholder="O'qituvchini tanlang..."
//                                 value={selectedOptionTeacher || null}
//                                 onChange={(selected) =>
//                                     formik.setFieldValue("user_id", selected?.value || "")
//                                 }
//                                 onInputChange={(inputValue, actionMeta) => {
//                                     if (actionMeta.action === "input-change") {
//                                         setSearchValueTeacher(inputValue);
//                                     }
//                                 }}
//                                 noOptionsMessage={() => "O'qituvchi topilmadi"}
//                                 styles={{
//                                     control: (base) => ({
//                                         ...base,
//                                         borderColor: "#ccc",
//                                         minHeight: "40px",
//                                         boxShadow: "none",
//                                     }),
//                                     menu: (base) => ({
//                                         ...base,
//                                         zIndex: 9999,
//                                     }),
//                                 }}
//                             />
//                             {formik.touched.user_id && formik.errors.user_id && (
//                                 <p className="text-red-600 text-sm mt-1">
//                                     {formik.errors.user_id}
//                                 </p>
//                             )}
//                         </FormControl>
//                         <hr/>
//
//                         {/* 🔹 O'qituvchini tanlash */}
//                         <h1> Guruhni tanlang</h1>
//                         <FormControl fullWidth>
//                             <Select
//                                 isClearable
//                                 isLoading={isTeachersLoading}
//                                 options={groupedOptionsGroup}
//                                 placeholder="Guruhni tanlang..."
//                                 value={selectedOptionGroup || null}
//                                 onChange={(selected) =>
//                                     formik.setFieldValue("group_id", selected?.value || "")
//                                 }
//                                 onInputChange={(inputValue, actionMeta) => {
//                                     if (actionMeta.action === "input-change") {
//                                         setSearchValueGroup(inputValue);
//                                     }
//                                 }}
//                                 noOptionsMessage={() => "Guruh topilmadi"}
//                                 styles={{
//                                     control: (base) => ({
//                                         ...base,
//                                         borderColor: "#ccc",
//                                         minHeight: "40px",
//                                         boxShadow: "none",
//                                     }),
//                                     menu: (base) => ({
//                                         ...base,
//                                         zIndex: 9999,
//                                     }),
//                                 }}
//                             />
//                             {formik.touched.id && formik.errors.id && (
//                                 <p className="text-red-600 text-sm mt-1">
//                                     {formik.errors.id}
//                                 </p>
//                             )}
//                         </FormControl>
//                         <hr/>
//
//                         {/* 🔹 Submit tugmasi */}
//                         <button
//                             type="submit"
//                             // disabled={createQuizMutation.isPending}
//                             className="focus:outline-none w-full text-white bg-[#3697A5] hover:bg-teal-700 font-medium rounded-lg text-sm px-5 py-2.5"
//                         >
//                             Yaratish
//                         </button>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// }
//
// export default CreateQuiz;


import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CreateQuizApi } from "../../Api/QuizApi.jsx";
import { GetAllSubjectApi } from "../../Api/SubjectApi.jsx";
import { GetAllTeacher } from "../../Api/TeacherApi.jsx";
import { GetAllGroupApi } from "../../Api/GroupApi.jsx";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";

const CreateQuiz = () => {
    const navigate = useNavigate();
    const [searchValueSubject, setSearchValueSubject] = useState("");
    const [searchValueTeacher, setSearchValueTeacher] = useState("");
    const [searchValueGroup, setSearchValueGroup] = useState("");

    // 1. Quiz yaratish
    const createQuizMutation = useMutation({
        mutationKey: ["create-quiz"],
        mutationFn: CreateQuizApi,
        onSuccess: (data) => {
            toast.success(data.message || "Quiz muvaffaqiyatli yaratildi");
            navigate("/list-quiz");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || error?.message || "Quiz yaratishda xatolik");
        },
    });

    // 2. Fanlar
    const {
        data: subjects_data,
        isLoading: isSubjectsLoading,
    } = useQuery({
        queryKey: ["list-subject", searchValueSubject],
        queryFn: () => GetAllSubjectApi({ limit: 20, offset: 0, search: searchValueSubject }),
    });

    // 3. O'qituvchilar
    const {
        data: teachers_data,
        isLoading: isTeachersLoading,
    } = useQuery({
        queryKey: ["list-teacher", searchValueTeacher],
        queryFn: () => GetAllTeacher({ limit: 20, offset: 0, search: searchValueTeacher }),
    });

    // 4. Guruhlar
    const {
        data: groups_data,
        isLoading: isGroupsLoading,
    } = useQuery({
        queryKey: ["list-group", searchValueGroup],
        queryFn: () => GetAllGroupApi({ limit: 20, offset: 0, search: searchValueGroup }),
    });

    // Formik
    const formik = useFormik({
        initialValues: {
            user_id: "",
            subject_id: "",
            group_id: "",
            quiz_name: "",
            question_number: "",
            quiz_time: "",
            start_time: null,
            quiz_pin: "",
        },
        validationSchema: Yup.object({
            user_id: Yup.string().required("O'qituvchi tanlanishi shart"),
            subject_id: Yup.string().required("Fan tanlanishi shart"),
            group_id: Yup.string().required("Guruh tanlanishi shart"),
            quiz_name: Yup.string().required("Quiz nomi kiritilishi shart"),
            question_number: Yup.number().typeError("Raqam bo'lishi kerak").required("Savol soni kiritilishi shart"),
            quiz_time: Yup.number().typeError("Raqam bo'lishi kerak").required("Quiz vaqti kiritilishi shart"),
            start_time: Yup.string().required("Boshlanish vaqti tanlanishi shart"),
            quiz_pin: Yup.string().min(4, "Kamida 4 ta belgi").required("Quiz PIN kiritilishi shart"),
        }),
        onSubmit: (values) => {
            const quizData = {
                user_id: values.user_id,
                subject_id: values.subject_id,
                group_id: values.group_id,
                quiz_name: values.quiz_name,
                question_number: parseInt(values.question_number),
                quiz_time: parseInt(values.quiz_time),
                start_time: values.start_time,
                quiz_pin: values.quiz_pin,
            };
            createQuizMutation.mutate(quizData);
        },
    });

    // Select options
    const subjectOptions = (subjects_data?.data || []).map((s) => ({
        value: s.id,
        label: s.name,
    }));

    const teacherOptions = (teachers_data?.data || []).map((t) => ({
        value: t.user_id,
        label: `${t.first_name} ${t.last_name}`,
    }));

    const groupOptions = (groups_data?.data || []).map((g) => ({
        value: g.id,
        label: g.name,
    }));

    return (
        <div className="space-y-6 p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800">Quiz yaratish</h2>

            <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                    <form onSubmit={formik.handleSubmit} className="space-y-4">
                        {/* Quiz nomi */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">Quiz nomi</label>
                            <input
                                type="text"
                                {...formik.getFieldProps("quiz_name")}
                                className="w-full p-3 border rounded-lg"
                                placeholder="Masalan: Matematika 1-test"
                            />
                            {formik.touched.quiz_name && formik.errors.quiz_name && (
                                <p className="text-red-500 text-sm">{formik.errors.quiz_name}</p>
                            )}
                        </div>

                        {/* Savol soni */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">Savol soni</label>
                            <input
                                type="number"
                                {...formik.getFieldProps("question_number")}
                                className="w-full p-3 border rounded-lg"
                                placeholder="10"
                            />
                            {formik.touched.question_number && formik.errors.question_number && (
                                <p className="text-red-500 text-sm">{formik.errors.question_number}</p>
                            )}
                        </div>

                        {/* Quiz vaqti */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">Quiz vaqti (daqiqa)</label>
                            <input
                                type="number"
                                {...formik.getFieldProps("quiz_time")}
                                className="w-full p-3 border rounded-lg"
                                placeholder="30"
                            />
                            {formik.touched.quiz_time && formik.errors.quiz_time && (
                                <p className="text-red-500 text-sm">{formik.errors.quiz_time}</p>
                            )}
                        </div>

                        {/* Quiz PIN */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">Quiz PIN</label>
                            <input
                                type="text"
                                {...formik.getFieldProps("quiz_pin")}
                                className="w-full p-3 border rounded-lg"
                                placeholder="1234"
                            />
                            {formik.touched.quiz_pin && formik.errors.quiz_pin && (
                                <p className="text-red-500 text-sm">{formik.errors.quiz_pin}</p>
                            )}
                        </div>

                        {/* Boshlanish vaqti */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">Boshlanish vaqti</label>
                            <DatePicker
                                selected={formik.values.start_time ? new Date(formik.values.start_time) : null}
                                onChange={(date) => {
                                    if (date) {
                                        formik.setFieldValue("start_time", dayjs(date).format("YYYY-MM-DDTHH:mm:ss"));
                                    } else {
                                        formik.setFieldValue("start_time", null);
                                    }
                                }}
                                showTimeSelect
                                timeFormat="HH:mm"
                                dateFormat="yyyy-MM-dd HH:mm"
                                placeholderText="Sanani va vaqtni tanlang"
                                className="w-full p-3 border rounded-lg"
                            />
                            {formik.touched.start_time && formik.errors.start_time && (
                                <p className="text-red-500 text-sm">{formik.errors.start_time}</p>
                            )}
                        </div>

                        {/* Fan tanlash */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">Fan</label>
                            <Select
                                isClearable
                                isLoading={isSubjectsLoading}
                                options={subjectOptions}
                                placeholder="Fan tanlang..."
                                value={subjectOptions.find(opt => opt.value === formik.values.subject_id) || null}
                                onChange={(opt) => formik.setFieldValue("subject_id", opt?.value || "")}
                                onInputChange={(val, { action }) => action === "input-change" && setSearchValueSubject(val)}
                                noOptionsMessage={() => "Fan topilmadi"}
                            />
                            {formik.touched.subject_id && formik.errors.subject_id && (
                                <p className="text-red-500 text-sm">{formik.errors.subject_id}</p>
                            )}
                        </div>

                        {/* O'qituvchi tanlash */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">O'qituvchi</label>
                            <Select
                                isClearable
                                isLoading={isTeachersLoading}
                                options={teacherOptions}
                                placeholder="O'qituvchi tanlang..."
                                value={teacherOptions.find(opt => opt.value === formik.values.user_id) || null}
                                onChange={(opt) => formik.setFieldValue("user_id", opt?.value || "")}
                                onInputChange={(val, { action }) => action === "input-change" && setSearchValueTeacher(val)}
                                noOptionsMessage={() => "O'qituvchi topilmadi"}
                            />
                            {formik.touched.user_id && formik.errors.user_id && (
                                <p className="text-red-500 text-sm">{formik.errors.user_id}</p>
                            )}
                        </div>

                        {/* Guruh tanlash */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">Guruh</label>
                            <Select
                                isClearable
                                isLoading={isGroupsLoading}
                                options={groupOptions}
                                placeholder="Guruh tanlang..."
                                value={groupOptions.find(opt => opt.value === formik.values.group_id) || null}
                                onChange={(opt) => formik.setFieldValue("group_id", opt?.value || "")}
                                onInputChange={(val, { action }) => action === "input-change" && setSearchValueGroup(val)}
                                noOptionsMessage={() => "Guruh topilmadi"}
                            />
                            {formik.touched.group_id && formik.errors.group_id && (
                                <p className="text-red-500 text-sm">{formik.errors.group_id}</p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={createQuizMutation.isPending}
                            className={`w-full py-3 rounded-lg text-white font-medium transition ${
                                createQuizMutation.isPending
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-[#3697A5] hover:bg-teal-700"
                            }`}
                        >
                            {createQuizMutation.isPending ? "Yaratilmoqda..." : "Yaratish"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateQuiz;