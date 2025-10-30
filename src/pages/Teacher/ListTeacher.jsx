
import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { GetAllTeacher } from "../../Api/TeacherApi";




function ListTeacher() {
    const { data: teacher_data } = useQuery({
        queryKey: ["list-teacher"],
        queryFn: GetAllTeacher,
    });
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">O'qituvchilar ro'yxati</h1>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                {teacher_data?.map((teacher) => {
                    return (
                        <div key={teacher.id}>
                            <h1>{teacher.first_name} {teacher.last_name} {teacher.patronymic}</h1>
                        </div>
                    )

                })}
            </div>
        </div>
    )
}

export default ListTeacher;