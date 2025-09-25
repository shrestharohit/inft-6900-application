// src/Pages/QuizPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import beforeAuthLayout from "../components/BeforeAuth";

// Dummy quiz data (keep as placeholder for now)
const dummyQuiz = [
  {
    id: 1,
    question: "What is 2 + 2?",
    options: [
      { id: 1, text: "3", correct: false, feedback: "2 + 2 equals 4, so 3 is incorrect." },
      { id: 2, text: "4", correct: true, feedback: "Correct! 2 + 2 = 4." },
      { id: 3, text: "5", correct: false, feedback: "2 + 2 equals 4, not 5." },
    ],
  },
  {
    id: 2,
    question: "What is the capital of France?",
    options: [
      { id: 1, text: "Berlin", correct: false, feedback: "Berlin is the capital of Germany." },
      { id: 2, text: "Paris", correct: true, feedback: "Correct! Paris is the capital of France." },
      { id: 3, text: "London", correct: false, feedback: "London is the capital of the UK." },
    ],
  },
];

const QuizPage = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [attempts, setAttempts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [currentAttempt, setCurrentAttempt] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);

  const handleOptionChange = (questionId, optionId) => {
    setAnswers({ ...answers, [questionId]: optionId });
  };

  const calculateResult = () => {
    let correctCount = 0;
    const feedback = dummyQuiz.map((q) => {
      const selectedOptionId = answers[q.id];
      const selectedOption = q.options.find((o) => o.id === selectedOptionId);
      if (selectedOption?.correct) correctCount++;
      return {
        question: q.question,
        selectedOption: selectedOption?.text,
        correct: selectedOption?.correct || false,
        feedback: selectedOption?.feedback,
      };
    });

    const score = Math.round((correctCount / dummyQuiz.length) * 100);
    const passed = score >= 80;

    const attempt = { id: attempts.length + 1, score, passed, feedback };
    setAttempts([...attempts, attempt]);
    setCurrentAttempt(attempt);
    setShowResult(true);
    setAnswers({});
    setQuizStarted(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 py-10 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Back to Module */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
          >
            &larr; Back to Module
          </button>
        </div>

        {/* Quiz Heading */}
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
          Module Quiz
        </h1>

        {/* Pre-Quiz Info */}
        {!quizStarted && !showResult && (
          <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-200 text-center">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">
              Ready to test your knowledge?
            </h2>
            <p className="text-gray-600 mb-3">
              <strong>{dummyQuiz.length}</strong> questions | Passing score:{" "}
              <strong>80%</strong>
            </p>
            <p className="text-gray-600 mb-6">
              Attempts made:{" "}
              <span className="font-semibold text-blue-600">{attempts.length}</span>
            </p>
            <button
              onClick={() => setQuizStarted(true)}
              className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg shadow-lg transition"
            >
              Start Quiz
            </button>
          </div>
        )}

        {/* Quiz Screen */}
        {quizStarted && !showResult && (
          <div className="space-y-6">
            {dummyQuiz.map((q, idx) => (
              <div
                key={q.id}
                className="p-6 bg-white rounded-xl shadow-lg border border-gray-200"
              >
                <p className="text-lg font-semibold mb-4 text-gray-800">
                  Q{idx + 1}. {q.question}
                </p>
                <div className="space-y-3">
                  {q.options.map((o) => (
                    <label
                      key={o.id}
                      className={`block cursor-pointer p-4 rounded-lg border transition ${
                        answers[q.id] === o.id
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        value={o.id}
                        checked={answers[q.id] === o.id}
                        onChange={() => handleOptionChange(q.id, o.id)}
                        className="mr-3 accent-blue-600"
                      />
                      {o.text}
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <button
              onClick={calculateResult}
              className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-lg shadow-lg transition"
            >
              Submit Quiz
            </button>
          </div>
        )}

        {/* Quiz Result */}
        {showResult && currentAttempt && (
          <div className="space-y-6">
            <div
              className={`p-6 rounded-xl shadow-lg border ${
                currentAttempt.passed
                  ? "border-green-500 bg-green-50"
                  : "border-red-500 bg-red-50"
              }`}
            >
              <h2
                className={`text-xl font-bold mb-2 ${
                  currentAttempt.passed ? "text-green-700" : "text-red-700"
                }`}
              >
                Attempt #{currentAttempt.id} -{" "}
                {currentAttempt.passed ? "Passed ✅" : "Failed ❌"}
              </h2>
              <p className="text-gray-700 font-medium">
                Score: <span className="font-bold">{currentAttempt.score}%</span>
              </p>
            </div>

            <h3 className="text-lg font-semibold text-gray-800">Feedback</h3>
            {currentAttempt.feedback.map((f, idx) => (
              <div
                key={idx}
                className="p-5 bg-white rounded-lg border-l-4 shadow-sm mb-3
                  border-l-gray-300 hover:shadow-md transition"
              >
                <p className="font-medium text-gray-800">
                  <strong>Q:</strong> {f.question}
                </p>
                <p className="text-gray-600">
                  <strong>Your answer:</strong> {f.selectedOption || "No answer"}
                </p>
                <p className="italic text-gray-700">{f.feedback}</p>
              </div>
            ))}

            <div className="flex gap-4 mt-4">
              {currentAttempt.passed ? (
                <button
                  onClick={() =>
                    navigate("/certificate", {
                      state: {
                        name: "John Doe", // you can replace with logged-in student name
                        course: "Module Quiz",
                        score: currentAttempt.score,
                      },
                    })
                  }
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow-md"
                >
                  🎉 Generate Certificate
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowResult(false);
                    setQuizStarted(true);
                  }}
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow-md"
                >
                  Retake Quiz
                </button>
              )}

              <button
                onClick={() => navigate(-1)}
                className="flex-1 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold shadow-md"
              >
                Back to Module
              </button>
            </div>
          </div>
        )}

        {/* Previous Attempts */}
        {attempts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">
              Previous Attempts
            </h2>
            <div className="space-y-3">
              {attempts.map((a) => (
                <div
                  key={a.id}
                  className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition"
                >
                  <p className="text-gray-700 font-medium">
                    Attempt #{a.id} — Score: {a.score}% —{" "}
                    {a.passed ? (
                      <span className="text-green-600 font-semibold">Passed ✅</span>
                    ) : (
                      <span className="text-red-600 font-semibold">Failed ❌</span>
                    )}
                  </p>
                  <button
                    onClick={() => {
                      setCurrentAttempt(a);
                      setShowResult(true);
                    }}
                    className="py-2 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium shadow-sm transition"
                  >
                    View Feedback
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default beforeAuthLayout(QuizPage);
