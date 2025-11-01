// src/Pages/CourseOwner/CourseOwnerQuestionsPage.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import useCourseApi from "../../hooks/useCourseApi";
import useDms from "../../hooks/useDMs";

const CourseOwnerQuestionsPage = () => {
  const { loggedInUser } = useAuth();
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [questions, setQuestions] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [ownerCourses, setOwnerCourses] = useState([]);
  const { fetchAllCourses } = useCourseApi();
  const { getAllDmsForCourse, replyDms } = useDms();

  // 🕒 Format timestamps using user's OS timezone in AM/PM format
  const formatDateTime = (isoString) => {
    if (!isoString) return "";

    // Create a Date object from the ISO string (which is in UTC)
    const dateUTC = new Date(isoString);

    // Apply the 11-hour offset (11 * 60 * 60 * 1000 ms = 11 hours)
    const dateOffset = new Date(dateUTC.getTime() + 11 * 60 * 60 * 1000); // +11 hours

    // Format the date with toLocaleString
    return dateOffset.toLocaleString([], {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // Show time in 12-hour format
    });
  };

  useEffect(() => {
    let mounted = true;
    fetchAllCourses()
      .then((res) => {
        const filteredList = res.filter((c) => c.userID === loggedInUser?.id);
        if (mounted) setOwnerCourses(filteredList);
      })
      .catch((err) => {
        console.error("Failed to fetch courses", err);
        if (mounted) setOwnerCourses([]);
      });

    return () => (mounted = false);
  }, [fetchAllCourses]);

  const fetchDms = (courseId) => {
    getAllDmsForCourse(courseId || selectedCourseId)
      .then((res) => {
        const dms = res?.dms || [];
        // ✅ Sort newest first
        const sorted = dms.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setQuestions(sorted);
      })
      .catch((err) => {
        console.error("Failed to fetch questions", err);
        setQuestions([]);
      });
  };

  const handleReplyChange = (id, text) => {
    setReplyText((prev) => ({ ...prev, [id]: text }));
  };

  const submitReply = (dm) => {
    const payload = {
      ...dm,
      reply: replyText[dm.msgID] || "",
      status: "active",
    };
    replyDms(dm.msgID, payload)
      .then(() => {
        fetchDms();
        setReplyText((prev) => ({ ...prev, [dm.msgID]: "" }));
      })
      .catch((err) => {
        console.error("Failed to send reply", err);
      });
  };

  const handleCourseSelect = (e) => {
    const courseId = e.target.value;
    setSelectedCourseId(courseId);
    fetchDms(courseId);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Student Questions
      </h1>

      {/* Select Course */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">
          Select Course
        </label>
        <select
          value={selectedCourseId}
          onChange={handleCourseSelect}
          className="w-full border p-3 rounded"
        >
          <option value="">-- Choose one of your courses --</option>
          {ownerCourses.map((c) => (
            <option key={c.courseID} value={c.courseID}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      {selectedCourseId && (
        <div>
          {questions.length === 0 ? (
            <p className="text-gray-500">
              No questions have been asked for this course yet.
            </p>
          ) : (
            <ul className="space-y-6">
              {questions.map((q) => (
                <li
                  key={q.msgID}
                  className="bg-white p-5 rounded-lg shadow border-l-4 border-blue-500"
                >
                  <p className="font-semibold text-gray-800">{q.message}</p>
                  <p className="text-xs text-gray-500 mb-3">
                    Asked on {formatDateTime(q.created_at)}
                  </p>

                  {q.reply ? (
                    <p className="mt-2 text-green-700">
                      <span className="font-semibold">Reply:</span> {q.reply}
                    </p>
                  ) : (
                    <div className="mt-3">
                      <textarea
                        value={replyText[q.msgID] || ""}
                        onChange={(e) =>
                          handleReplyChange(q.msgID, e.target.value)
                        }
                        placeholder="Type your reply here..."
                        className="w-full p-3 border rounded mb-2 focus:ring-2 focus:ring-green-500"
                        rows="3"
                      />
                      <button
                        onClick={() => submitReply(q)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-semibold"
                      >
                        Send Reply
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseOwnerQuestionsPage;
