import React, {useEffect} from "react";
import {useFormik} from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";
import {useMutation} from "@tanstack/react-query";

import {CreateEmployeeApi} from "../../Api/EmployeeApi.jsx";

function CreateEmployee() {
    const navigate = useNavigate();

    const employeeMutation = useMutation({
        mutationKey: ["create-employee"],
        mutationFn: CreateEmployeeApi,
        onSuccess: (data) => {
            toast.success(data.message || "Xodim muvaffaqiyatli yaratildi");
        },
        onError: (error) => {
            toast.error(error.message || "Xatolik yuz berdi");
        },
    });
    const formik = useFormik({
        initialValues: {
            username: "",
            first_name: "",
            last_name: "",
            third_name: "",
            passport_serial: "",
            department: "",
            file: null,
        },
        validationSchema: Yup.object({
            // name_uz: Yup.string().required("!!! To'ldirish shart"),
            // name_ru: Yup.string().required("!!! To'ldirish shart"),
            // name_en: Yup.string().required("!!! To'ldirish shart"),
            // faculty_icon: Yup.string().required("!!! To'ldirish shart"),
        }),
        onSubmit: (values) => {
            const employeeData = {
                username: values.username,
                first_name: values.first_name,
                last_name: values.last_name,
                third_name: values.third_name,
                passport_serial: values.passport_serial,
                department: values.department,
                file: values.file,
            };

            console.log(values);
            employeeMutation.mutate(employeeData);
        },
    });
    const isSuccess = employeeMutation.isSuccess;
    const isLoading = employeeMutation.isLoading;
    useEffect(() => {
        if (isSuccess) {
            navigate("/list-employee");
        }
    }, [navigate, isSuccess]);
    return (<div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Xodim qo'shish</h2>
        <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b bg-gray-50">
                <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 gap-3">
                    <div className="w-full">
                        <label htmlFor="username"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            JSHSHIR
                        </label>
                        <input type="text"
                               id="username"
                               name="username"
                               {...formik.getFieldProps("username")}
                               className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>

                    </div>
                    <div className="w-full">
                        <label htmlFor="first_name"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Ismi
                        </label>
                        <input type="text"
                               id="first_name"
                               name="first_name"
                               {...formik.getFieldProps("first_name")}
                               className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>

                    </div>
                    <div className="w-full">
                        <label htmlFor="last_name"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Familiyasi
                        </label>
                        <input type="text"
                               id="last_name"
                               name="last_name"
                               {...formik.getFieldProps("last_name")}
                               className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                    </div>
                    <div className="w-full">
                        <label htmlFor="third_name"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Otasining ismi
                        </label>
                        <input type="text"
                               id="third_name"
                               name="third_name"
                               {...formik.getFieldProps("third_name")}
                               className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                    </div>
                    <div className="w-full">
                        <label htmlFor="passport_serial"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Pasport seriyasi
                        </label>
                        <input type="text"
                               id="passport_serial"
                               name="passport_serial"
                               {...formik.getFieldProps("passport_serial")}
                               className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                    </div>
                    <div className="w-full">
                        <label htmlFor="department"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Bo'limi
                        </label>
                        <input type="text"
                               id="department"
                               name="department"
                               {...formik.getFieldProps("department")}
                               className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                    </div>
                    <div className="w-full">
                        <label
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            htmlFor="file"
                        >
                            Rasmni yuklang
                        </label>
                        <input
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                            id="file"
                            name="file"
                            type="file"
                            onChange={(event) => {
                                formik.setFieldValue("file", event.currentTarget.files[0]);
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

export default CreateEmployee;