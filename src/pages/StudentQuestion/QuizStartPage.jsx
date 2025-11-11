import React, {useState, useEffect, useCallback} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {startQuizApi, submitQuizApi} from "../../Api/QuizApi.jsx";

function QuizStart() {
    const {quiz_id, quiz_pin} = useParams();
    const navigate = useNavigate();

    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [result, setResult] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [timeUpModal, setTimeUpModal] = useState(false);


    const {
        data: quizData,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["startQuiz", quiz_id, quiz_pin],
        queryFn: () => startQuizApi({quiz_id, quiz_pin}),
        enabled: !!quiz_id && !!quiz_pin,
        staleTime: Infinity, // Ma'lumotlar eskirmaydi
        cacheTime: 1000 * 60 * 60, // 1 soat keshda saqlanadi
        onSuccess: (data) => {
            // if (data.duration) setTimeLeft(data.duration * 60);
        },
    });
    const finishQuiz = async () => {
        const payload = {
            quiz_id: Number(quiz_id),
            questions: answers,
        };

        try {
            const res = await submitQuizApi(payload);
            setResult(res.summary);
        } catch (error) {
            alert("Xatolik yuz berdi");
        }
    };

    useEffect(() => {
        if (!quizData?.duration) return;

        const totalSeconds = quizData.duration*60;
        setTimeLeft(totalSeconds);

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setTimeUpModal(true);   // ⬅ faqat modal ochiladi
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [quizData?.duration]);


    // useEffect(() => {
    //     if (!quizData?.duration) return;
    //
    //     // Backenddan kelgan vaqtni o‘rnatamiz
    //     const totalSeconds = quizData.duration;
    //     setTimeLeft(totalSeconds);
    //
    //     const interval = setInterval(() => {
    //         setTimeLeft((prev) => {
    //             if (prev <= 1) {
    //                 clearInterval(interval);
    //                 finishQuiz();
    //                 return 0;
    //             }
    //             return prev - 1;
    //         });
    //     }, 1000);
    //
    //     return () => clearInterval(interval);
    //
    // }, [quizData?.duration]);


    const formatTime = () => {
        const m = Math.floor(timeLeft / 60);
        const s = timeLeft % 60;
        return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    };


    // useEffect(() => {
    //     if (!timeLeft) return;
    //     const interval = setInterval(() => {
    //         setTimeLeft((t) => {
    //             if (t <= 1) {
    //                 clearInterval(interval);
    //                 finishQuiz();
    //             }
    //             return t - 1;
    //         });
    //     }, 1000);
    //     return () => clearInterval(interval);
    // }, [timeLeft]);

    if (isLoading) return <div>Yuklanmoqda...</div>;
    if (isError || !quizData) return <div className="text-red-600">Test topilmadi</div>;

    const questions = quizData.questions || [];
    const currentQuestion = questions[current];
    const isHtml = currentQuestion.text.includes("<");

    const handleAnswer = (option) => {
        setAnswers((prev) => {
            const exists = prev.find((a) => a.id === currentQuestion.id);
            if (exists) {
                return prev.map((a) =>
                    a.id === currentQuestion.id ? {...a, option} : a
                );
            }
            return [...prev, {id: currentQuestion.id, option}];
        });
    };


    // const formatTime = () => {
    //     const m = Math.floor(timeLeft / 60);
    //     const s = timeLeft % 60;
    //     return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    // };

    return (
        <div className="flex max-w-5xl mx-auto mt-6 gap-4">
            {/* LEFT SIDE — QUESTION LIST */}
            <div className="w-1/4 bg-white rounded-xl shadow p-4 h-fit sticky top-4">
                <h2 className="text-lg font-bold mb-3">Savollar</h2>

                <div className="grid grid-cols-5 gap-2">
                    {questions.map((q, idx) => {
                        const active = current === idx;
                        const answered = answers.find((a) => a.id === q.id);

                        return (
                            <button
                                key={idx}
                                onClick={() => setCurrent(idx)}
                                className={`
                                    w-10 h-10 rounded-full flex items-center justify-center
                                    text-sm font-bold transition
                                    ${active ? "bg-blue-600 text-white"
                                    : answered ? "bg-green-500 text-white"
                                        : "bg-gray-200"}
                                `}
                            >
                                {idx + 1}
                            </button>
                        );
                    })}
                </div>

                <button
                    onClick={finishQuiz}
                    className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded"
                >
                    Yakunlash
                </button>

                <div className="mt-4 p-3 bg-gray-100 rounded text-center">
                    <h3 className="text-md font-bold">Qolgan vaqt:</h3>
                    <p className="text-2xl font-mono">{formatTime()}</p>
                </div>

            </div>

            {/* RIGHT SIDE — ACTIVE QUESTION */}
            <div className="flex-1 bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold mb-4">
                    {current + 1}. Savol
                </h2>

                {isHtml ? (
                    <div dangerouslySetInnerHTML={{__html: currentQuestion.text}}/>
                ) : (
                    <p className="text-lg">{currentQuestion.text}</p>
                )}

                <div className="space-y-3 mt-6">
                    {currentQuestion.options.map((opt, i) => {
                        const isActive = answers.find(
                            (a) => a.id === currentQuestion.id && a.option === opt
                        );

                        return (
                            <button
                                key={i}
                                onClick={() => handleAnswer(opt)}
                                className={`w-full text-left p-4 rounded-lg shadow transition
                                    ${isActive ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
                                dangerouslySetInnerHTML={{__html: opt}}
                            />
                        );
                    })}
                </div>

                <div className="flex justify-between mt-6">
                    <button
                        onClick={() => setCurrent((c) => c - 1)}
                        disabled={current === 0}
                        className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                    >
                        Oldingi
                    </button>

                    <button
                        onClick={() => setCurrent((c) => c + 1)}
                        disabled={current === questions.length - 1}
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        Keyingi
                    </button>
                </div>
            </div>

            {timeUpModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg w-96 shadow-lg space-y-4">
                        <h2 className="text-xl font-bold text-center text-red-600">
                            Vaqt tugadi!
                        </h2>

                        <p className="text-center">
                            Testni yakunlash uchun tugmani bosing.
                        </p>

                        <button
                            onClick={finishQuiz}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded"
                        >
                            Yakunlash
                        </button>
                    </div>
                </div>
            )}


            {/* RESULT MODAL */}
            {result && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg w-96 shadow-lg space-y-4">
                        <h2 className="text-2xl font-bold text-center">
                            Test natijalari
                        </h2>

                        <p><b>Test ID:</b> {result.quiz_id}</p>
                        <p><b>Jami savollar:</b> {result.total_answered}</p>
                        <p><b>To‘g‘ri:</b> {result.correct_answers}</p>
                        <p><b>Noto‘g‘ri:</b> {result.incorrect_answers}</p>
                        <p><b>Baho:</b> {result.grade}</p>
                        <p><b>Foiz:</b> {result.percentage}%</p>

                        <button
                            onClick={() => navigate("/list-quiz")}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded"
                        >
                            Yopish
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default QuizStart;
