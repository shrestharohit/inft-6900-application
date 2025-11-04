// import React, { useState, useRef, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import beforeAuthLayout from "../components/BeforeAuth";
// import useContent from "../hooks/useContent";
// import { toast, Toaster } from "react-hot-toast";
// import useRoleAccess from "../hooks/useRoleAccess"; // ✅ added

// const LessonPage = () => {
//   const { lessonId } = useParams();
//   const [lessonContent, setLessonContent] = useState(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isPaused, setIsPaused] = useState(false);
//   const utteranceRef = useRef(null);
//   const timerRef = useRef(null);
//   const [focusEnded, setFocusEnded] = useState(false);
//   const { getContentDetails } = useContent();
//   const { canPomodoro, isAdmin, isCourseOwner } = useRoleAccess(); // ✅ added

//   // 🧠 Load user's Pomodoro settings
//   const [pomodoroSettings] = useState(() => {
//     const saved = JSON.parse(localStorage.getItem("pomodoroSettings"));
//     console.log("🕒 [Pomodoro] Loaded settings from localStorage:", saved);
//     return (
//       saved || {
//         enabled: false,
//         focusMinutes: 25,
//         shortBreakMinutes: 5,
//       }
//     );
//   });

//   // 🔹 Fetch lesson content
//   useEffect(() => {
//     let mounted = true;
//     console.log("🕒 [Pomodoro] Fetching lesson content for ID:", lessonId);
//     getContentDetails(lessonId)
//       .then((res) => {
//         if (mounted) {
//           setLessonContent(res.content);
//           console.log("🕒 [Pomodoro] Lesson content loaded successfully.");
//         }
//       })
//       .catch((err) => {
//         console.error("🕒 [Pomodoro] Failed to fetch lesson content:", err);
//       });
//     return () => (mounted = false);
//   }, [getContentDetails, lessonId]);

//   // 🕒 Start break timer after pressing "Okay"
//   const startBreakTimer = () => {
//     if (!canPomodoro) return; // ✅ restrict break timers to students
//     const breakDuration = pomodoroSettings.shortBreakMinutes * 60 * 1000;
//     const breakEndTime = Date.now() + breakDuration;

//     localStorage.setItem("pomodoroOnBreak", "true");
//     localStorage.setItem("pomodoroBreakEnd", breakEndTime.toString());
//     console.log(
//       `☕ [Pomodoro] Break started for ${pomodoroSettings.shortBreakMinutes} minutes.`
//     );

//     setTimeout(() => {
//       localStorage.removeItem("pomodoroOnBreak");
//       localStorage.removeItem("pomodoroBreakEnd");
//       toast("✅ Break finished! Ready for your next focus session?", {
//         icon: "🎯",
//         style: {
//           background: "#f9fafb",
//           color: "#111827",
//           border: "1px solid #d1d5db",
//         },
//       });
//     }, breakDuration);
//   };

//   // 🕒 Helper: start new focus session manually
//   const startNewSession = () => {
//     if (!pomodoroSettings.enabled || !canPomodoro) return; // ✅ restrict to students only
//     if (timerRef.current) clearTimeout(timerRef.current);

//     setFocusEnded(false);
//     console.log("🕒 [Pomodoro] Starting a new focus session manually...");

//     const focusTime = pomodoroSettings.focusMinutes * 60 * 1000;
//     timerRef.current = setTimeout(() => {
//       console.log("🕒 [Pomodoro] Focus time completed (manual restart).");
//       setFocusEnded(true);
//       localStorage.setItem("pomodoroFocusEnded", "true");
//       showPomodoroToast();
//     }, focusTime);
//   };

//   // ☕ Custom toast message with buttons
//   const showPomodoroToast = () => {
//     if (!canPomodoro) return; // ✅ only students see this toast
//     toast.custom((t) => (
//       <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-md w-[320px]">
//         <p className="text-gray-800 font-medium mb-3">
//           ☕ Focus session complete! Take a short break.
//         </p>
//         <div className="flex justify-end gap-2">
//           <button
//             onClick={() => {
//               toast.dismiss(t.id);
//               startBreakTimer();
//             }}
//             className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-md text-sm"
//           >
//             Okay
//           </button>
//           <button
//             onClick={() => {
//               toast.dismiss(t.id);
//               startNewSession();
//             }}
//             className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm"
//           >
//             Start New Session
//           </button>
//         </div>
//       </div>
//     ));
//   };

//   // 🔹 Start focus timer silently
//   useEffect(() => {
//     if (!canPomodoro) {
//       console.log("🕒 [Pomodoro] Access denied — not a student. Timer not started.");
//       return;
//     }

//     if (!pomodoroSettings.enabled) {
//       console.log("🕒 [Pomodoro] Pomodoro disabled — timer not started.");
//       return;
//     }

//     const focusTime = pomodoroSettings.focusMinutes * 60 * 1000;
//     console.log(
//       `🕒 [Pomodoro] Focus timer started for ${pomodoroSettings.focusMinutes} minutes (${focusTime / 1000}s)`
//     );

