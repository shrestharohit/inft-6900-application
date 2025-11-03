// // src/Pages/SchedulePage.jsx
// import React, { useState, useEffect } from "react";
// import { useAuth } from "../contexts/AuthContext";
// import { Calendar, momentLocalizer } from "react-big-calendar";
// import moment from "moment";
// import "react-big-calendar/lib/css/react-big-calendar.css";

// const localizer = momentLocalizer(moment);

// const SchedulePage = () => {
//   const { loggedInUser } = useAuth();

//   const [modules, setModules] = useState([
//     { id: 1, name: "Module 1", expectedHours: 3, sessions: [] },
//     { id: 2, name: "Module 2", expectedHours: 2, sessions: [] },
//     { id: 3, name: "Module 3", expectedHours: 4, sessions: [] },
//   ]);

//   const [selectedModule, setSelectedModule] = useState(null);
//   const [newSession, setNewSession] = useState({ date: "", startTime: "", endTime: "" });
//   const [editingSession, setEditingSession] = useState({ moduleId: null, sessionIdx: null });

//   // Load saved data
//   useEffect(() => {
//     const savedData = localStorage.getItem("studyModules");
//     if (savedData) {
//       try {
//         setModules(JSON.parse(savedData));
//       } catch (err) {
//         console.error("Failed to load saved schedule:", err);
//       }
//     }
//   }, []);

//   // Save data on modules change
//   useEffect(() => {
//     localStorage.setItem("studyModules", JSON.stringify(modules));
//   }, [modules]);

//   const formatTime = (timeStr) => (timeStr ? moment(timeStr, "HH:mm").format("hh:mm A") : "");
//   const calculateHours = (start, end) => {
//     const diff = (new Date(`2020-01-01T${end}:00`) - new Date(`2020-01-01T${start}:00`)) / (1000 * 60 * 60);
//     return diff > 0 ? parseFloat(diff.toFixed(2)) : 0;
//   };
//   const getTotalStudyHours = (sessions) => parseFloat(sessions.reduce((sum, s) => sum + (s.duration || 0), 0).toFixed(2));
//   const formatDuration = (decimalHours) => {
//     const h = Math.floor(decimalHours);
//     const m = Math.round((decimalHours - h) * 60);
//     return `${h}h ${m}m`;
//   };

//   const handleAddOrEditSession = () => {
//     if (!selectedModule) return alert("Please select a module first.");
//     if (!newSession.date || !newSession.startTime || !newSession.endTime) return alert("Fill all fields.");

//     const duration = calculateHours(newSession.startTime, newSession.endTime);
//     if (duration <= 0) return alert("End time must be after start time.");

//     const currentScheduled = getTotalStudyHours(selectedModule.sessions);
//     const isEditing = editingSession.sessionIdx !== null;

//     // Check total scheduled time
//     const totalAfter = isEditing
//       ? currentScheduled - selectedModule.sessions[editingSession.sessionIdx].duration + duration
//       : currentScheduled + duration;

//     if (totalAfter > selectedModule.expectedHours)
//       return alert(`Cannot exceed expected hours (${formatDuration(selectedModule.expectedHours)}) for this module.`);

//     setModules((prev) =>
//       prev.map((mod) =>
//         mod.id === selectedModule.id
//           ? {
//               ...mod,
//               sessions: isEditing
//                 ? mod.sessions.map((s, idx) => (idx === editingSession.sessionIdx ? { ...newSession, duration } : s))
//                 : [...mod.sessions, { ...newSession, duration }],
//             }
//           : mod
//       )
//     );

//     setNewSession({ date: "", startTime: "", endTime: "" });
//     setEditingSession({ moduleId: null, sessionIdx: null });
//   };

//   const handleEditSession = (modId, sessionIdx) => {
//     const session = modules.find((m) => m.id === modId).sessions[sessionIdx];
//     setSelectedModule(modules.find((m) => m.id === modId));
//     setNewSession({ date: session.date, startTime: session.startTime, endTime: session.endTime });
//     setEditingSession({ moduleId: modId, sessionIdx });
//   };

//   const handleDeleteSession = (modId, sessionIdx) => {
//     if (!window.confirm("Are you sure?")) return;

//     setModules((prev) =>
//       prev.map((mod) =>
//         mod.id === modId ? { ...mod, sessions: mod.sessions.filter((_, idx) => idx !== sessionIdx) } : mod
//       )
//     );

