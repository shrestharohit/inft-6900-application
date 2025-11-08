import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import useRoleAccess from "../hooks/useRoleAccess";
import useModuleApi from "../hooks/useModuleApi";
import { useParams } from "react-router-dom";
import useScheduleApi from "../hooks/useScheduleApi";

const localizer = momentLocalizer(moment);

const SchedulePage = () => {
  const { courseId } = useParams();
  const { loggedInUser } = useAuth();
  const { createSchedule, fetchUserSchedule, updateSchedule, deleteSchedule } =
    useScheduleApi();
  const { fetchAllModulesInACourse } = useModuleApi();
  const { canSchedule, isAdmin, isCourseOwner, canViewCourses } =
    useRoleAccess();

  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const [newSession, setNewSession] = useState({
    date: "",
    startTime: "",
    endTime: "",
  });
  const [editID, setEditID] = useState(null);

  if (!canViewCourses) {
    return (
      <div className="p-6 text-center text-red-500 font-semibold">
        You do not have permission to view this page.
      </div>
    );
  }

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      try {
        const [moduleData, scheduleData] = await Promise.all([
          fetchAllModulesInACourse(courseId),
          fetchUserSchedule(loggedInUser?.id),
        ]);
        if (mounted) {
          setModules(moduleData);
          setSchedules(scheduleData.schedules);
        }
      } catch (err) {
        console.error("Failed to load modules", err);
        if (mounted) console.log("Failed to load modules.");
      }
    };
    loadData();
    return () => (mounted = false);
  }, [
    fetchAllModulesInACourse,
    fetchUserSchedule,
    loggedInUser?.id,
    fetchTrigger,
  ]);

  const formatTime = (timeStr) =>
    timeStr ? moment(timeStr, "HH:mm").format("hh:mm A") : "";

  const calculateHours = (start, end) => {
    const diff =
      (new Date(`2020-01-01T${end}`) - new Date(`2020-01-01T${start}`)) /
      (1000 * 60 * 60);
    return diff > 0 ? parseFloat(diff.toFixed(2)) : 0;
  };

  const getTotalStudyHours = (sessions) =>
    parseFloat(
      sessions.reduce((sum, s) => sum + (s.duration || 0), 0).toFixed(2)
    );

  function formatDuration(timeString) {
    if (!timeString) return "0 min";

    const [hours, minutes, seconds] = timeString.split(":").map(Number);

    let result = "";
    if (hours > 0) result += `${hours} hr `;
    if (minutes > 0) result += `${minutes} min`;

    // fallback if both are 0
    if (!hours && !minutes) result = `${seconds || 0} sec`;

    return result.trim();
  }

  // Add/Edit session (no restriction on hours)
  const handleAddOrEditSession = async () => {
    if (!canSchedule)
      return alert("You do not have permission to modify schedule.");
    if (!selectedModule) return alert("Please select a module first.");
    if (!newSession.date || !newSession.startTime || !newSession.endTime)
      return alert("Fill all fields.");

    const duration = calculateHours(newSession.startTime, newSession.endTime);
    if (duration <= 0) return alert("End time must be after start time.");

    if (editID) {
      await updateSchedule(editID, {
        date: newSession.date,
        startTime: newSession.startTime,
        endTime: newSession.endTime,
      });
      setEditID(null);
    } else {
      await createSchedule({
        userID: loggedInUser.id,
        moduleID: selectedModule,
        date: newSession.date,
        startTime: newSession.startTime,
        endTime: newSession.endTime,
      });
    }
    setNewSession({ date: "", startTime: "", endTime: "" });
    setSelectedModule(null);
    setFetchTrigger((prev) => prev + 1);
  };

  const handleDeleteSession = async (scheduleId) => {
    if (!canSchedule) return;
    if (!window.confirm("Are you sure?")) return;

    await deleteSchedule(scheduleId);
    setFetchTrigger((prev) => prev + 1);
  };

  const formatDateTime = (ts) => {
    return new Date(ts).toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: '2-digit' });
  };

  const exportModuleToGoogleCalendar = (s) => {
    console.log(s);
    if (!canSchedule)
      return alert("You do not have permission to export sessions.");
    if (!s) return alert("No sessions to export!");

    // TODO@Rohit: Fix Google Calendar export
    setTimeout(() => {
      console.log(formatDateTime(s.date), s.startTime, s.endTime);
      const start = new Date(`${formatDateTime(s.date)}T${s.startTime}`)
        .toISOString()
        .replace(/[-:]|\.\d{3}/g, "");
      const end = new Date(`${formatDateTime(s.date)}T${s.endTime}`)
        .toISOString()
        .replace(/[-:]|\.\d{3}/g, "");
      console.log(start, end);
      const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        s.moduleTitle
      )}&dates=${start}/${end}&details=${encodeURIComponent(
        `Study session for ${s.moduleTitle}`
      )}`;
      window.open(url, "_blank");
    }, 300);
  };

  const events = 
    schedules?.map((s, i) => ({
      title: s.moduleTitle,
      start: new Date(`${s.date.split("T")[0]}T${s.startTime}`),
      end: new Date(`${s.date.split("T")[0]}T${s.endTime}`),
      details: `Module: ${s.moduleTitle}\n${s.date.split("T")[0]} ${formatTime(
        s.startTime
      )} - ${formatTime(s.endTime)}`,
      id: `${s.scheduleID}`,
    }));

  const handleEditSchedule = (schedule) => () => {
    console.log({ schedule });
    setSelectedModule(schedule.moduleID);
    setNewSession({
      date: schedule?.date?.split("T")[0],
      startTime: schedule?.startTime,
      endTime: schedule?.endTime,
    });
    setEditID(schedule.scheduleID);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* 🔹 Banner for admins/owners */}
        {(isAdmin || isCourseOwner) && (
          <div className="mb-6 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-3 rounded">
            {isAdmin ? "Admin" : "Course Owner"} Preview Mode — view-only
            access.
          </div>
        )}

        <div className="text-center mb-12">
          <h1 class="text-3xl font-bold text-gray-800 mb-6">
            📚 Study Schedule Planner
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your study modules and sessions easily.
          </p>
        </div>

        {canSchedule && (
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-10 border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Add / Edit Session
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-gray-700 mb-1 font-medium">
                  Select Module
                </label>
                <select
                  value={selectedModule || ""}
                  onChange={(e) => setSelectedModule(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">-- Choose a module --</option>
                  {modules.map((m) => (
                    <option key={m.moduleID} value={m.moduleID}>
                      {m.title}
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
                    className="without_ampm border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400"
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
                      setNewSession({ ...newSession, endTime: e.target.value })
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-4 md:col-span-2">
                <button
                  onClick={handleAddOrEditSession}
                  className="bg-blue-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  {!!editID ? "Save Changes" : "+ Add Session"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {schedules?.map((sch) => (
            <div
              key={sch.scheduleID}
              className="bg-white shadow-md rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800">
                  {sch.moduleTitle}
                </h3>
                <span className="text-sm text-gray-500">
                  Expected: {formatDuration(sch.expectedHours)} • Scheduled:{" "}
                  <b>{sch.totalHours}</b>
                </span>
              </div>

              <ul className="divide-y divide-gray-200 text-gray-700">
                <li
                  key={sch.scheduleID}
                  className="flex justify-between py-2 text-sm md:text-base"
                >
                  <span>
                    {formatDateTime(sch.date)} — {formatTime(sch.startTime)} to{" "}
                    {formatTime(sch.endTime)}
                  </span>
                  {canSchedule && (
                    <span className="flex items-center gap-3">
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={handleEditSchedule(sch)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => handleDeleteSession(sch.scheduleID)}
                      >
                        Delete
                      </button>
                      <button
                        className="bg-green-600 text-white font-medium px-2 py-0.5 rounded-lg hover:bg-green-700 transition text-xs"
                        onClick={() => exportModuleToGoogleCalendar(sch)}
                      >
                        Export
                      </button>
                    </span>
                  )}
                </li>
              </ul>
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
