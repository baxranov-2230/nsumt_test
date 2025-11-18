import React from "react";
import { useQuery } from "@tanstack/react-query";
import { GetResultByFiledApi } from "../../Api/ResultApi.jsx";
import {useParams} from "react-router-dom"; // API manzili sizga qarab

function ResultListByField() {
    const {quiz_id} = useParams();
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["result-by-filed", quiz_id],
        queryFn: () => GetResultByFiledApi({ quiz_id }),
        enabled: !!quiz_id, // quiz_id bo‘lsa API chaqiriladi
        retry: false,
    });

    // === LOADING ===
    if (isLoading) {
        return (
            <div className="p-4 text-center text-blue-600 font-medium">
                Yuklanmoqda...
            </div>
        );
    }

    // === ERROR ===
    if (isError) {
        return (
            <div className="p-4 text-center text-red-600 font-medium">
                Xatolik yuz berdi: {error?.message}
            </div>
        );
    }

    // === MA'LUMOT YO‘Q ===
    if (!data || data.length === 0) {
        return (
            <div className="p-4 text-center text-gray-600">
                Natija topilmadi
            </div>
        );
    }

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Natijalar</h2>


            <div className="overflow-x-auto rounded shadow bg-white">
                <table className="w-full text-left min-w-max">
                    <thead>
                    <tr className="bg-gray-100">
                        <th className="p-3">№</th>
                        <th className="p-3">F.I.Sh</th>
                        <th className="p-3">Fan nomi</th>
                        <th className="p-3">Baho</th>
                    </tr>
                    </thead>

                    <tbody>
                    {data.map((item, index) => (
                        <tr key={item?.student?.id} className="border-t hover:bg-gray-50">
                            <td className="p-3">{index + 1}</td>
                            <td className="p-3">
                                {item?.student?.student?.full_name}
                            </td>
                            <td className="p-3">{item?.subject?.name}</td>
                            <td className="p-3">{item?.grade}</td>
                            {/*<td className="p-3">{item?.percent}%</td>*/}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ResultListByField;