//     // Clear editing state if deleted session was being edited
//     if (editingSession.moduleId === modId && editingSession.sessionIdx === sessionIdx) {
//       setEditingSession({ moduleId: null, sessionIdx: null });
//       setNewSession({ date: "", startTime: "", endTime: "" });
//     }
//   };

//   // Export session(s) to Google Calendar
//   const exportModuleToGoogleCalendar = (module) => {
//     if (!module.sessions.length) return alert("No sessions to export!");

//     module.sessions.forEach((s, idx) => {
//       setTimeout(() => {
//         const start = new Date(`${s.date}T${s.startTime}:00`).toISOString().replace(/[-:]|\.\d{3}/g, "");
//         const end = new Date(`${s.date}T${s.endTime}:00`).toISOString().replace(/[-:]|\.\d{3}/g, "");
//         const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
//           module.name
//         )}&dates=${start}/${end}&details=${encodeURIComponent(`Study session for ${module.name}`)}`;
//         window.open(url, "_blank");
//       }, idx * 300);
//     });
//   };

//   const events = modules.flatMap((mod) =>
//     mod.sessions.map((s, i) => ({
//       title: mod.name,
//       start: new Date(`${s.date}T${s.startTime}:00`),
//       end: new Date(`${s.date}T${s.endTime}:00`),
//       details: `Module: ${mod.name}\n${s.date} ${formatTime(s.startTime)} - ${formatTime(s.endTime)}`,
//       id: `${mod.id}-${i}`,
//     }))
//   );

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-6xl mx-auto py-12 px-4">
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold text-gray-900">📚 Study Schedule Planner</h1>
//           <p className="text-gray-600 mt-2">Manage your study modules and sessions easily.</p>
//         </div>

//         {/* Add/Edit Session */}
//         <div className="bg-white rounded-3xl shadow-lg p-6 mb-10 border border-gray-200">
//           <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add / Edit Session</h2>
//           <div className="grid md:grid-cols-2 gap-6 mb-4">
//             <div>
//               <label className="block text-gray-700 mb-1 font-medium">Select Module</label>
//               <select
//                 value={selectedModule?.id || ""}
//                 onChange={(e) =>
//                   setSelectedModule(modules.find((m) => m.id === parseInt(e.target.value)))
//                 }
//                 className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400"
//               >
//                 <option value="">-- Choose a module --</option>
//                 {modules.map((m) => (
//                   <option key={m.id} value={m.id}>
//                     {m.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="grid grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-gray-700 mb-1 font-medium">Date</label>
//                 <input
//                   type="date"
//                   value={newSession.date}
//                   onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
//                   className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400"
//                 />
//               </div>
//               <div>
//                 <label className="block text-gray-700 mb-1 font-medium">Start</label>
//                 <input
//                   type="time"
//                   value={newSession.startTime}
//                   onChange={(e) => setNewSession({ ...newSession, startTime: e.target.value })}
//                   className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400"
//                 />
//               </div>
//               <div>
//                 <label className="block text-gray-700 mb-1 font-medium">End</label>
//                 <input
//                   type="time"
//                   value={newSession.endTime}
//                   onChange={(e) => setNewSession({ ...newSession, endTime: e.target.value })}
//                   className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400"
//                 />
//               </div>
//             </div>

//             <div className="flex justify-end mt-4 md:col-span-2">
//               <button
//                 onClick={handleAddOrEditSession}
//                 className="bg-blue-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-blue-700 transition"
//               >
//                 {editingSession.sessionIdx !== null ? "Save Changes" : "+ Add Session"}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Module List */}
//         <div className="space-y-6">
//           {modules.map((mod) => (
//             <div
//               key={mod.id}
//               className="bg-white shadow-md rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition"
//             >
//               <div className="flex items-center justify-between mb-3">
//                 <h3 className="text-lg font-semibold text-gray-800">{mod.name}</h3>
//                 <span className="text-sm text-gray-500">
//                   Expected: {formatDuration(mod.expectedHours)} • Scheduled:{" "}
//                   <b>{formatDuration(getTotalStudyHours(mod.sessions))}</b>
//                 </span>
//               </div>

