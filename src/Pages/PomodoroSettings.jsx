import React, { useState, useEffect, useMemo } from "react";

const DEFAULTS = {
    enabled: false,
    focusMinutes: 25,
    shortBreakMinutes: 5,
};

export default function PomodoroSettings() {
    const [enabled, setEnabled] = useState(DEFAULTS.enabled);
    const [focusMinutes, setFocusMinutes] = useState(DEFAULTS.focusMinutes);
    const [shortBreakMinutes, setShortBreakMinutes] = useState(DEFAULTS.shortBreakMinutes);
    const [savedMsg, setSavedMsg] = useState("");

    // Load saved settings on mount (migrates older keys by ignoring them)
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("pomodoroSettings"));
        if (saved) {
            setEnabled(!!saved.enabled);
            setFocusMinutes(
                Number.isFinite(saved.focusMinutes) ? saved.focusMinutes : DEFAULTS.focusMinutes
            );
            setShortBreakMinutes(
                Number.isFinite(saved.shortBreakMinutes) ? saved.shortBreakMinutes : DEFAULTS.shortBreakMinutes
            );
        }
    }, []);

    // Helpers
    const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

    const handleSave = () => {
        const settings = {
            enabled,
            focusMinutes: clamp(Number(focusMinutes) || DEFAULTS.focusMinutes, 5, 120),
            shortBreakMinutes: clamp(Number(shortBreakMinutes) || DEFAULTS.shortBreakMinutes, 1, 30),
        };
        localStorage.setItem("pomodoroSettings", JSON.stringify(settings));
        setFocusMinutes(settings.focusMinutes);
        setShortBreakMinutes(settings.shortBreakMinutes);
        setSavedMsg("Pomodoro settings saved.");
        setTimeout(() => setSavedMsg(""), 1800);
    };

    const handleReset = () => {
        setEnabled(DEFAULTS.enabled);
        setFocusMinutes(DEFAULTS.focusMinutes);
        setShortBreakMinutes(DEFAULTS.shortBreakMinutes);
        setSavedMsg("");
    };

    const applyPreset = (focus, shortBreak) => {
        setFocusMinutes(focus);
        setShortBreakMinutes(shortBreak);
    };

    const cycleSummary = useMemo(
        () => `${focusMinutes} min focus + ${shortBreakMinutes} min break • ${focusMinutes + shortBreakMinutes} min/cycle`,
        [focusMinutes, shortBreakMinutes]
    );

    return (
        <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-8 mt-10">
            <h2 className="text-3xl font-bold text-center text-[#1f2a60] mb-6">
                Pomodoro Settings
            </h2>

            {/* Enable Switch */}
            <div className="flex items-center justify-between mb-6">
                <span className="text-lg font-semibold text-gray-700">Enable Pomodoro</span>
                <button
                    type="button"
                    onClick={() => setEnabled((v) => !v)}
                    className={`w-16 h-8 flex items-center rounded-full p-1 transition-all duration-300 ${enabled ? "bg-green-500" : "bg-gray-300"
                        }`}
                    aria-pressed={enabled}
                >
                    <div
                        className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-all ${enabled ? "translate-x-8" : ""
                            }`}
                    />
                </button>
            </div>

            {/* Settings form */}
            <div
                className={`space-y-5 ${enabled ? "opacity-100" : "opacity-50 pointer-events-none select-none"
                    }`}
            >
                {/* Focus Duration */}
                <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                        Focus Duration (minutes)
                    </label>
                    <input
                        type="number"
                        min="5"
                        max="120"
                        value={focusMinutes}
                        onChange={(e) => setFocusMinutes(clamp(Number(e.target.value || 0), 0, 999))}
                        onBlur={() => setFocusMinutes((v) => clamp(Number(v || 0), 5, 120))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500"
                    />
                </div>

                {/* Short Break Duration */}
                <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                        Short Break (minutes)
                    </label>
                    <input
                        type="number"
                        min="1"
                        max="30"
                        value={shortBreakMinutes}
                        onChange={(e) => setShortBreakMinutes(clamp(Number(e.target.value || 0), 0, 999))}
                        onBlur={() => setShortBreakMinutes((v) => clamp(Number(v || 0), 1, 30))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500"
                    />
                </div>

                {/* Presets */}
                <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-gray-500 mr-1 self-center">Quick presets:</span>
                    <button
                        type="button"
                        onClick={() => applyPreset(25, 5)}
                        className="px-3 py-1.5 text-sm rounded-md bg-gray-100 hover:bg-gray-200"
                    >
                        25 / 5
                    </button>
                    <button
                        type="button"
                        onClick={() => applyPreset(30, 5)}
                        className="px-3 py-1.5 text-sm rounded-md bg-gray-100 hover:bg-gray-200"
                    >
                        30 / 5
                    </button>
                    <button
                        type="button"
                        onClick={() => applyPreset(45, 10)}
                        className="px-3 py-1.5 text-sm rounded-md bg-gray-100 hover:bg-gray-200"
                    >
                        45 / 10
                    </button>
                </div>

                {/* Summary */}
                <div className="text-sm text-gray-600">
                    <span className="inline-block px-3 py-1 rounded-full bg-gray-100">
                        {cycleSummary}
                    </span>
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
                    className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${enabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
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
