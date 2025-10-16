// src/Pages/QuizPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import beforeAuthLayout from "../components/BeforeAuth";
import useQuizApi from "../hooks/useQuizApi";
import { useAuth } from "../contexts/AuthContext";
import useEnrollment from "../hooks/useEnrollment";

const QuizPage = () => {
  const navigate = useNavigate();
  const { courseId, moduleId } = useParams(); // ✅ get the courseId from URL
  const [answers, setAnswers] = useState({});
  const [attempts, setAttempts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [currentAttempt, setCurrentAttempt] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quiz, setQuiz] = useState(null); // Placeholder for fetched quiz
  const [enrolmentID, setEnrolmentID] = useState(null);
  const [attemptID, setAttemptID] = useState(null);

  const { startQuiz, submitQuiz } = useQuizApi();
  const { fetchQuizForCourse, getQuizResultForUser } = useQuizApi();
  const { getEnrolledCoursesById } = useEnrollment();
  const { loggedInUser } = useAuth();

  useEffect(() => {
    let mounted = true;
    fetchQuizForCourse(courseId)
      .then(async (res) => {
        const activeQuiz = res?.find((x) => x.moduleID == moduleId);
        if (mounted) setQuiz(activeQuiz);
        const resp = await getQuizResultForUser(
          activeQuiz?.quizID,
          loggedInUser?.id
        );
        setAttempts(resp);
        if (resp.length > 0) {
          setShowResult(true);
          setCurrentAttempt(resp?.[0]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch quiz", err);
        if (mounted) setQuiz([]);
      });

    return () => (mounted = false);
  }, [fetchQuizForCourse]);

  console.log({ currentAttempt });
  useEffect(() => {
    let mounted = true;
    getEnrolledCoursesById(loggedInUser?.id)
      .then((resp) => {
        const activeEnrollment = resp?.enrolments?.find(
          (x) => x.courseID == courseId
        );
        if (mounted) setEnrolmentID(activeEnrollment?.enrolmentID);
      })
      .catch((err) => {
        console.error("Failed to fetch quiz", err);
        if (mounted) setEnrolmentID(null);
      });

    return () => (mounted = false);
  }, [getEnrolledCoursesById]);

  function mapAnswers() {
    return {
      enrolmentID: enrolmentID,
      attemptID: attemptID,
      answers: Object.entries(answers)?.map(([questionID, optionID]) => ({
        questionID: Number(questionID),
        optionID: Number(optionID),
      })),
    };
  }

  const calculateResult = async () => {
    const payload = mapAnswers();
    const res = await submitQuiz(quiz.quizID, payload);
    setCurrentAttempt(res.attempt);
    setShowResult(true);
    setQuiz(null);
    setQuizStarted(false);
    setAttemptID(null);
  };

  const handleOptionChange = (questionId, optionId) => {
    setAnswers({ ...answers, [questionId]: optionId });
  };

  const handleStartQuiz = async () => {
    setShowResult(false);
    setQuizStarted(true);
    const res = await startQuiz(quiz.quizID, { enrolmentID });
    setAttemptID(res.attempt.attemptID);
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
          Module Quiz
        </h1>

        {/* Pre-Quiz Info */}
        {!quizStarted && !showResult && !attempts?.length && (
          <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-200 text-center">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">
              Ready to test your knowledge?
            </h2>
            <p className="text-gray-600 mb-3">
              <strong>{quiz?.questions?.length}</strong> questions | Passing
              score: <strong>80%</strong>
            </p>
            <p className="text-gray-600 mb-6">
              Attempts made:{" "}
              <span className="font-semibold text-blue-600">
                {attempts.length}
              </span>
            </p>
            <button
              onClick={handleStartQuiz}
              className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg shadow-lg transition"
            >
              Start Quiz
            </button>
          </div>
        )}

        {/* Quiz Screen */}
        {quizStarted && !showResult && (
          <div className="space-y-6">
            {quiz?.questions?.map((q, idx) => (
              <div
                key={q.questionID}
                className="p-6 bg-white rounded-xl shadow-lg border border-gray-200"
              >
                <p className="text-lg font-semibold mb-4 text-gray-800">
                  Q{idx + 1}. {q.questionText}
                </p>
                <div className="space-y-3">
                  {q.options?.map((o) => (
                    <label
                      key={o.optionID}
                      className={`block cursor-pointer p-4 rounded-lg border transition ${
                        answers[q.questionID] === o.optionID
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${q.questionID}`}
                        value={o.optionID}
                        checked={answers[q.questionID] === o.optionID}
                        onChange={() =>
                          handleOptionChange(q.questionID, o.optionID)
                        }
                        className="mr-3 accent-blue-600"
                      />
                      {o.optionText}
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
                Score:{" "}
                <span className="font-bold">{currentAttempt.score}%</span>
              </p>
            </div>

            <h3 className="text-lg font-semibold text-gray-800">Feedback</h3>
            {currentAttempt?.feedback?.map((f, idx) => (
              <div
                key={idx}
                className="p-5 bg-white rounded-lg border-l-4 shadow-sm mb-3 border-l-gray-300 hover:shadow-md transition"
              >
                <p className="font-medium text-gray-800">
                  <strong>Q:</strong> {f.question}
                </p>
                <p className="text-gray-600">
                  <strong>Your answer:</strong>{" "}
                  {f.selectedOption || "No answer"}
                </p>
                <p className="italic text-gray-700">{f.feedback}</p>
              </div>
            ))}

            <div className="flex gap-4 mt-4">
              {currentAttempt.passed ? (
                <button
                  onClick={() =>
                    navigate(`/courses/${courseId}/certificate`, {
                      state: {
                        name: "John Doe", // replace with logged-in user name
                        course: "Module Quiz",
                        score: currentAttempt.score,
                        date: currentAttempt.date,
                      },
                    })
                  }
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow-md"
                >
                  🎉 Generate Certificate
                </button>
              ) : (
                <button
                  onClick={handleStartQuiz}
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
              {attempts?.map((a) => (
                <div
                  key={a.attemptID}
                  className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition"
                >
                  <p className="text-gray-700 font-medium">
                    Attempt #{a.attemptID} — Score: {a.score || 0}% —{" "}
                    {a.passed ? (
                      <span className="text-green-600 font-semibold">
                        Passed ✅
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">
                        Failed ❌
                      </span>
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

export default QuizPage;
