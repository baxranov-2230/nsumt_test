import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CreateUserApi, CreateTeacherApi } from "../../Api/TeacherApi.jsx";
import { GetAllChairApi } from "../../Api/ChairApi.jsx";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

function CreateTeacher() {
    const navigate = useNavigate();
    const { data: chair_data, isLoading } = useQuery({
        queryKey: ["list-chair"],
        queryFn: GetAllChairApi,
    });
    // 1️⃣ Foydalanuvchini yaratish (username, password)
    const createUserMutation = useMutation({
        mutationKey: ["create-user"],
        mutationFn: CreateUserApi,
        onError: (error) => {
            toast.error(error?.message || "Foydalanuvchi yaratishda xatolik");
        },
    });

    // 2️⃣ O‘qituvchini yaratish (teacher info)
    const createTeacherMutation = useMutation({
        mutationKey: ["create-teacher"],
        mutationFn: CreateTeacherApi,
        onSuccess: (data) => {
            toast.success(data.message || "O‘qituvchi muvaffaqiyatli yaratildi");
            navigate("/list-teacher");
        },
        onError: (error) => {
            toast.error(error?.message || "O‘qituvchi yaratishda xatolik");
        },
    });

    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
            chair_id: "",
            first_name: "",
            last_name: "",
            patronymic: "",
        },
        validationSchema: Yup.object({
            username: Yup.string().required("Username shart"),
            password: Yup.string().required("Parol shart"),
            chair_id: Yup.number().required("Kafedra tanlang"),
            first_name: Yup.string().required("Ismni kiriting"),
            last_name: Yup.string().required("Familiyani kiriting"),
            patronymic: Yup.string().required("Sharifni kiriting"),
        }),
        onSubmit: async (values) => {
            try {
                // 1️⃣ Avval userni yaratamiz
                const userRes = await createUserMutation.mutateAsync({
                    username: values.username,
                    password: values.password,
                });

                // 2️⃣ user_id ni olib, teacher yaratamiz
                const user_id = userRes?.data?.id || userRes?.id;
                if (!user_id) throw new Error("user_id topilmadi");

                await createTeacherMutation.mutateAsync({
                    user_id,
                    chair_id: values.chair_id,
                    first_name: values.first_name,
                    last_name: values.last_name,
                    patronymic: values.patronymic,
                });
            } catch (error) {
                console.error(error);
                toast.error(error.message || "Jarayon davomida xatolik yuz berdi");
            }
        },
    });

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">O‘qituvchi qo‘shish</h2>

            <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b bg-gray-50">
                    <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 gap-3">
                        {/* Username */}
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900">
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                {...formik.getFieldProps("username")}
                                className="block w-full p-3 border rounded-lg"
                            />
                            {formik.touched.username && formik.errors.username && (
                                <p className="text-red-500 text-sm">{formik.errors.username}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900">
                                Parol
                            </label>
                            <input
                                type="password"
                                name="password"
                                {...formik.getFieldProps("password")}
                                className="block w-full p-3 border rounded-lg"
                            />
                            {formik.touched.password && formik.errors.password && (
                                <p className="text-red-500 text-sm">{formik.errors.password}</p>
                            )}
                        </div>

                        {/* Teacher ma’lumotlari */}
                        <div className="grid grid-cols-3 gap-3">
                            <input
                                type="text"
                                name="first_name"
                                placeholder="Ism"
                                {...formik.getFieldProps("first_name")}
                                className="block w-full p-3 border rounded-lg"
                            />
                            <input
                                type="text"
                                name="last_name"
                                placeholder="Familiya"
                                {...formik.getFieldProps("last_name")}
                                className="block w-full p-3 border rounded-lg"
                            />
                            <input
                                type="text"
                                name="patronymic"
                                placeholder="Sharif"
                                {...formik.getFieldProps("patronymic")}
                                className="block w-full p-3 border rounded-lg"
                            />
                        </div>

                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Kafedrani tanlang</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={formik.values.facultyId}
                                label="Chair"
                                name="chair_id"
                                {...formik.getFieldProps("chair_id")}
                                onChange={formik.handleChange}
                            >
                                {isLoading ? (
                                    <MenuItem disabled>Loading...</MenuItem>
                                ) : (
                                    chair_data?.map((chair) => (
                                        <MenuItem key={chair?.id} value={chair?.id}>
                                            {chair?.name}
                                        </MenuItem>
                                    ))
                                )}
                            </Select>
                        </FormControl>

                        {/* <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900">
                                Kafedra ID
                            </label>
                            <input
                                type="number"
                                name="chair_id"
                                {...formik.getFieldProps("chair_id")}
                                className="block w-full p-3 border rounded-lg"
                            />
                        </div> */}

                        <button
                            type="submit"
                            className="focus:outline-none w-full text-white bg-[#3697A5] hover:bg-teal-700 font-medium rounded-lg text-sm px-5 py-2.5"
                            disabled={
                                createUserMutation.isPending ||
                                createTeacherMutation.isPending
                            }
                        >
                            {createTeacherMutation.isPending
                                ? "Yaratilmoqda..."
                                : "Qo‘shish"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateTeacher;
