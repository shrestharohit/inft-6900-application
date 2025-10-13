import React, { useState, useEffect } from "react";
import beforeAuthLayout from "../components/BeforeAuth";
import { useAuth } from "../contexts/AuthContext";

const SchedulePage = () => {
  const { loggedInUser } = useAuth();

  // Dummy modules
  const [modules, setModules] = useState([
    { id: 1, name: "Module 1", expectedHours: 3, sessions: [] },
    { id: 2, name: "Module 2", expectedHours: 2, sessions: [] },
    { id: 3, name: "Module 3", expectedHours: 4, sessions: [] },
  ]);

  const [selectedModule, setSelectedModule] = useState(null);
  const [newSession, setNewSession] = useState({ date: "", startTime: "", endTime: "" });
  const [editingSession, setEditingSession] = useState({ moduleId: null, sessionIdx: null });

  // Calculate duration in hours
  const calculateHours = (start, end) => {
    const startTime = new Date(`2020-01-01T${start}:00`);
    const endTime = new Date(`2020-01-01T${end}:00`);
    const diff = (endTime - startTime) / (1000 * 60 * 60);
    return diff > 0 ? parseFloat(diff.toFixed(2)) : 0;
  };

  const getTotalStudyHours = (sessions) =>
    parseFloat(sessions.reduce((sum, s) => sum + (s.duration || 0), 0).toFixed(2));

  // Add or update session
  const handleAddOrEditSession = () => {
    if (!selectedModule) return alert("Please select a module first.");
    if (!newSession.date || !newSession.startTime || !newSession.endTime)
      return alert("Please fill out all fields.");

    const duration = calculateHours(newSession.startTime, newSession.endTime);
    if (duration <= 0) return alert("End time must be after start time.");

    if (editingSession.sessionIdx !== null) {
      // Update existing session
      setModules((prev) =>
        prev.map((mod) =>
          mod.id === editingSession.moduleId
            ? {
                ...mod,
                sessions: mod.sessions.map((s, idx) =>
                  idx === editingSession.sessionIdx ? { ...newSession, duration } : s
                ),
              }
            : mod
        )
      );
    } else {
      // Add new session
      setModules((prev) =>
        prev.map((mod) =>
          mod.id === selectedModule.id
            ? { ...mod, sessions: [...mod.sessions, { ...newSession, duration }] }
            : mod
        )
      );
    }

    setNewSession({ date: "", startTime: "", endTime: "" });
    setEditingSession({ moduleId: null, sessionIdx: null });
  };

  // Edit session
  const handleEditSession = (modId, sessionIdx) => {
    const session = modules.find((m) => m.id === modId).sessions[sessionIdx];
    setSelectedModule(modules.find((m) => m.id === modId));
    setNewSession({ date: session.date, startTime: session.startTime, endTime: session.endTime });
    setEditingSession({ moduleId: modId, sessionIdx });
  };

  // Delete session
  const handleDeleteSession = (modId, sessionIdx) => {
    if (window.confirm("Are you sure you want to delete this session?")) {
      setModules((prev) =>
        prev.map((mod) =>
          mod.id === modId
            ? {
                ...mod,
                sessions: mod.sessions.filter((_, idx) => idx !== sessionIdx),
              }
            : mod
        )
      );
    }
  };

  // Notifications
  useEffect(() => {
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") Notification.requestPermission();

    const interval = setInterval(() => {
      const now = new Date();
      modules.forEach((mod) =>
        mod.sessions.forEach((s) => {
          const sessionDate = new Date(`${s.date}T${s.startTime}:00`);
          const notifyTime = new Date(sessionDate.getTime() - 5 * 60000); // 5 min before
          if (
            now >= notifyTime &&
            now <= new Date(notifyTime.getTime() + 60000) && // 1-minute window
            !s.notified
          ) {
            new Notification(`Upcoming Study: ${mod.name}`, {
              body: `Session starts at ${s.startTime}`,
            });
            s.notified = true; // Mark as notified
          }
        })
      );
    }, 10000); // check every 10 sec

    return () => clearInterval(interval);
  }, [modules]);

  // Export to Google Calendar
  const exportToGoogleCalendar = (session, modName) => {
    const start = new Date(`${session.date}T${session.startTime}:00`).toISOString();
    const end = new Date(`${session.date}T${session.endTime}:00`).toISOString();
    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      modName
    )}&dates=${start.replace(/[-:]|\.\d{3}/g, "")}/${end.replace(/[-:]|\.\d{3}/g, "")}&details=Study+Session`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-5xl mx-auto py-12 px-6">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Study Schedule Planner</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Add / Edit Study Session</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Select Module</label>
              <select
                value={selectedModule?.id || ""}
                onChange={(e) =>
                  setSelectedModule(modules.find((m) => m.id === parseInt(e.target.value)))
                }
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400"
              >
                <option value="">-- Choose a module --</option>
                {modules.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 mb-1 font-medium">Date</label>
                <input
                  type="date"
                  value={newSession.date}
                  onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1 font-medium">Start</label>
                <input
                  type="time"
                  value={newSession.startTime}
                  onChange={(e) => setNewSession({ ...newSession, startTime: e.target.value })}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1 font-medium">End</label>
                <input
                  type="time"
                  value={newSession.endTime}
                  onChange={(e) => setNewSession({ ...newSession, endTime: e.target.value })}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleAddOrEditSession}
            className="bg-blue-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {editingSession.sessionIdx !== null ? "Save Changes" : "+ Add Session"}
          </button>
        </div>

        <div className="space-y-6">
          {modules.map((mod) => (
            <div
              key={mod.id}
              className="bg-white shadow-sm rounded-xl p-5 border border-gray-100 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800">{mod.name}</h3>
                <span className="text-sm text-gray-500">
                  Expected: {mod.expectedHours}h • Scheduled: <b>{getTotalStudyHours(mod.sessions)}h</b>
                </span>
              </div>

              {mod.sessions.length > 0 ? (
                <ul className="divide-y divide-gray-200 text-gray-700">
                  {mod.sessions.map((s, i) => (
                    <li key={i} className="flex justify-between py-2 text-sm md:text-base">
                      <span>
                        {s.date} — {s.startTime} to {s.endTime}
                      </span>
                      <span className="flex items-center gap-3">
                        {s.duration.toFixed(2)}h
                        <button
                          className="text-blue-600 hover:underline"
                          onClick={() => handleEditSession(mod.id, i)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:underline"
                          onClick={() => handleDeleteSession(mod.id, i)}
                        >
                          Delete
                        </button>
                        <button
                          className="text-green-600 hover:underline"
                          onClick={() => exportToGoogleCalendar(s, mod.name)}
                        >
                          +Google Calendar
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 italic text-sm">No sessions added yet.</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default beforeAuthLayout(SchedulePage);
