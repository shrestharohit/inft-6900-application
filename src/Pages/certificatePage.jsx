// // src/Pages/CertificatePage.jsx
// import React, { useRef, useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import beforeAuthLayout from "../components/BeforeAuth";

// function CertificatePage() {
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const certRef = useRef();
//   const [certData, setCertData] = useState(null);

//   useEffect(() => {
//     if (state) {
//       setCertData(state);
//       localStorage.setItem("latestCertificate", JSON.stringify(state));
//     } else {
//       const saved = localStorage.getItem("latestCertificate");
//       if (saved) {
//         setCertData(JSON.parse(saved));
//       } else {
//         navigate("/dashboard");
//       }
//     }
//   }, [state, navigate]);

//   const downloadPDF = () => {
//     if (!certRef.current) return;
//     html2canvas(certRef.current, { scale: 2 }).then((canvas) => {
//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("landscape", "pt", "a4");
//       pdf.addImage(imgData, "PNG", 20, 20, 800, 550);
//       pdf.save("certificate.pdf");
//     });
//   };

//   if (!certData) return null;

//   const { name, course, score, date } = certData;

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       {/* Certificate */}
//       <main className="flex-1 flex justify-center items-center p-6">
//         <div
//           ref={certRef}
//           className="w-full max-w-4xl bg-white border-8 border-yellow-500 p-12 rounded-xl shadow-lg text-center"
//         >
//           <h1 className="text-4xl font-bold text-gray-800 mb-6">
//             Certificate of Achievement
//           </h1>
//           <p className="text-lg text-gray-600 mb-4">This is proudly presented to</p>
//           <h2 className="text-3xl font-semibold text-blue-700 mb-6">{name}</h2>
//           <p className="text-lg text-gray-700 mb-6">
//             For successfully completing the course <br />
//             <span className="font-semibold">{course}</span> with a score of{" "}
//             <span className="font-bold text-green-600">{score}%</span>.
//           </p>
//           <p className="mt-8 text-gray-500">
//             Date: {date ? new Date(date).toLocaleDateString() : new Date().toLocaleDateString()}
//           </p>
//         </div>
//       </main>

//       {/* Download Button */}
//       <div className="flex justify-center my-6">
//         <button
//           onClick={downloadPDF}
//           className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
//         >
//           📥 Download as PDF
//         </button>
//       </div>
//     </div>
//   );
// }

// export default CertificatePage;


import React, { useRef, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import beforeAuthLayout from "../components/BeforeAuth";
import useQuizApi from "../hooks/useQuizApi";
import { useAuth } from "../contexts/AuthContext";

function CertificatePage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const certRef = useRef();

  const { fetchQuizForCourse, getQuizResultForUser } = useQuizApi();
  const { loggedInUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [eligible, setEligible] = useState(false);
  const [quizResults, setQuizResults] = useState([]);
  const [courseTitle, setCourseTitle] = useState("");
  const [avgScore, setAvgScore] = useState(0);

  useEffect(() => {
    const loadCertificateStatus = async () => {
      try {
        if (!loggedInUser?.id) return;

        const quizzes = await fetchQuizForCourse(courseId);
        if (!quizzes?.length) {
          setLoading(false);
          return;
        }

        setCourseTitle(quizzes[0]?.courseTitle || "Your Course");

        const allResults = await Promise.all(
          quizzes.map(async (quiz) => {
            const res = await getQuizResultForUser(quiz.quizID, loggedInUser.id);
            const latest = res?.[0]; // assume first or latest attempt
            return latest ? { quizID: quiz.quizID, ...latest } : null;
          })
        );

        const validResults = allResults.filter(Boolean);
        setQuizResults(validResults);

        const allPassed = validResults.length === quizzes.length &&
          validResults.every((r) => r.passed === true);

        setEligible(allPassed);

        const avg =
          validResults.reduce((sum, r) => sum + (r.score || 0), 0) /
          (validResults.length || 1);
        setAvgScore(Math.round(avg * 100) / 100);
      } catch (err) {
        console.error("❌ Failed to load certificate eligibility:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCertificateStatus();
  }, [courseId, loggedInUser, fetchQuizForCourse, getQuizResultForUser]);

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

  // --- 🏆 Eligible for Certificate ---
  if (eligible) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
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
              <span className="font-semibold">{courseTitle}</span> with an
              average score of{" "}
              <span className="font-bold text-green-600">
                {Math.round(avgScore * 100)}%
              </span>.
            </p>
            <p className="mt-8 text-gray-500">
              Date: {new Date().toLocaleDateString()}
            </p>
          </div>
        </main>

        <div className="flex justify-center my-6">
          <button
            onClick={downloadPDF}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
          >
            📥 Download as PDF
          </button>
        </div>
      </div>
    );
  }

  // --- 🚧 Not Yet Eligible ---
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-8 text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Complete Your Course
      </h1>
      <p className="text-gray-600 max-w-lg mb-6">
        To earn your certificate, you need to score <strong>80% or higher</strong> in
        <em> every quiz</em> of this course. Check your progress below:
      </p>

      <div className="w-full max-w-3xl bg-white rounded-xl shadow border border-gray-200 p-6 mb-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border">Quiz ID</th>
              <th className="p-3 border">Score (%)</th>
              <th className="p-3 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {quizResults.map((r) => (
              <tr key={r.quizID} className="border-t hover:bg-gray-50">
                <td className="p-3 border">{r.quizID}</td>
                <td className="p-3 border">
                  {Math.round((r.score || 0) * 100)}%
                </td>
                <td className="p-3 border">
                  {r.passed ? (
                    <span className="text-green-600 font-semibold">Passed ✅</span>
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
