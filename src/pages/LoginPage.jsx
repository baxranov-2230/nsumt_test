import {useEffect, useState} from "react";
import {
    Card,
    Input,
    Checkbox,
    // Button,
    Typography,
} from "@material-tailwind/react";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import {useMutation} from "@tanstack/react-query";
import {replace, useFormik} from "formik";
import * as Yup from "yup";
import {LoginApi} from "../Api/LoginApi";
import {LogIn} from 'lucide-react'
import { GrHide } from "react-icons/gr";
import { BiShow } from "react-icons/bi";

export default function LoginPage() {
    const navigate = useNavigate();
    // const { login, isLoggedIn } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => {
        setShowPassword((prev) => !prev);
    };
    const loginMutation = useMutation({
        mutationKey: ["login-user"],
        mutationFn: LoginApi,
        onSuccess: (data) => {
            toast.success(data.message || "Successfully");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
    const isSuccess = loginMutation.isSuccess;

    useEffect(() => {
        if (isSuccess) {
            navigate("/dashboard");
            window.location.reload();
        }
    }, [navigate, isSuccess]);
    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        validationSchema: Yup.object({
            username: Yup.string().required("email is required"),
            password: Yup.string().required("password is required"),
        }),
        onSubmit: (values) => {
            const loginData = {
                username: values.username,
                password: values.password,
            };
            loginMutation.mutate(loginData);
        },
    });
    return (
        <div className="bg-gray-100 w-full flex mt-[10%] min-h-[80%] justify-center items-center  overflow-hidden">
            <div
                className="bg-white rounded-lg shadow-lg w-full max-w-6xl h-[80%] md:h-[80%] flex flex-col md:flex-row overflow-hidden">
                {/* Chap qism */}
                <div className="md:w-1/2 bg-blue-600 text-white p-8 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold mb-4">Grantga ariza topshirish</h2>
                    <p className="text-lg">
                        Ushbu platforma orqali talabalar grant uchun ariza topshirishi
                        mumkin. Natijalarni profil orqali kuzating.
                    </p>
                    <ul className="mt-6 list-disc pl-5 text-blue-100 text-sm space-y-2">
                        <li>Profil orqali ariza topshiring</li>
                        {/*<li>PDF hujjatlarni biriktiring</li>*/}
                        <li>Holatni tekshirib boring</li>
                    </ul>
                </div>
                {/* O‘ng qism */}
                <div className="md:w-1/2 p-8 flex flex-col justify-center">
                    <div className="flex justify-center mb-6">
                        <div className="bg-blue-500 p-3 rounded-full">
                            <LogIn className="w-8 h-8 text-white"/>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-center mb-6">
                        Kabinitga kirish
                    </h2>

                    {/*<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">*/}

                    {/*</div>*/}

                    <form onSubmit={formik.handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-semibold mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                {...formik.getFieldProps("username")}
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-semibold mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    {...formik.getFieldProps("password")}
                                    className=" w-full  px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={togglePassword}
                                    className="absolute right-2 top-3 text-xl items-center  text-blue-500"
                                >
                                    {showPassword ? <GrHide/> : <BiShow/>}
                                </button>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200 font-semibold"
                        >
                            Kirish
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
