// src/Pages/CertificatePage.jsx
import React, { useRef, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import beforeAuthLayout from "../components/BeforeAuth";

function CertificatePage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const certRef = useRef();
  const [certData, setCertData] = useState(null);

  useEffect(() => {
    if (state) {
      setCertData(state);
      localStorage.setItem("latestCertificate", JSON.stringify(state));
    } else {
      const saved = localStorage.getItem("latestCertificate");
      if (saved) {
        setCertData(JSON.parse(saved));
      } else {
        navigate("/dashboard");
      }
    }
  }, [state, navigate]);

  const downloadPDF = () => {
    if (!certRef.current) return;
    html2canvas(certRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "pt", "a4");
      pdf.addImage(imgData, "PNG", 20, 20, 800, 550);
      pdf.save("certificate.pdf");
    });
  };

  if (!certData) return null;

  const { name, course, score, date } = certData;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Certificate */}
      <main className="flex-1 flex justify-center items-center p-6">
        <div
          ref={certRef}
          className="w-full max-w-4xl bg-white border-8 border-yellow-500 p-12 rounded-xl shadow-lg text-center"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            Certificate of Achievement
          </h1>
          <p className="text-lg text-gray-600 mb-4">This is proudly presented to</p>
          <h2 className="text-3xl font-semibold text-blue-700 mb-6">{name}</h2>
          <p className="text-lg text-gray-700 mb-6">
            For successfully completing the course <br />
            <span className="font-semibold">{course}</span> with a score of{" "}
            <span className="font-bold text-green-600">{score}%</span>.
          </p>
          <p className="mt-8 text-gray-500">
            Date: {date ? new Date(date).toLocaleDateString() : new Date().toLocaleDateString()}
          </p>
        </div>
      </main>

      {/* Download Button */}
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

export default beforeAuthLayout(CertificatePage);