//               {mod.sessions.length > 0 ? (
//                 <ul className="divide-y divide-gray-200 text-gray-700">
//                   {mod.sessions.map((s, i) => (
//                     <li key={i} className="flex justify-between py-2 text-sm md:text-base">
//                       <span>
//                         {s.date} — {formatTime(s.startTime)} to {formatTime(s.endTime)}
//                       </span>
//                       <span className="flex items-center gap-3">
//                         <button
//                           className="text-blue-600 hover:underline"
//                           onClick={() => handleEditSession(mod.id, i)}
//                         >
//                           Edit
//                         </button>
//                         <button
//                           className="text-red-600 hover:underline"
//                           onClick={() => handleDeleteSession(mod.id, i)}
//                         >
//                           Delete
//                         </button>
//                         <button
//                           className="bg-green-600 text-white font-medium px-2 py-0.5 rounded-lg hover:bg-green-700 transition text-xs"
//                           onClick={() => exportModuleToGoogleCalendar({ ...mod, sessions: [s] })}
//                         >
//                           Export
//                         </button>
//                       </span>
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p className="text-gray-400 italic text-sm">No sessions added yet.</p>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Calendar */}
//         <div className="mt-10 bg-white rounded-2xl shadow-md p-5">
//           <Calendar
//             localizer={localizer}
//             events={events}
//             startAccessor="start"
//             endAccessor="end"
//             style={{ height: 500 }}
//             components={{
//               event: ({ event }) => (
//                 <div
//                   className="px-1 py-1 bg-blue-500 text-white rounded text-xs cursor-pointer"
//                   title={event.details}
//                 >
//                   {event.title}
//                 </div>
//               ),
//             }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SchedulePage;
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import useRoleAccess from "../hooks/useRoleAccess";

const localizer = momentLocalizer(moment);

