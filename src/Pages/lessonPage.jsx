import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import beforeAuthLayout from "../components/BeforeAuth";
import useContent from "../hooks/useContent";
import { toast, Toaster } from "react-hot-toast";
import useRoleAccess from "../hooks/useRoleAccess"; // ✅ added

const LessonPage = () => {
  const { lessonId } = useParams();
  const [lessonContent, setLessonContent] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef(null);
  const timerRef = useRef(null);
  const [focusEnded, setFocusEnded] = useState(false);
  const { getContentDetails } = useContent();
  const { canPomodoro, isAdmin, isCourseOwner } = useRoleAccess(); // ✅ added

  // 🧠 Load user's Pomodoro settings
  const [pomodoroSettings] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("pomodoroSettings"));
    console.log("🕒 [Pomodoro] Loaded settings from localStorage:", saved);
    return (
      saved || {
        enabled: false,
        focusMinutes: 25,
        shortBreakMinutes: 5,
      }
    );
  });

  // 🔹 Fetch lesson content
  useEffect(() => {
    let mounted = true;
    console.log("🕒 [Pomodoro] Fetching lesson content for ID:", lessonId);
    getContentDetails(lessonId)
      .then((res) => {
        if (mounted) {
          setLessonContent(res.content);
          console.log("🕒 [Pomodoro] Lesson content loaded successfully.");
        }
      })
      .catch((err) => {
        console.error("🕒 [Pomodoro] Failed to fetch lesson content:", err);
      });
    return () => (mounted = false);
  }, [getContentDetails, lessonId]);

  // 🕒 Start break timer after pressing "Okay"
  const startBreakTimer = () => {
    if (!canPomodoro) return; // ✅ restrict break timers to students
    const breakDuration = pomodoroSettings.shortBreakMinutes * 60 * 1000;
    const breakEndTime = Date.now() + breakDuration;

    localStorage.setItem("pomodoroOnBreak", "true");
    localStorage.setItem("pomodoroBreakEnd", breakEndTime.toString());
    console.log(
      `☕ [Pomodoro] Break started for ${pomodoroSettings.shortBreakMinutes} minutes.`
    );

    setTimeout(() => {
      localStorage.removeItem("pomodoroOnBreak");
      localStorage.removeItem("pomodoroBreakEnd");
      toast("✅ Break finished! Ready for your next focus session?", {
        icon: "🎯",
        style: {
          background: "#f9fafb",
          color: "#111827",
          border: "1px solid #d1d5db",
        },
      });
    }, breakDuration);
  };

  // 🕒 Helper: start new focus session manually
  const startNewSession = () => {
    if (!pomodoroSettings.enabled || !canPomodoro) return; // ✅ restrict to students only
    if (timerRef.current) clearTimeout(timerRef.current);

    setFocusEnded(false);
    console.log("🕒 [Pomodoro] Starting a new focus session manually...");

    const focusTime = pomodoroSettings.focusMinutes * 60 * 1000;
    timerRef.current = setTimeout(() => {
      console.log("🕒 [Pomodoro] Focus time completed (manual restart).");
      setFocusEnded(true);
      localStorage.setItem("pomodoroFocusEnded", "true");
      showPomodoroToast();
    }, focusTime);
  };

  // ☕ Custom toast message with buttons
  const showPomodoroToast = () => {
    if (!canPomodoro) return; // ✅ only students see this toast
    toast.custom((t) => (
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-md w-[320px]">
        <p className="text-gray-800 font-medium mb-3">
          ☕ Focus session complete! Take a short break.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              startBreakTimer();
            }}
            className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-md text-sm"
          >
            Okay
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              startNewSession();
            }}
            className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm"
          >
            Start New Session
          </button>
        </div>
      </div>
    ));
  };

  // 🔹 Start focus timer silently
  useEffect(() => {
    if (!canPomodoro) {
      console.log("🕒 [Pomodoro] Access denied — not a student. Timer not started.");
      return;
    }

    if (!pomodoroSettings.enabled) {
      console.log("🕒 [Pomodoro] Pomodoro disabled — timer not started.");
      return;
    }

    const focusTime = pomodoroSettings.focusMinutes * 60 * 1000;
    console.log(
      `🕒 [Pomodoro] Focus timer started for ${pomodoroSettings.focusMinutes} minutes (${focusTime / 1000}s)`
    );

    timerRef.current = setTimeout(() => {
      console.log("🕒 [Pomodoro] Focus time completed — showing toast.");
      setFocusEnded(true);
      localStorage.setItem("pomodoroFocusEnded", "true");
      showPomodoroToast();
    }, focusTime);

    return () => {
      clearTimeout(timerRef.current);
      console.log("🕒 [Pomodoro] Focus timer cleared on unmount.");
    };
  }, [pomodoroSettings, canPomodoro]);

  // --- Text-to-Speech Handlers ---
  const handleStartPause = () => {
    if (!window.speechSynthesis) {
      toast.error("Text-to-Speech is not supported in this browser.");
      return;
    }

    if (!isPlaying) {
      console.log("🕒 [TTS] Starting Text-to-Speech...");
      const utter = new SpeechSynthesisUtterance(lessonContent.description);
      utter.onend = () => {
        console.log("🕒 [TTS] Playback finished.");
        setIsPlaying(false);
        setIsPaused(false);
      };
      utter.onerror = () => {
        console.log("🕒 [TTS] Error during playback.");
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
      console.log("🕒 [TTS] Resuming playback...");
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      console.log("🕒 [TTS] Pausing playback...");
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    if (window.speechSynthesis.speaking) {
      console.log("🕒 [TTS] Stopping playback.");
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  if (!lessonContent)
    return (
      <div className="p-6 text-red-500 text-center font-semibold text-lg">
        Lesson content not found!
      </div>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Optional notice for Admin/Course Owner */}
      {(isAdmin || isCourseOwner) && (
        <div className="mb-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-3 rounded">
          {isAdmin ? "Admin" : "Course Owner"} Mode — Pomodoro is disabled.
        </div>
      )}

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
          {lessonContent.description}
        </p>
      </div>
    </div>
  );
};

export default LessonPage;
