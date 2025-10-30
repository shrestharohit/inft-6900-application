import React, { useState, useEffect, useRef } from "react";

export default function PomodoroTimer() {
    const [settings, setSettings] = useState({
        enabled: false,
        focusMinutes: 25,
        shortBreakMinutes: 5,
    });
    const [timeLeft, setTimeLeft] = useState(0);
    const [collapsed, setCollapsed] = useState(true);
    const [onBreak, setOnBreak] = useState(false);
    const timerRef = useRef(null);

    // Load user settings
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("pomodoroSettings"));
        if (saved) setSettings(saved);
    }, []);

    // Start focus timer automatically when enabled
    useEffect(() => {
        if (!settings.enabled) return;

        const focusTime = settings.focusMinutes * 60;
        setTimeLeft(focusTime);

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    setOnBreak(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [settings.enabled, settings.focusMinutes]);

    const formatTime = (t) => {
        const m = Math.floor(t / 60).toString().padStart(2, "0");
        const s = (t % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    if (!settings.enabled) return null;

    const progress =
        ((settings.focusMinutes * 60 - timeLeft) / (settings.focusMinutes * 60)) *
        100;

    return (
        <div className="relative mt-4">
            {/* Collapsible toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-semibold shadow-sm flex justify-between items-center"
            >
                <span>Pomodoro Timer</span>
                <span>{collapsed ? "▼" : "▲"}</span>
            </button>

            {!collapsed && (
                <div className="p-5 rounded-lg mt-3 bg-white border border-gray-200 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-800 mb-2">
                        {onBreak ? "Break Time 🍵" : "Focus in Progress 🔥"}
                    </h2>

                    <div className="text-center text-4xl font-mono text-green-700 mb-3">
                        {formatTime(timeLeft)}
                    </div>

                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
                        <div
                            className="h-full bg-green-500"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>

                    <p className="text-sm text-gray-600 text-center">
                        Focus: {settings.focusMinutes} min • Break: {settings.shortBreakMinutes} min
                    </p>
                </div>
            )}
        </div>
    );
}
