import React, {useEffect} from "react";
import {useFormik} from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";
import {useMutation, useQuery} from "@tanstack/react-query";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {CreateEmployeeApi} from "../../Api/EmployeeApi.jsx";
import {GetAllSubject} from "../../Api/SubjectApi.jsx";
import {CreateQuestionApi} from "../../Api/QuestionApi.jsx";

function CreateQuestion() {
    const navigate = useNavigate();

    const {data: subjects_data} = useQuery({
        queryKey: ["list-subject"],
        queryFn: GetAllSubject,
    });

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
    const formik = useFormik({
        initialValues: {
            text: "",
            image: null,
            option_a: "",
            option_a_image: null,
            option_b: "",
            option_b_image: null,
            option_c: "",
            option_c_image: null,
            option_d: "",
            option_d_image: null,
            option_e_image: null,
            subjectId: "",

        },
        validationSchema: Yup.object({
            // name_uz: Yup.string().required("!!! To'ldirish shart"),
            // name_ru: Yup.string().required("!!! To'ldirish shart"),
            // name_en: Yup.string().required("!!! To'ldirish shart"),
            // faculty_icon: Yup.string().required("!!! To'ldirish shart"),
        }),
        onSubmit: (values) => {
            const questionData = {
                text: values.text,
                image: values.image,
                option_a: values.option_a,
                option_a_image: values.option_a_image,
                option_b: values.option_b,
                option_b_image: values.option_b_image,
                option_c: values.option_c,
                option_c_image: values.option_c_image,
                option_d: values.option_d,
                option_d_image: values.option_d_image,
                subjectId: values.subjectId,
            };

            console.log(values);
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
    return (<div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Xodim qo'shish</h2>
        <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b bg-gray-50">
                <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 gap-3">
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Fanni tanlash</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={formik.values.subjectId}
                            label="Subject"
                            name="subjectId"
                            onChange={formik.handleChange}
                        >
                            {isLoading ? (
                                <MenuItem disabled>Loading...</MenuItem>
                            ) : (
                                subjects_data?.map((subject) => (
                                    <MenuItem key={subject?.id} value={subject?.id}>
                                        {subject?.name}
                                    </MenuItem>
                                ))
                            )}
                        </Select>
                    </FormControl>
                    <div className="w-full">
                        <label htmlFor="text"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Savolni kiriting
                        </label>
                        <input type="text"
                               id="text"
                               name="text"
                               {...formik.getFieldProps("text")}
                               className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                        <input
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                            id="image"
                            name="image"
                            type="file"
                            onChange={(event) => {
                                formik.setFieldValue("image", event.currentTarget.files[0]);
                            }}
                        />
                    </div>
                    <div className="w-full">
                        <label htmlFor="option_a"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            A variantini kiriting
                        </label>
                        <input type="text"
                               id="option_a"
                               name="option_a"
                               {...formik.getFieldProps("option_a")}
                               className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                        <input
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                            id="option_a_image"
                            name="option_a_image"
                            type="file"
                            onChange={(event) => {
                                formik.setFieldValue("option_a_image", event.currentTarget.files[0]);
                            }}
                        />
                    </div>

                    <div className="w-full">
                        <label htmlFor="option_b"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            B variantini kiriting
                        </label>
                        <input type="text"
                               id="option_b"
                               name="option_b"
                               {...formik.getFieldProps("option_b")}
                               className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                        <input
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                            id="option_b_image"
                            name="option_b_image"
                            type="file"
                            onChange={(event) => {
                                formik.setFieldValue("option_b_image", event.currentTarget.files[0]);
                            }}
                        />
                    </div>
                    <div className="w-full">
                        <label htmlFor="option_c"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            C variantini kiriting
                        </label>
                        <input type="text"
                               id="option_c"
                               name="option_c"
                               {...formik.getFieldProps("option_c")}
                               className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                        <input
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                            id="option_c_image"
                            name="option_c_image"
                            type="file"
                            onChange={(event) => {
                                formik.setFieldValue("option_c_image", event.currentTarget.files[0]);
                            }}
                        />
                    </div>
                    <div className="w-full">
                        <label htmlFor="option_d"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            D variantini kiriting
                        </label>
                        <input type="text"
                               id="option_d"
                               name="option_d"
                               {...formik.getFieldProps("option_d")}
                               className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                        <input
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                            id="option_d_image"
                            name="option_d_image"
                            type="file"
                            onChange={(event) => {
                                formik.setFieldValue("option_d_image", event.currentTarget.files[0]);
                            }}
                        />
                    </div>



                    <button type="submit"
                            className="focus:outline-none w-full text-white bg-[#3697A5] hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">
                        Qo'shish
                    </button>
                </form>
            </div>


        </div>

    </div>);
}

export default CreateQuestion;