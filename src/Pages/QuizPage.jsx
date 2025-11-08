import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useQuizApi from "../hooks/useQuizApi";
import { useAuth } from "../contexts/AuthContext";
import useEnrollment from "../hooks/useEnrollment";
import useRoleAccess from "../hooks/useRoleAccess";

const QuizPage = () => {
  const navigate = useNavigate();
  const { courseId, moduleId } = useParams();
  const [answers, setAnswers] = useState({});
  const [attempts, setAttempts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [currentAttempt, setCurrentAttempt] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [enrolmentID, setEnrolmentID] = useState(null);
  const [attemptID, setAttemptID] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [triggerKey, setTriggerKey] = useState(0);

  const {
    startQuiz,
    submitQuiz,
    fetchQuizForCourse,
    getQuizResultForUser,
    getQuizFeedbackForUser,
  } = useQuizApi();
  const { getEnrolledCoursesById } = useEnrollment();
  const { loggedInUser } = useAuth();
  const { isAdmin, isCourseOwner, canAttemptQuiz, canViewCourses } =
    useRoleAccess();

  if (!canViewCourses) {
    return (
      <div className="p-6 text-center text-red-500 font-semibold">
        You do not have permission to view this page.
      </div>
    );
  }

  const normalizeScore = (score) => (score <= 1 ? score * 100 : score);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    fetchQuizForCourse(courseId)
      .then(async (res) => {
        const activeQuiz = res?.find((x) => x.moduleID == moduleId);
        if (mounted) setQuiz(activeQuiz);

        const resp = await getQuizResultForUser(
          activeQuiz?.quizID,
          loggedInUser?.id
        );

        getFeedbackForAttempt(resp[0]?.attemptID, activeQuiz?.quizID);

        const normalized = resp.map((a) => ({
          ...a,
          score: normalizeScore(a.score),
        }));
        setAttempts(normalized);

        if (normalized.length > 0) {
          setShowResult(true);
          setCurrentAttempt(normalized[0]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch quiz", err);
        if (mounted) setQuiz([]);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => (mounted = false);
  }, [
    fetchQuizForCourse,
    courseId,
    moduleId,
    getQuizResultForUser,
    loggedInUser,
    triggerKey,
  ]);

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
        console.error("Failed to fetch enrollment", err);
        if (mounted) setEnrolmentID(null);
      });
    return () => (mounted = false);
  }, [getEnrolledCoursesById, loggedInUser, courseId]);

  const mapAnswers = () => ({
    enrolmentID,
    attemptID,
    answers: Object.entries(answers)?.map(([questionID, optionID]) => ({
      questionID: Number(questionID),
      optionID: Number(optionID),
    })),
  });

  const calculateResult = async () => {
    const payload = mapAnswers();
    await submitQuiz(quiz.quizID, payload);
    setQuiz(null);
    setAnswers({});
    setQuizStarted(false);
    setTriggerKey((prev) => prev + 1);
  };

  const handleOptionChange = (questionId, optionId) =>
    setAnswers({ ...answers, [questionId]: optionId });

  const handleStartQuiz = async () => {
    if (!canAttemptQuiz)
      return alert("You do not have permission to attempt this quiz.");
    setShowResult(false);
    setQuizStarted(true);
    const res = await startQuiz(quiz.quizID, { enrolmentID });
    setAttemptID(res.attempt.attemptID);
  };

  const getFeedbackForAttempt = async (attemptID, quizID) => {
    if (!attemptID) return;
    const res = await getQuizFeedbackForUser(quizID || quiz.quizID, attemptID);
    setFeedback(res);
  };

  if (isLoading)
    return (
      <div div className="h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto">
        {/* 🔹 Banner for admin/owner */}
        {(isAdmin || isCourseOwner) && (
          <div className="mb-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-3 rounded">
            {isAdmin ? "Admin" : "Course Owner"} Preview Mode — quizzes are
            view-only.
          </div>
        )}

        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
          Module Quiz
        </h1>

        {/* Info before quiz */}
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
            {canAttemptQuiz ? (
              <button
                onClick={handleStartQuiz}
                className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg shadow-lg transition"
              >
                Start Quiz
              </button>
            ) : (
              <p className="text-gray-500 italic">
                You can view this quiz but cannot attempt it.
              </p>
            )}
          </div>
        )}

        {/* Quiz in progress */}
        {quizStarted && canAttemptQuiz && !showResult && (
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

        {/* Results */}
        {showResult && attempts && (
          <div className="mt-8">
            <div
              className={`p-10 rounded-2xl shadow-lg border text-center ${
                attempts?.some((x) => !!x.passed)
                  ? "border-green-500 bg-green-50"
                  : "border-red-500 bg-red-50"
              }`}
            >
              <h2
                className={`text-3xl font-bold mb-4 ${
                  attempts?.some((x) => !!x.passed)
                    ? "text-green-700"
                    : "text-red-700"
                }`}
              >
                {attempts?.some((x) => !!x.passed)
                  ? "✅ Congratulations!"
                  : "❌ Try Again"}
              </h2>

              <p className="text-gray-700 text-lg mb-2">
                You scored{" "}
                <strong>
                  {Math.round(attempts?.find((x) => x.passed == true)?.score)}%
                </strong>
              </p>
              <p className="text-gray-500 mb-6">
                No of attempts: {attempts?.length || 0}
              </p>

              {canAttemptQuiz && !attempts?.some((x) => !!x.passed) && (
                <button
                  onClick={handleStartQuiz}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md"
                >
                  Retake Quiz
                </button>
              )}

              {attempts?.some((x) => !!x.passed) ? (
                <p className="text-green-700 font-medium mt-4">
                  Great job! Your certificate will appear in your profile soon.
                </p>
              ) : (
                <p className="text-gray-600 font-medium mt-4">
                  Review your feedback and try again when ready.
                </p>
              )}
            </div>

            {/* Feedback section */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Feedback
              </h3>
              {feedback?.answers?.length ? (
                feedback?.answers?.map((f, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-white rounded-lg border-l-4 shadow-sm mb-3 border-l-gray-300 hover:shadow-md transition"
                  >
                    <p className="font-medium text-gray-800">
                      <strong>Q:</strong> {f.questionText}
                    </p>
                    <p className="text-gray-600">
                      <strong>Your answer:</strong>{" "}
                      {f.selectedText || "No answer"}
                    </p>
                    <p className="italic text-gray-700">{f.feedbackText}</p>
                  </div>
                ))
              ) : (
                <>
                  <p className="text-gray-600">No feedback available.</p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Previous Attempts */}
        {attempts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">
              Previous Attempts
            </h2>
            <div className="space-y-3">
              {attempts?.map((a, index) => (
                <div
                  key={a.attemptID}
                  className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition"
                >
                  <p className="text-gray-700 font-medium">
                    Attempt #{index + 1} — Score: {Math.round(a.score || 0)}%
                    —{" "}
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
                      getFeedbackForAttempt(a.attemptID);
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
