import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import beforeAuthLayout from "../components/BeforeAuth";
import { useAuth } from "../contexts/AuthContext";

const SchedulePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { loggedInUser } = useAuth();

  // Get courseName from location.state if passed, fallback to "Course"
  const courseNameFromState = location.state?.courseName || "Course";

  const [modules, setModules] = useState([
    { id: 1, name: "Module 1", expectedHours: 3, sessions: [] },
    { id: 2, name: "Module 2", expectedHours: 2, sessions: [] },
    { id: 3, name: "Module 3", expectedHours: 4, sessions: [] },
  ]);

  const [selectedModule, setSelectedModule] = useState(null);
  const [newSession, setNewSession] = useState({
    date: "",
    startTime: "",
    endTime: "",
  });

  const calculateHours = (start, end) => {
    const startTime = new Date(`2020-01-01T${start}:00`);
    const endTime = new Date(`2020-01-01T${end}:00`);
    const diff = (endTime - startTime) / (1000 * 60 * 60);
    return diff > 0 ? parseFloat(diff.toFixed(2)) : 0;
  };

  const handleAddSession = () => {
    if (!selectedModule) {
      alert("Please select a module first.");
      return;
    }

    if (!newSession.date || !newSession.startTime || !newSession.endTime) {
      alert("Please fill out all fields.");
      return;
    }

    const duration = calculateHours(newSession.startTime, newSession.endTime);
    if (duration <= 0) {
      alert("End time must be after start time.");
      return;
    }

    setModules((prev) =>
      prev.map((mod) =>
        mod.id === selectedModule.id
          ? { ...mod, sessions: [...mod.sessions, { ...newSession, duration }] }
          : mod
      )
    );

    setNewSession({ date: "", startTime: "", endTime: "" });
  };

  const getTotalStudyHours = (sessions) =>
    parseFloat(
      sessions.reduce((sum, s) => sum + (s.duration || 0), 0).toFixed(2)
    );

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now just log and redirect
    console.log("User:", loggedInUser?.name);
    console.log("Course ID:", courseId);
    console.log("Module Schedules:", modules);

    alert("All schedules saved successfully!");
    navigate(`/courses/${courseId}/content`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-5xl mx-auto py-12 px-6">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Study Schedule Planner
          </h1>
          <p className="text-gray-600">
            Plan flexible study sessions for your course: <b>{courseNameFromState}</b>
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Add Study Session
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Select Module
              </label>
              <select
                value={selectedModule?.id || ""}
                onChange={(e) =>
                  setSelectedModule(
                    modules.find((m) => m.id === parseInt(e.target.value))
                  )
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
                <label className="block text-gray-700 mb-1 font-medium">
                  Date
                </label>
                <input
                  type="date"
                  value={newSession.date}
                  onChange={(e) =>
                    setNewSession({ ...newSession, date: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1 font-medium">
                  Start
                </label>
                <input
                  type="time"
                  value={newSession.startTime}
                  onChange={(e) =>
                    setNewSession({
                      ...newSession,
                      startTime: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1 font-medium">
                  End
                </label>
                <input
                  type="time"
                  value={newSession.endTime}
                  onChange={(e) =>
                    setNewSession({
                      ...newSession,
                      endTime: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleAddSession}
            className="bg-blue-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Add Session
          </button>
        </div>

        <div className="space-y-6">
          {modules.map((mod) => (
            <div
              key={mod.id}
              className="bg-white shadow-sm rounded-xl p-5 border border-gray-100 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {mod.name}
                </h3>
                <span className="text-sm text-gray-500">
                  Expected: {mod.expectedHours}h • Scheduled:{" "}
                  <b>{getTotalStudyHours(mod.sessions)}h</b>
                </span>
              </div>

              {mod.sessions.length > 0 ? (
                <ul className="divide-y divide-gray-200 text-gray-700">
                  {mod.sessions.map((s, i) => (
                    <li
                      key={i}
                      className="flex justify-between py-2 text-sm md:text-base"
                    >
                      <span>
                        {s.date} — {s.startTime} to {s.endTime}
                      </span>
                      <span className="text-gray-600">
                        {s.duration.toFixed(2)}h
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 italic text-sm">
                  No sessions added yet.
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-xl transition shadow-md"
          >
            Save All Schedules
          </button>
        </div>
      </div>
    </div>
  );
};

export default beforeAuthLayout(SchedulePage);