const SchedulePage = () => {
  const { loggedInUser } = useAuth();
  const { canSchedule, isAdmin, isCourseOwner, canViewCourses } = useRoleAccess();

  const [modules, setModules] = useState([
    { id: 1, name: "Module 1", expectedHours: 3, sessions: [] },
    { id: 2, name: "Module 2", expectedHours: 2, sessions: [] },
    { id: 3, name: "Module 3", expectedHours: 4, sessions: [] },
  ]);

  const [selectedModule, setSelectedModule] = useState(null);
  const [newSession, setNewSession] = useState({ date: "", startTime: "", endTime: "" });
  const [editingSession, setEditingSession] = useState({ moduleId: null, sessionIdx: null });

  if (!canViewCourses) {
    return (
      <div className="p-6 text-center text-red-500 font-semibold">
        You do not have permission to view this page.
      </div>
    );
  }

  useEffect(() => {
    const savedData = localStorage.getItem("studyModules");
    if (savedData) {
      try {
        setModules(JSON.parse(savedData));
      } catch (err) {
        console.error("Failed to load saved schedule:", err);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("studyModules", JSON.stringify(modules));
  }, [modules]);

  const formatTime = (timeStr) => (timeStr ? moment(timeStr, "HH:mm").format("hh:mm A") : "");

  const calculateHours = (start, end) => {
    const diff = (new Date(`2020-01-01T${end}:00`) - new Date(`2020-01-01T${start}:00`)) / (1000 * 60 * 60);
    return diff > 0 ? parseFloat(diff.toFixed(2)) : 0;
  };

  const getTotalStudyHours = (sessions) =>
    parseFloat(sessions.reduce((sum, s) => sum + (s.duration || 0), 0).toFixed(2));

  const formatDuration = (decimalHours) => {
    const h = Math.floor(decimalHours);
    const m = Math.round((decimalHours - h) * 60);
    return `${h}h ${m}m`;
  };

  // Add/Edit session (no restriction on hours)
  const handleAddOrEditSession = () => {
    if (!canSchedule) return alert("You do not have permission to modify schedule.");
    if (!selectedModule) return alert("Please select a module first.");
    if (!newSession.date || !newSession.startTime || !newSession.endTime) return alert("Fill all fields.");

    const duration = calculateHours(newSession.startTime, newSession.endTime);
    if (duration <= 0) return alert("End time must be after start time.");

    const isEditing = editingSession.sessionIdx !== null;

    setModules((prev) =>
      prev.map((m) =>
        m.id === selectedModule.id
          ? {
              ...m,
              sessions: isEditing
                ? m.sessions.map((s, idx) =>
                    idx === editingSession.sessionIdx ? { ...newSession, duration } : s
                  )
                : [...m.sessions, { ...newSession, duration }],
            }
          : m
      )
    );

    setNewSession({ date: "", startTime: "", endTime: "" });
    setEditingSession({ moduleId: null, sessionIdx: null });
  };

  const handleEditSession = (modId, sessionIdx) => {
    if (!canSchedule) return;
    const session = modules.find((m) => m.id === modId).sessions[sessionIdx];
    setSelectedModule(modules.find((m) => m.id === modId));
    setNewSession({ date: session.date, startTime: session.startTime, endTime: session.endTime });
    setEditingSession({ moduleId: modId, sessionIdx });
  };

  const handleDeleteSession = (modId, sessionIdx) => {
    if (!canSchedule) return;
    if (!window.confirm("Are you sure?")) return;

    setModules((prev) =>
      prev.map((mod) =>
        mod.id === modId ? { ...mod, sessions: mod.sessions.filter((_, idx) => idx !== sessionIdx) } : mod
      )
    );

    if (editingSession.moduleId === modId && editingSession.sessionIdx === sessionIdx) {
      setEditingSession({ moduleId: null, sessionIdx: null });
      setNewSession({ date: "", startTime: "", endTime: "" });
    }
  };

  const exportModuleToGoogleCalendar = (module) => {
    if (!canSchedule) return alert("You do not have permission to export sessions.");
    if (!module.sessions.length) return alert("No sessions to export!");

    module.sessions.forEach((s, idx) => {
      setTimeout(() => {
        const start = new Date(`${s.date}T${s.startTime}:00`).toISOString().replace(/[-:]|\.\d{3}/g, "");
        const end = new Date(`${s.date}T${s.endTime}:00`).toISOString().replace(/[-:]|\.\d{3}/g, "");
        const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
          module.name
        )}&dates=${start}/${end}&details=${encodeURIComponent(`Study session for ${module.name}`)}`;
        window.open(url, "_blank");
      }, idx * 300);
    });
  };

  const events = modules.flatMap((mod) =>
    mod.sessions.map((s, i) => ({
      title: mod.name,
      start: new Date(`${s.date}T${s.startTime}:00`),
      end: new Date(`${s.date}T${s.endTime}:00`),
      details: `Module: ${mod.name}\n${s.date} ${formatTime(s.startTime)} - ${formatTime(s.endTime)}`,
      id: `${mod.id}-${i}`,
    }))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-12 px-4">
        {(isAdmin || isCourseOwner) && (
          <div className="mb-6 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-3 rounded">
            {isAdmin ? "Admin" : "Course Owner"} Preview Mode — view-only access.
          </div>
        )}

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">📚 Study Schedule Planner</h1>
          <p className="text-gray-600 mt-2">Manage your study modules and sessions easily.</p>
        </div>

        {canSchedule && (
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-10 border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add / Edit Session</h2>
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

              <div className="flex justify-end mt-4 md:col-span-2">
                <button
                  onClick={handleAddOrEditSession}
                  className="bg-blue-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  {editingSession.sessionIdx !== null ? "Save Changes" : "+ Add Session"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {modules.map((mod) => (
            <div
              key={mod.id}
              className="bg-white shadow-md rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800">{mod.name}</h3>
                <span className="text-sm text-gray-500">
                  Expected: {formatDuration(mod.expectedHours)} • Scheduled:{" "}
                  <b>{formatDuration(getTotalStudyHours(mod.sessions))}</b>
                </span>
              </div>

              {mod.sessions.length > 0 ? (
                <ul className="divide-y divide-gray-200 text-gray-700">
                  {mod.sessions.map((s, i) => (
                    <li key={i} className="flex justify-between py-2 text-sm md:text-base">
                      <span>
                        {s.date} — {formatTime(s.startTime)} to {formatTime(s.endTime)}
                      </span>
                      {canSchedule && (
                        <span className="flex items-center gap-3">
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
                            className="bg-green-600 text-white font-medium px-2 py-0.5 rounded-lg hover:bg-green-700 transition text-xs"
                            onClick={() => exportModuleToGoogleCalendar({ ...mod, sessions: [s] })}
                          >
                            Export
                          </button>
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 italic text-sm">No sessions added yet.</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 bg-white rounded-2xl shadow-md p-5">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            components={{
              event: ({ event }) => (
                <div
                  className="px-1 py-1 bg-blue-500 text-white rounded text-xs cursor-pointer"
                  title={event.details}
                >
                  {event.title}
                </div>
              ),
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;