//     timerRef.current = setTimeout(() => {
//       console.log("🕒 [Pomodoro] Focus time completed — showing toast.");
//       setFocusEnded(true);
//       localStorage.setItem("pomodoroFocusEnded", "true");
//       showPomodoroToast();
//     }, focusTime);

//     return () => {
//       clearTimeout(timerRef.current);
//       console.log("🕒 [Pomodoro] Focus timer cleared on unmount.");
//     };
//   }, [pomodoroSettings, canPomodoro]);

//   // --- Text-to-Speech Handlers ---
//   const handleStartPause = () => {
//     if (!window.speechSynthesis) {
//       toast.error("Text-to-Speech is not supported in this browser.");
//       return;
//     }

//     if (!isPlaying) {
//       console.log("🕒 [TTS] Starting Text-to-Speech...");
//       const utter = new SpeechSynthesisUtterance(lessonContent.description);
//       utter.onend = () => {
//         console.log("🕒 [TTS] Playback finished.");
//         setIsPlaying(false);
//         setIsPaused(false);
//       };
//       utter.onerror = () => {
//         console.log("🕒 [TTS] Error during playback.");
//         setIsPlaying(false);
//         setIsPaused(false);
//       };
//       utter.lang = "en-US";
//       utter.rate = 1;
//       utter.pitch = 1;

//       utteranceRef.current = utter;
//       window.speechSynthesis.speak(utter);
//       setIsPlaying(true);
//       setIsPaused(false);
//     } else if (isPaused) {
//       console.log("🕒 [TTS] Resuming playback...");
//       window.speechSynthesis.resume();
//       setIsPaused(false);
//     } else {
//       console.log("🕒 [TTS] Pausing playback...");
//       window.speechSynthesis.pause();
//       setIsPaused(true);
//     }
//   };

//   const handleStop = () => {
//     if (window.speechSynthesis.speaking) {
//       console.log("🕒 [TTS] Stopping playback.");
//       window.speechSynthesis.cancel();
//       setIsPlaying(false);
//       setIsPaused(false);
//     }
//   };

//   if (!lessonContent)
//     return (
//       <div className="p-6 text-red-500 text-center font-semibold text-lg">
//         Lesson content not found!
//       </div>
//     );

//   return (
//     <div className="p-6 max-w-5xl mx-auto">
//       <Toaster position="top-center" reverseOrder={false} />

//       {/* Optional notice for Admin/Course Owner */}
//       {(isAdmin || isCourseOwner) && (
//         <div className="mb-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-3 rounded">
//           {isAdmin ? "Admin" : "Course Owner"} Mode — Pomodoro is disabled.
//         </div>
//       )}

//       {/* Heading + TTS controls aligned */}
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-4xl font-extrabold text-gray-800">
//           {lessonContent.title}
//         </h1>

//         <div className="flex gap-2">
//           <button
//             onClick={handleStartPause}
//             className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-md transition"
//           >
//             {!isPlaying ? "🔊 Start" : isPaused ? "▶️ Resume" : "⏸ Pause"}
//           </button>
//           <button
//             onClick={handleStop}
//             disabled={!isPlaying}
//             className={`px-4 py-2 rounded-full text-white shadow-md transition ${isPlaying
//                 ? "bg-red-600 hover:bg-red-700"
//                 : "bg-gray-400 cursor-not-allowed"
//               }`}
//           >
//             ⏹ Stop
//           </button>
//         </div>
//       </div>

//       {/* Lesson Content */}
//       <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
//         <p className="text-gray-700 text-lg leading-relaxed">
//           {lessonContent.description}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default LessonPage;
import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import beforeAuthLayout from "../components/BeforeAuth";
import useContent from "../hooks/useContent";
import { toast, Toaster } from "react-hot-toast";
import useRoleAccess from "../hooks/useRoleAccess";

