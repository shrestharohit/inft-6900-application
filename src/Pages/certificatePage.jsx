import React, { useRef, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import useQuizApi from "../hooks/useQuizApi";
import useModuleApi from "../hooks/useModuleApi";
import { useAuth } from "../contexts/AuthContext";
import useCourseApi from "../hooks/useCourseApi";
import useRoleAccess from "../hooks/useRoleAccess";

function CertificatePage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const certRef = useRef();
  const { isAdmin, isCourseOwner}= useRoleAccess();
  const previewMode = isAdmin || isCourseOwner;

  const { fetchQuizForCourse, getQuizResultForUser } = useQuizApi();
  const { fetchAllModulesInACourse } = useModuleApi();
  const { loggedInUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [eligible, setEligible] = useState(false);
  const [quizResults, setQuizResults] = useState([]);
  const [courseTitle, setCourseTitle] = useState("");
  const [avgScore, setAvgScore] = useState(0);

  const { fetchCourse } = useCourseApi();

  useEffect(() => {
    const loadCertificateStatus = async () => {
      try {
        if (!loggedInUser?.id) return;

        const [modulesRes, quizzes, courseData] = await Promise.all([
          fetchAllModulesInACourse(courseId),
          fetchQuizForCourse(courseId),
          fetchCourse(courseId)
        ]);

        const modules = Array.isArray(modulesRes)
          ? modulesRes
          : modulesRes?.modules || [];

        if (!quizzes?.length) {
          setLoading(false);
          return;
        }
        setCourseTitle(courseData?.title || "");

        // Map modules for lookup
        const moduleMap = {};
        modules.forEach((m) => {
          moduleMap[m.moduleID] = m.title || m.moduleTitle || "Module";
        });

        // Fetch ALL quiz results and pick the best attempt (max score)
        const allResults = await Promise.all(
          quizzes.map(async (quiz) => {
            const attempts = await getQuizResultForUser(
              quiz.quizID,
              loggedInUser.id
            );

            if (!attempts?.length) {
              return {
                quizID: quiz.quizID,
                moduleName: moduleMap[quiz.moduleID] || "Module",
                maxScore: 0,
                passed: false,
                noAttempt: true,
              };
            }

            // Find max score from all attempts
            const maxAttempt = attempts.reduce((max, curr) =>
              (curr.score || 0) > (max.score || 0) ? curr : max
            );

            const maxScore = maxAttempt.score || 0;
            const passed = attempts.some((a) => a.passed === true);

            return {
              quizID: quiz.quizID,
              moduleName: moduleMap[quiz.moduleID] || "Module",
              maxScore,
              passed,
              noAttempt: false,
            };
          })
        );

        // Sort by module order
        const orderedResults = modules
          .map((mod) =>
            allResults.find((r) =>
              quizzes.some(
                (q) => q.quizID === r.quizID && q.moduleID === mod.moduleID
              )
            )
          )
          .filter(Boolean);

        setQuizResults(orderedResults);

        // Eligibility: all quizzes passed in at least one attempt
        const allPassed =
          orderedResults.length === quizzes.length &&
          orderedResults.every((r) => r.passed);

        setEligible(allPassed);

        // Average of max scores
        const avg =
          orderedResults.reduce((sum, r) => sum + (r.maxScore || 0), 0) /
          (orderedResults.length || 1);
        setAvgScore(Math.round(avg * 100) / 100);
      } catch (err) {
        console.error("❌ Failed to load certificate eligibility:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCertificateStatus();
  }, [
    courseId,
    loggedInUser,
    fetchCourse,
    fetchQuizForCourse,
    getQuizResultForUser,
    fetchAllModulesInACourse,
  ]);

  const downloadPDF = () => {
    if (!certRef.current) return;
    html2canvas(certRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "pt", "a4");
      pdf.addImage(imgData, "PNG", 20, 20, 800, 550);
      pdf.save("certificate.pdf");
    });
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Loading your progress...
      </div>
    );

  // Eligible for Certificate
  if (eligible || previewMode) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {previewMode && !eligible && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 text-center">
            <strong>Preview Mode:</strong> You are viewing this certificate as an admin
          </div>
        )}
        <main className="flex-1 flex justify-center items-center p-6">
          <div
            ref={certRef}
            className="w-full max-w-4xl bg-white border-8 border-yellow-500 p-12 rounded-xl shadow-lg text-center"
          >
            <h1 className="text-4xl font-bold text-gray-800 mb-6">
              Certificate of Achievement
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              This is proudly presented to
            </p>
            <h2 className="text-3xl font-semibold text-blue-700 mb-6">
              {loggedInUser?.firstName} {loggedInUser?.lastName}
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              For successfully completing the course <br />
              <span className="font-semibold">{courseTitle}</span> with a
             score of{" "}
              <span className="font-bold text-green-600">
                {Math.round(avgScore * 100)}%
              </span>
              .
            </p>
            <p className="mt-8 text-gray-500">
              Generated Date: {new Date().toLocaleDateString("en-AU")}
            </p>
          </div>
        </main>

        {!previewMode && (

        <div className="flex justify-center my-6">
          <button
            onClick={downloadPDF}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
          >
            📥 Download as PDF
          </button>
        </div>
        )}
      </div>
    );
  }

  // Not Yet Eligible
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8 text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Complete Your Course
      </h1>
      <p className="text-gray-600 max-w-lg mb-6">
        To earn your certificate, you need to score{" "}
        <strong>80% or higher</strong> in every quiz. Below are your{" "}
        <strong>best scores</strong> so far:
      </p>

      <div className="w-full max-w-3xl bg-white rounded-xl shadow border border-gray-200 p-6 mb-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border">Module</th>
              <th className="p-3 border">Best Score (%)</th>
              <th className="p-3 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {quizResults.map((r) => (
              <tr key={r.quizID} className="border-t hover:bg-gray-50">
                <td className="p-3 border">{r.moduleName}</td>
                <td className="p-3 border">
                  {r.noAttempt ? (
                    <span className="text-gray-500 italic">No attempt yet</span>
                  ) : (
                    `${Math.round((r.maxScore || 0) * 100)}%`
                  )}
                </td>
                <td className="p-3 border">
                  {r.noAttempt ? (
                    <span className="text-gray-400">—</span>
                  ) : r.passed ? (
                    <span className="text-green-600 font-semibold">
                      Passed ✅
                    </span>
                  ) : (
                    <span className="text-red-600 font-semibold">
                      Not Passed ❌
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={() => navigate(`/courses/${courseId}/content`)}
        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md"
      >
        Go to Course Content
      </button>
    </div>
  );
}

export default CertificatePage;
