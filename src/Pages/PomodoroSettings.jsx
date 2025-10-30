import React, { useState, useEffect } from "react";
import beforeAuthLayout from "../components/BeforeAuth";

const DEFAULTS = {
    enabled: false,
    focusMinutes: 25,
    shortBreakMinutes: 5,
};

function PomodoroSettings() {
    const [enabled, setEnabled] = useState(DEFAULTS.enabled);
    const [focusHours, setFocusHours] = useState(0);
    const [focusMinutes, setFocusMinutes] = useState(DEFAULTS.focusMinutes);
    const [breakHours, setBreakHours] = useState(0);
    const [breakMinutes, setBreakMinutes] = useState(DEFAULTS.shortBreakMinutes);
    const [savedMsg, setSavedMsg] = useState("");

    // 🧠 Load saved settings
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("pomodoroSettings"));
        if (saved) {
            setEnabled(!!saved.enabled);
            const totalFocus = saved.focusMinutes ?? DEFAULTS.focusMinutes;
            const totalBreak = saved.shortBreakMinutes ?? DEFAULTS.shortBreakMinutes;

            setFocusHours(Math.floor(totalFocus / 60));
            setFocusMinutes(totalFocus % 60);
            setBreakHours(Math.floor(totalBreak / 60));
            setBreakMinutes(totalBreak % 60);
        }
    }, []);

    const totalFocusMinutes = focusHours * 60 + focusMinutes;
    const totalBreakMinutes = breakHours * 60 + breakMinutes;

    const handleSave = () => {
        const settings = {
            enabled,
            focusMinutes: Math.max(1, totalFocusMinutes),
            shortBreakMinutes: Math.max(1, totalBreakMinutes),
        };
        localStorage.setItem("pomodoroSettings", JSON.stringify(settings));
        setSavedMsg("Settings saved successfully!");
        setTimeout(() => setSavedMsg(""), 1800);
    };

    const handleReset = () => {
        setEnabled(DEFAULTS.enabled);
        setFocusHours(0);
        setFocusMinutes(DEFAULTS.focusMinutes);
        setBreakHours(0);
        setBreakMinutes(DEFAULTS.shortBreakMinutes);
        setSavedMsg("");
    };

    return (
        <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-8 mt-10 mb-16">
            <h2 className="text-3xl font-bold text-center text-[#1f2a60] mb-6">
                Pomodoro Settings
            </h2>

            {/* Enable Switch */}
            <div className="flex items-center justify-between mb-6">
                <span className="text-lg font-semibold text-gray-700">
                    Enable Pomodoro
                </span>
                <button
                    type="button"
                    onClick={() => setEnabled((v) => !v)}
                    className={`w-16 h-8 flex items-center rounded-full p-1 transition-all duration-300 ${enabled ? "bg-green-500" : "bg-gray-300"
                        }`}
                >
                    <div
                        className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-all ${enabled ? "translate-x-8" : ""
                            }`}
                    />
                </button>
            </div>

            {/* Settings Section */}
            <div
                className={`space-y-6 ${enabled ? "opacity-100" : "opacity-50 pointer-events-none select-none"
                    }`}
            >
                {/* Focus Duration */}
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                        Focus Duration
                    </label>
                    <div className="flex gap-4">
                        <select
                            value={focusHours}
                            onChange={(e) => setFocusHours(Number(e.target.value))}
                            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500"
                        >
                            {[...Array(4)].map((_, h) => (
                                <option key={h} value={h}>
                                    {h} h
                                </option>
                            ))}
                        </select>
                        <select
                            value={focusMinutes}
                            onChange={(e) => setFocusMinutes(Number(e.target.value))}
                            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500"
                        >
                            {[...Array(60)].map((_, m) => (
                                <option key={m} value={m}>
                                    {m} m
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Short Break Duration */}
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                        Short Break Duration
                    </label>
                    <div className="flex gap-4">
                        <select
                            value={breakHours}
                            onChange={(e) => setBreakHours(Number(e.target.value))}
                            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500"
                        >
                            {[...Array(2)].map((_, h) => (
                                <option key={h} value={h}>
                                    {h} h
                                </option>
                            ))}
                        </select>
                        <select
                            value={breakMinutes}
                            onChange={(e) => setBreakMinutes(Number(e.target.value))}
                            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500"
                        >
                            {[...Array(60)].map((_, m) => (
                                <option key={m} value={m}>
                                    {m} m
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex items-center gap-3">
                <button
                    type="button"
                    onClick={handleSave}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-md transition"
                >
                    Save Settings
                </button>
                <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-3 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                    Reset
                </button>
            </div>

            {/* Status */}
            <div className="mt-6 flex items-center justify-between">
                <span
                    className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${enabled
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                >
                    {enabled ? "Pomodoro Mode: Active" : "Pomodoro Mode: Disabled"}
                </span>
                {savedMsg && (
                    <span className="text-sm text-green-700 bg-green-50 px-2.5 py-1 rounded">
                        {savedMsg}
                    </span>
                )}
            </div>
        </div>
    );
}

// ✅ Wrap with layout for consistent header & footer
export default beforeAuthLayout(PomodoroSettings);
