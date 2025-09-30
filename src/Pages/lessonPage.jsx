import React, { useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import beforeAuthLayout from "../components/BeforeAuth";
import { dummyCourses } from "../Pages/dummyData";
import { dummyModules } from "../Pages/dummyModule";
import { dummyLessonContent } from "../Pages/dummyLessonContent";

const LessonPage = () => {
  const { courseId, moduleId, lessonId } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef(null);

  const course = dummyCourses.find((c) => c.id === courseId);
  if (!course) return <div className="p-6 text-red-500 text-center font-semibold text-lg">Course not found!</div>;

  const modules = dummyModules[courseId] || [];
  const module = modules.find((m) => m.id.toString() === moduleId);
  if (!module) return <div className="p-6 text-red-500 text-center font-semibold text-lg">Module not found!</div>;

  const lessonContent = dummyLessonContent[courseId]?.[lessonId];
  if (!lessonContent) return <div className="p-6 text-red-500 text-center font-semibold text-lg">Lesson content not found!</div>;

  // --- TTS Handlers ---
  const handleStartPause = () => {
    if (!window.speechSynthesis) {
      alert("Text-to-Speech is not supported in this browser.");
      return;
    }

    if (!isPlaying) {
      const utter = new SpeechSynthesisUtterance(lessonContent.content);
      utter.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };
      utter.onerror = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };
      utter.lang = "en-US";
      utter.rate = 1;
      utter.pitch = 1;

      utteranceRef.current = utter;
      window.speechSynthesis.speak(utter);
      setIsPlaying(true);
      setIsPaused(false);
    } else if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">


      {/* Heading + TTS controls aligned */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-extrabold text-gray-800">
          {lessonContent.title}
        </h1>

        <div className="flex gap-2">
          <button
            onClick={handleStartPause}
            className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-md transition"
          >
            {!isPlaying ? "🔊 Start" : isPaused ? "▶️ Resume" : "⏸ Pause"}
          </button>
          <button
            onClick={handleStop}
            disabled={!isPlaying}
            className={`px-4 py-2 rounded-full text-white shadow-md transition ${isPlaying
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gray-400 cursor-not-allowed"
              }`}
          >
            ⏹ Stop
          </button>
        </div>
      </div>

      {/* Lesson Content */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <p className="text-gray-700 text-lg leading-relaxed">
          {lessonContent.content}
        </p>
      </div>
    </div>
  );
};

export default beforeAuthLayout(LessonPage);
