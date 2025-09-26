// src/Pages/CertificatePage.jsx
import React, { useRef } from "react";
import { useLocation } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import beforeAuthLayout from "../components/BeforeAuth";

function CertificatePage() {
  const { state } = useLocation();
  const { name, course, score } = state || {};
  const certRef = useRef();

  const downloadPDF = () => {
    const input = certRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "pt", "a4");
      pdf.addImage(imgData, "PNG", 20, 20, 800, 550);
      pdf.save("certificate.pdf");
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div
        ref={certRef}
        className="w-full max-w-4xl bg-white border-8 border-yellow-500 p-12 rounded-xl text-center shadow-lg"
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
          Date: {new Date().toLocaleDateString()}
        </p>
      </div>

      <button
        onClick={downloadPDF}
        className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
      >
        📥 Download as PDF
      </button>
    </div>
  );
}

export default beforeAuthLayout(CertificatePage);