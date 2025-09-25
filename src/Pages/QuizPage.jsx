// src/Pages/QuizPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import beforeAuthLayout from "../components/BeforeAuth";

// Dummy quiz data
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
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
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
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">Module Quiz</h1>

      {/* Quiz Content */}
      {!showResult && (
        <div className="space-y-6">
          {dummyQuiz.map((q) => (
            <div key={q.id} className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
              <p className="text-lg font-semibold mb-4">{q.question}</p>
              <div className="space-y-2">
                {q.options.map((o) => (
                  <label
                    key={o.id}
                    className={`block cursor-pointer p-3 rounded-md border ${
                      answers[q.id] === o.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      value={o.id}
                      checked={answers[q.id] === o.id}
                      onChange={() => handleOptionChange(q.id, o.id)}
                      className="mr-2"
                    />
                    {o.text}
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={calculateResult}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
          >
            Submit Quiz
          </button>
        </div>
      )}

      {/* Quiz Result */}
      {showResult && currentAttempt && (
        <div className="space-y-6">
          <div
            className={`p-6 rounded-lg border ${
              currentAttempt.passed ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"
            }`}
          >
            <h2 className={`text-xl font-semibold mb-2 ${currentAttempt.passed ? "text-green-600" : "text-red-600"}`}>
              Attempt #{currentAttempt.id} - {currentAttempt.passed ? "Passed ✅" : "Failed ❌"}
            </h2>
            <p className="text-gray-700">Score: {currentAttempt.score}%</p>
          </div>

          <h3 className="text-lg font-semibold">Feedback</h3>
          {currentAttempt.feedback.map((f, idx) => (
            <div key={idx} className="p-4 bg-gray-50 rounded-md border-l-4 border-l-gray-300">
              <p>
                <strong>Q:</strong> {f.question}
              </p>
              <p>
                <strong>Your answer:</strong> {f.selectedOption || "No answer selected"}
              </p>
              <p>{f.feedback}</p>
            </div>
          ))}

          <div className="flex gap-4 mt-4">
            <button
              onClick={() => setShowResult(false)}
              className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
            >
              Retake Quiz
            </button>
            <button
              onClick={() => navigate(-1)}
              className="flex-1 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold"
            >
              Back to Module
            </button>
          </div>
        </div>
      )}

      {/* Previous Attempts */}
      {attempts.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Previous Attempts</h2>
          <div className="space-y-3">
            {attempts.map((a) => (
              <div
                key={a.id}
                className="flex justify-between items-center p-4 bg-gray-50 border border-gray-200 rounded-md"
              >
                <p>
                  Attempt #{a.id} - Score: {a.score}% - {a.passed ? "Passed ✅" : "Failed ❌"}
                </p>
                <button
                  onClick={() => {
                    setCurrentAttempt(a);
                    setShowResult(true);
                  }}
                  className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium"
                >
                  View Feedback
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default beforeAuthLayout(QuizPage);
