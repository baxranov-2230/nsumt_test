import React, {useState} from "react";
import {useQuery, useMutation} from "@tanstack/react-query";
import toast from "react-hot-toast";
import {Link} from "react-router-dom";
import {MdDelete} from "react-icons/md";
import {useUserRole} from "../../components/UserRole.jsx";
import {DeleteQuizApi, GetAllQuizApi, startQuizApi, ToggleActiveQuizApi} from "../../Api/QuizApi.jsx";

// === QUIZNI BOSHLASH UCHUN MAXSUS HOOK ===
const useStartQuiz = (quiz_id, quiz_pin) => {
    return useQuery({
        queryKey: ["startQuiz", quiz_id, quiz_pin],
        queryFn: () => startQuizApi({quiz_id, quiz_pin}),
        enabled: false, // Faqat refetch bilan ishlasin
        refetchOnWindowFocus: false,
        retry: false,
    });
};

function ListQuiz() {
    // === STATE'LAR ===
    const [isModalOpen, setIsModalOpen] = useState(null); // O'chirish modali
    const [limit] = useState(20);
    const [offset, setOffset] = useState(0);
    const [searchTerm] = useState("");
    const role = useUserRole();

    // PIN MODAL STATE
    const [pinModal, setPinModal] = useState({
        isOpen: false,
        quizId: null,
        pin: "",
    });

    // === QUIZ RO'YXATI ===
    const {data: quiz_data, refetch: refetchQuizList} = useQuery({
        queryKey: ["list-quiz", limit, offset, searchTerm],
        queryFn: () =>
            GetAllQuizApi({
                limit,
                offset,
                search: searchTerm,
            }),
    });

    const toggleMutation = useMutation({
        mutationFn: ToggleActiveQuizApi,
        onSuccess: (res) => {
            toast.success(res.message || "Holat o'zgartirildi");
            refetchQuizList();
        },
        onError: (err) => {
            toast.error(err.message || "Xatolik yuz berdi");
        },
    });

    // === QUIZ BOSHLASH ===
    const {refetch: startQuiz, isFetching: isStarting} = useStartQuiz(
        pinModal.quizId,
        pinModal.pin
    );

    const handleStartQuiz = (quizId) => {
        setPinModal({
            isOpen: true,
            quizId,
            pin: "",
        });
    };

    const sendPin = async () => {
        if (!pinModal.pin.trim()) {
            toast.error("PIN kodni kiriting");
            return;
        }

        try {
            const {data} = await startQuiz(); // API chaqiriladi
            console.log(data);
            if (data) {
                toast.success("Quiz muvaffaqiyatli boshlandi!");
                window.location.href = `/quiz-start/${pinModal.quizId}/${pinModal.pin}`;
            } else {
                toast.error(data.message || "Xatolik yuz berdi");
            }
        } catch (error) {
            toast.error("Xatolik yuz berdi. PINni tekshiring.");
            console.error("Start quiz error:", error);
        }
    };

    // === QUIZ O'CHIRISH ===
    const quizMutation = useMutation({
        mutationKey: ["delete-quiz"],
        mutationFn: DeleteQuizApi,
        onSuccess: (data) => {
            toast.success(data.message || "Quiz muvaffaqiyatli o‘chirildi");
            refetchQuizList(); // Ro'yxatni yangilash
            setIsModalOpen(null);
        },
        onError: (error) => {
            toast.error(error.message || "O‘chirishda xatolik yuz berdi");
        },
    });

    const handleDeleteClick = (quizId) => {
        setIsModalOpen(quizId);
    };

    const deleteHandler = (quizId) => {
        quizMutation.mutate(quizId);
    };

    const cancelDelete = () => {
        setIsModalOpen(null);
    };

    // === PAGINATION ===
    const totalCount = quiz_data?.total || 0;
    const totalPages = Math.ceil(totalCount / limit);
    const currentPage = Math.floor(offset / limit) + 1;

    const nextPage = () => {
        if (offset + limit < totalCount) setOffset((prev) => prev + limit);
    };

    const prevPage = () => {
        if (offset > 0) setOffset((prev) => Math.max(prev - limit, 0));
    };

    // === JSX ===
    return (
        <div className="space-y-6 p-4">
            {/* SARLAVHA */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Quizlar</h2>

                {role === "admin" && (
                    <Link to="/create-quiz" className="btn btn-primary">
                        Quiz qo'shish
                    </Link>
                )}
            </div>

            {/* JADVAL */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 overflow-x-auto">
                    <table className="w-full min-w-max">
                        <thead>
                        <tr className="text-left bg-gray-50">
                            <th className="p-3 text-gray-600">№</th>
                            <th className="p-3 text-gray-600">O'qituvchi</th>
                            <th className="p-3 text-gray-600">Fan</th>
                            <th className="p-3 text-gray-600">Guruh</th>
                            <th className="p-3 text-gray-600">Boshlanish vaqti</th>
                            <th className="p-3 text-center text-gray-600">Amallar</th>
                        </tr>
                        </thead>

                        <tbody>
                        {quiz_data?.data?.map((quiz, index) => (
                            <tr key={quiz?.quiz_id} className="border-t hover:bg-gray-50">
                                <td className="p-3">{offset + index + 1}</td>
                                <td className="p-3">
                                    {quiz?.teacher_first_name} {quiz?.teacher_last_name}
                                </td>
                                <td className="p-3">{quiz?.subject_name}</td>
                                <td className="p-3">{quiz?.group_name}</td>
                                <td className="p-3">
                                    {quiz?.start_time?.split("T")[0] || "-"}
                                </td>

                                <td className="p-3">
                                    <div className="flex justify-center gap-3">

                                        {/* STUDENT: BOSHLASH TUGMASI */}
                                        {role === "student" && (
                                            <button
                                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                                onClick={() => handleStartQuiz(quiz?.quiz_id)}
                                            >
                                                Boshlash
                                            </button>
                                        )}

                                        {/* ADMIN: O'CHIRISH */}
                                        {role === "admin" && (
                                            <button
                                                className="text-red-600 hover:text-red-800 transition text-2xl"
                                                onClick={() => handleDeleteClick(quiz?.quiz_id)}
                                                title="O'chirish"
                                            >
                                                <MdDelete/>
                                            </button>
                                        )}
                                        {/* ACTIVE / PASSIVE BUTTON */}
                                        {role === "admin" && (
                                            <button
                                                onClick={() =>
                                                    toggleMutation.mutate({
                                                        quiz_id: quiz?.quiz_id,
                                                        active: !quiz?.activate,
                                                    })
                                                }
                                                className={`px-4 py-2 rounded text-white transition ${
                                                    quiz?.activate
                                                        ? "bg-green-600 hover:bg-green-700"
                                                        : "bg-gray-500 hover:bg-gray-600"
                                                }`}
                                            >
                                                {quiz?.activate ? "Faol" : "Nofaol"}
                                            </button>
                                        )}
                                    </div>

                                    {/* O'CHIRISH MODALI */}
                                    {isModalOpen === quiz?.quiz_id && (
                                        <div
                                            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                                            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
                                                <h2 className="text-lg font-semibold mb-3">
                                                    O‘chirishni tasdiqlang
                                                </h2>
                                                <p className="mb-5 text-sm">
                                                        <span className="text-red-600 font-medium">
                                                            {quiz?.quiz_name || "Bu quiz"}
                                                        </span>{" "}
                                                    ni haqiqatan ham o‘chirmoqchimisiz?
                                                </p>
                                                <div className="flex justify-end gap-3">
                                                    <button
                                                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                                                        onClick={cancelDelete}
                                                    >
                                                        Bekor qilish
                                                    </button>
                                                    <button
                                                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                                                        onClick={() => deleteHandler(quiz?.quiz_id)}
                                                        disabled={quizMutation.isLoading}
                                                    >
                                                        {quizMutation.isLoading ? "O‘chirilmoqda..." : "O‘chirish"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {/* Agar ma'lumot bo'lmasa */}
                    {quiz_data?.data?.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            Hech qanday quiz topilmadi
                        </div>
                    )}
                </div>

                {/* PAGINATION */}
                <div className="flex justify-between items-center px-6 py-3 border-t">
                    <button
                        onClick={prevPage}
                        disabled={offset === 0}
                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
                    >
                        Oldingi
                    </button>

                    <span className="text-sm text-gray-600">
                        Sahifa: {currentPage} / {totalPages || 1}
                    </span>

                    <button
                        onClick={nextPage}
                        disabled={offset + limit >= totalCount}
                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
                    >
                        Keyingi
                    </button>
                </div>
            </div>

            {/* PIN KIRITISH MODALI */}
            {pinModal.isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-xs">
                        <h2 className="text-lg font-bold mb-4 text-center">
                            PIN kodni kiriting
                        </h2>

                        <input
                            type="text"
                            placeholder="PIN"
                            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={pinModal.pin}
                            onChange={(e) =>
                                setPinModal((prev) => ({...prev, pin: e.target.value}))
                            }
                            onKeyPress={(e) => e.key === "Enter" && sendPin()}
                            autoFocus
                        />

                        <div className="flex justify-end gap-3">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                                onClick={() =>
                                    setPinModal({isOpen: false, quizId: null, pin: ""})
                                }
                            >
                                Bekor
                            </button>

                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-70"
                                onClick={sendPin}
                                disabled={isStarting}
                            >
                                {isStarting ? "Tekshirilmoqda..." : "Boshlash"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ListQuiz;