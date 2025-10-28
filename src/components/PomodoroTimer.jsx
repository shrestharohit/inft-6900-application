import React, { useState, useEffect, useRef } from "react";

export default function PomodoroTimer() {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [isBreak, setIsBreak] = useState(false);
    const [sessionLength, setSessionLength] = useState(25);
    const [breakLength, setBreakLength] = useState(5);
    const [showReminder, setShowReminder] = useState(false);
    const [collapsed, setCollapsed] = useState(true);
    const timerRef = useRef(null);

    const formatTime = (t) => {
        const m = Math.floor(t / 60).toString().padStart(2, "0");
        const s = (t % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    // Core timer logic
    useEffect(() => {
        if (isRunning) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev > 0) return prev - 1;
                    clearInterval(timerRef.current);
                    setIsRunning(false);
                    if (!isBreak) {
                        // End of focus session → show reminder
                        setShowReminder(true);
                    }
                    const nextIsBreak = !isBreak;
                    setIsBreak(nextIsBreak);
                    setTimeLeft((nextIsBreak ? breakLength : sessionLength) * 60);
                    return 0;
                });
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [isRunning, isBreak, breakLength, sessionLength]);

    const handleReset = () => {
        clearInterval(timerRef.current);
        setIsRunning(false);
        setIsBreak(false);
        setTimeLeft(sessionLength * 60);
        setShowReminder(false);
    };

    const progress =
        ((isBreak
            ? (breakLength * 60 - timeLeft) / (breakLength * 60)
            : (sessionLength * 60 - timeLeft) / (sessionLength * 60)) *
            100) ||
        0;

    return (
        <div className="relative">
            {/* Collapsible Toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold mb-3 shadow-sm flex justify-between items-center"
            >
                <span>🧠 Focus Mode</span>
                <span>{collapsed ? "▼" : "▲"}</span>
            </button>

            {/* Expanded view */}
            {!collapsed && (
                <div
                    className={`max-w-md p-5 rounded-2xl shadow-md border ${isBreak ? "bg-green-50 border-green-300" : "bg-white border-gray-200"
                        }`}
                >
                    <h2 className="text-xl font-bold text-center mb-2 text-gray-800">
                        {isBreak ? "Break Time 🍵" : "Focus Session 🔥"}
                    </h2>

                    <div className="text-center text-5xl font-mono text-blue-700 mb-4">
                        {formatTime(timeLeft)}
                    </div>

                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-4">
                        <div
                            className={`h-full ${isBreak ? "bg-green-500" : "bg-blue-500"}`}
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>

                    <div className="flex justify-center gap-3 mb-4">
                        <button
                            onClick={() => setIsRunning(!isRunning)}
                            className={`px-4 py-2 rounded text-white font-semibold ${isRunning
                                    ? "bg-red-500 hover:bg-red-600"
                                    : "bg-blue-600 hover:bg-blue-700"
                                }`}
                        >
                            {isRunning ? "Pause" : "Start"}
                        </button>
                        <button
                            onClick={handleReset}
                            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold"
                        >
                            Reset
                        </button>
                    </div>

                    <div className="flex justify-between items-center text-sm text-gray-700">
                        <div>
                            <label className="block text-xs">Focus (min)</label>
                            <input
                                type="number"
                                value={sessionLength}
                                onChange={(e) => setSessionLength(Number(e.target.value))}
                                className="w-16 p-1 border rounded text-center"
                            />
                        </div>
                        <div>
                            <label className="block text-xs">Break (min)</label>
                            <input
                                type="number"
                                value={breakLength}
                                onChange={(e) => setBreakLength(Number(e.target.value))}
                                className="w-16 p-1 border rounded text-center"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Break Reminder Toast */}
            {showReminder && (
                <div className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-lg shadow-lg animate-bounce z-50">
                    <p className="font-semibold">
                        🕒 Great job! Time for a {breakLength}-minute break.
                    </p>
                    <button
                        onClick={() => setShowReminder(false)}
                        className="mt-2 bg-white text-green-700 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100"
                    >
                        Got it
                    </button>
                </div>
            )}
        </div>
    );
}
