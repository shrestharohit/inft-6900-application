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

  // Normalize timestamp from DB safely
  const normalizeToDate = (ts) => {
    if (!ts) return null;
    if (ts instanceof Date) return ts;

    if (typeof ts === "number") {
      const ms = ts > 1e12 ? ts : ts * 1000;
      return new Date(ms);
    }

    if (typeof ts === "string") {
      let s = ts.trim();
      if (s.includes(" ") && !s.includes("T")) s = s.replace(" ", "T");
      const d = new Date(s);
      return isNaN(d) ? null : d;
    }

    const d = new Date(ts);
    return isNaN(d) ? null : d;
  };

  //Format date-time in Sydney timezone
  const formatDateTime = (ts) => {
    const date = normalizeToDate(ts);
    if (!date) return "";
    return new Intl.DateTimeFormat("en-AU", {
      timeZone: "Australia/Sydney",
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  // Fetch owner's courses
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
  }, [fetchAllCourses, loggedInUser?.id]);

  // Fetch all questions for a course
  const fetchDms = async (courseId) => {
    try {
      const res = await getAllDmsForCourse(courseId || selectedCourseId);
      const dms = res?.dms || [];

      const normalized = dms
        .map((d) => ({
          ...d,
          created_at: normalizeToDate(d.created_at),
        }))
        .sort((a, b) => b.created_at - a.created_at);

      setQuestions(normalized);
    } catch (err) {
      console.error("Failed to fetch questions", err);
      setQuestions([]);
    }
  };

  const handleReplyChange = (id, text) => {
    setReplyText((prev) => ({ ...prev, [id]: text }));
  };

  const submitReply = async (dm) => {
    const payload = {
      ...dm,
      reply: replyText[dm.msgID] || "",
      status: "active",
    };
    try {
      await replyDms(dm.msgID, payload);

      // Update reply instantly instead of refetching all
      setQuestions((prev) =>
        prev.map((q) =>
          q.msgID === dm.msgID ? { ...q, reply: payload.reply } : q
        )
      );

      setReplyText((prev) => ({ ...prev, [dm.msgID]: "" }));
    } catch (err) {
      console.error("Failed to send reply", err);
    }
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
          {ownerCourses.length > 0 ? (
            ownerCourses.map((c) => (
              <option key={c.courseID} value={c.courseID}>
                {c.title}
              </option>
            ))
          ) : (
            <option disabled>No courses found for you</option>
          )}
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
