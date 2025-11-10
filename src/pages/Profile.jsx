import React, {useState, useRef} from "react";
import {Camera} from "lucide-react";
import {useQuery} from "@tanstack/react-query";
import {UserMe} from "../Api/UserApi.jsx";

function Profile() {
    const [profileImage, setProfileImage] = useState(null);
    const fileInputRef = useRef(null);

    const {isError, isSuccess, isLoading, data: student, error, refetch} = useQuery({
        queryKey: ['userMe'],
        queryFn: UserMe,
    })

    const studentInfo = {
        personal: {
            fullName: "Eshmatov Toshmat",
            birthDate: "1999-05-15",
            passport: "AA1234567",
            phone: "+998 90 123 45 67",
            email: "john.smith@example.com",
            address: "Toshkent sh., Chilonzor t., 15-uy",
        },
        academic: {
            faculty: "Kompyuter injiniringi fakulteti",
            direction: "Dasturiy injiniring",
            group: "318-21",
            course: 2,
            type: "To'lov-kontrakt",
            status: "Aktiv",
        },
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Profil</h2>

            <div className="bg-white rounded-lg shadow">
                <div className="p-6 flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-6">
                    <div className="relative">
                        <div
                            className="w-32 h-32 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden cursor-pointer"
                            onClick={handleImageClick}
                        >
                            {student?.student?.image_path ? (
                                <img
                                    src={student?.student?.image_path}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-3xl font-bold text-gray-400">ET</span>
                            )}
                        </div>
                        {/*<button*/}
                        {/*  className="absolute bottom-2 right-2 bg-white rounded-full p-1.5 shadow-lg"*/}
                        {/*  onClick={handleImageClick}*/}
                        {/*>*/}
                        {/*  <Camera className="h-4 w-4 text-gray-600" />*/}
                        {/*</button>*/}
                        {/*<input*/}
                        {/*  type="file"*/}
                        {/*  ref={fileInputRef}*/}
                        {/*  className="hidden"*/}
                        {/*  accept="image/*"*/}
                        {/*  onChange={handleImageChange}*/}
                        {/*/>*/}
                    </div>

                    <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                            {student?.student?.full_name}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Fakultet</p>
                                <p className="font-medium">{student?.student?.faculty}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Yo'nalish</p>
                                <p className="font-medium">{student?.student?.specialty}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Guruh</p>
                                <p className="font-medium">{student?.student?.group}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Kurs</p>
                                <p className="font-medium">
                                    {student?.student?.level}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t">
                    <div className="p-6">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">
                            Shaxsiy ma'lumotlar
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Tug'ilgan sana</p>
                                <p className="font-medium">{student?.student?.birth_date}</p>
                            </div>
                            {/*<div>*/}
                            {/*    <p className="text-sm text-gray-500">Passport</p>*/}
                            {/*    <p className="font-medium">{student?.passport_number}</p>*/}
                            {/*</div>*/}
                            <div>
                                <p className="text-sm text-gray-500">Telefon</p>
                                <p className="font-medium">{student?.student?.phone}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Talaba ID raqami</p>
                                <p className="font-medium">{student?.student?.student_id_number}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t">
                    <div className="p-6">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">
                            O'qish ma'lumotlari
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">O'qish turi</p>
                                <p className="font-medium">{student?.student?.paymentForm}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Holati</p>
                                <span
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {student?.student?.studentStatus}
                </span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <p className="text-sm text-gray-500">Ta'lim shakli</p>
                                <p className="font-medium">{student?.student?.educationForm}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Ta'lim turi</p>
                                <p className="font-medium">{student?.student?.educationType}</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;