const LessonPage = () => {
  const { lessonId } = useParams();
  const [lessonContent, setLessonContent] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef(null);
  const timerRef = useRef(null);
  const { getContentDetails } = useContent();
  const { canPomodoro, isAdmin, isCourseOwner } = useRoleAccess();

  // 🧠 Pomodoro user settings
  const [pomodoroSettings] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("pomodoroSettings"));
    return (
      saved || {
        enabled: false,
        focusMinutes: 25,
        shortBreakMinutes: 5,
      }
    );
  });

  // 🧩 Timer state
  const [showPomodoro, setShowPomodoro] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [onBreak, setOnBreak] = useState(false);

  // 🧩 Fetch lesson content
  useEffect(() => {
    let mounted = true;
    getContentDetails(lessonId)
      .then((res) => {
        if (mounted) setLessonContent(res.content);
      })
      .catch((err) => console.error("Failed to fetch lesson content:", err));
    return () => (mounted = false);
  }, [getContentDetails, lessonId]);

  // 🕒 Start Focus Session
  const startNewSession = () => {
    if (!canPomodoro || !pomodoroSettings.enabled) return;
    if (timerRef.current) clearTimeout(timerRef.current);

    const focusMs = pomodoroSettings.focusMinutes * 60 * 1000;
    const focusEnd = Date.now() + focusMs;
    localStorage.setItem("pomodoroFocusEnd", focusEnd.toString());
    localStorage.removeItem("pomodoroBreakEnd");
    localStorage.removeItem("pomodoroOnBreak");

    setOnBreak(false);
    setTimeLeft(Math.ceil(focusMs / 1000));

    timerRef.current = setTimeout(() => {
      localStorage.setItem("pomodoroFocusEnded", "true");
      showPomodoroToast();
    }, focusMs);
  };

  // ☕ Start Break Timer
  const startBreakTimer = () => {
    if (!canPomodoro) return;
    const breakMs = pomodoroSettings.shortBreakMinutes * 60 * 1000;
    const breakEnd = Date.now() + breakMs;

    localStorage.setItem("pomodoroOnBreak", "true");
    localStorage.setItem("pomodoroBreakEnd", breakEnd.toString());
    localStorage.removeItem("pomodoroFocusEnd");

    setOnBreak(true);
    setTimeLeft(Math.ceil(breakMs / 1000));

    timerRef.current = setTimeout(() => {
      localStorage.removeItem("pomodoroOnBreak");
      localStorage.removeItem("pomodoroBreakEnd");
      toast("✅ Break finished! Ready for your next focus session?", {
        icon: "⌛",
        style: {
          background: "#f9fafb",
          color: "#111827",
          border: "1px solid #d1d5db",
        },
      });
    }, breakMs);
  };

  // 🎯 Toast after focus end
  const showPomodoroToast = () => {
    if (!canPomodoro) return;
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

  // 🔁 Sync Countdown — stays live and persists across reloads
  useEffect(() => {
    if (!canPomodoro || !pomodoroSettings.enabled) return;

    const updateCountdown = () => {
      const isBreak = localStorage.getItem("pomodoroOnBreak") === "true";
      const endKey = isBreak ? "pomodoroBreakEnd" : "pomodoroFocusEnd";
      const endTime = parseInt(localStorage.getItem(endKey), 10);

      if (!endTime || Date.now() >= endTime) {
        setTimeLeft(null);
        setOnBreak(false);
        return;
      }

      setOnBreak(isBreak);
      const diff = Math.max(0, endTime - Date.now());
      setTimeLeft(Math.ceil(diff / 1000));
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [pomodoroSettings, canPomodoro]);

  // 🗣 Text-to-Speech controls
  const handleStartPause = () => {
    if (!window.speechSynthesis) {
      toast.error("Text-to-Speech not supported.");
      return;
    }

    if (!isPlaying) {
      const utter = new SpeechSynthesisUtterance(lessonContent.description);
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

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(sec % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  if (!lessonContent)
    return (
      <div className="p-6 text-center text-red-500 font-semibold text-lg">
        Lesson content not found!
      </div>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Toaster position="top-center" />

      {(isAdmin || isCourseOwner) && (
        <div className="mb-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-3 rounded">
          {isAdmin ? "Admin" : "Course Owner"} Mode — Pomodoro disabled.
        </div>
      )}

      {/* Header + TTS */}
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
            className={`px-4 py-2 rounded-full text-white shadow-md ${isPlaying
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gray-400 cursor-not-allowed"
              }`}
          >
            ⏹ Stop
          </button>
        </div>
      </div>

      {/* Pomodoro Timer Section */}
      {canPomodoro && pomodoroSettings.enabled && (
        <div className="mb-6 border border-gray-300 rounded-lg">
          <button
            onClick={() => setShowPomodoro((prev) => !prev)}
            className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-t-lg"
          >
            <span> ⌛ Pomodoro Timer</span>
            <span>{showPomodoro ? "▲" : "▼"}</span>
          </button>

          <div
            className={`transition-all duration-300 overflow-hidden ${showPomodoro ? "max-h-60 p-4" : "max-h-0 p-0"
              }`}
          >
            <div className="flex flex-col items-center text-gray-700">
              {timeLeft !== null ? (
                <>
                  <p className="text-2xl font-semibold mb-2">
                    {onBreak ? "☕ Break Time" : " ⌛Focus Time"}
                  </p>
                  <p
                    className={`text-4xl font-bold mb-3 ${onBreak
                        ? "text-orange-500"
                        : timeLeft <= 60
                          ? "text-red-600"
                          : "text-blue-600"
                      }`}
                  >
                    {formatTime(timeLeft)}
                  </p>
                </>
              ) : (
                <p className="text-gray-500 mb-3 italic">
                  No active Pomodoro session.
                </p>
              )}

              <p className="mb-3 text-sm text-gray-600">
                Focus: <b>{pomodoroSettings.focusMinutes}</b> min | Break:{" "}
                <b>{pomodoroSettings.shortBreakMinutes}</b> min
              </p>

              <div className="flex gap-2">
                <button
                  onClick={startNewSession}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  ▶️ Start New Session
                </button>
                <button
                  onClick={startBreakTimer}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  ☕ Start Break
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
