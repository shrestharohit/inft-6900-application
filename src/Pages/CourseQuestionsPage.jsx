import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import beforeAuthLayout from "../components/BeforeAuth";
import useDms from "../hooks/useDMs";
import { useAuth } from "../contexts/AuthContext";
import useRoleAccess from "../hooks/useRoleAccess";

const MAX_CHARS = 300;

const CourseQuestionsPage = () => {
  const { courseId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);

  const { getAllDmsForUser, createDms } = useDms();
  const { loggedInUser } = useAuth();
  const { canViewCourses, canSubmitQuestions, isAdmin, isCourseOwner } =
    useRoleAccess();

  // ✅ Parse timestamps safely (backend sends UTC with Z)
  const normalizeToDate = (ts) => {
    if (!ts) return null;
    if (ts instanceof Date) return ts;

    if (typeof ts === "number") {
      const ms = ts > 1e12 ? ts : ts * 1000;
      return new Date(ms);
    }

    if (typeof ts === "string") {
      let s = ts.trim();
      if (!/[zZ]$|[+\-]\d{2}:\d{2}$/.test(s)) s += "Z";
      const d = new Date(s);
      return isNaN(d) ? null : d;
    }

    const d = new Date(ts);
    return isNaN(d) ? null : d;
  };

  // ✅ Format as UTC+10 (manual offset, always correct for your case)
  const formatDateTime = (ts) => {
    if (!ts) return "";
    const dateUTC = new Date(ts);
    const dateOffset = new Date(dateUTC.getTime() + 11 * 60 * 60 * 1000); // +10 hours
    return (
      dateOffset.toLocaleString([], {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }) 
    );
  };

  // ✅ Fetch & sort by newest first
  const fetchDms = () => {
    getAllDmsForUser(loggedInUser?.id)
      .then((res) => {
        const sorted = [...res.dms].sort(
          (a, b) => normalizeToDate(b.created_at) - normalizeToDate(a.created_at)
        );
        setQuestions(sorted);
      })
      .catch((err) => {
        console.error("Failed to fetch questions", err);
        setQuestions([]);
      });
  };

  useEffect(() => {
    if (loggedInUser?.id) fetchDms();
  }, [getAllDmsForUser, loggedInUser?.id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    if ((newQuestion || "").length > MAX_CHARS) {
      alert(`Question must be under ${MAX_CHARS} characters.`);
      return;
    }

    if (editingId) {
      const updated = questions.map((q) =>
        q.msgID === editingId ? { ...q, message: newQuestion } : q
      );
      setQuestions(updated);
      setEditingId(null);
    } else {
      const question = {
        userID: loggedInUser?.id,
        courseID: courseId,
        message: newQuestion,
      };
      createDms(question)
        .then(() => fetchDms())
        .catch((err) => console.error("Failed to create question", err));
    }
    setNewQuestion("");
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this question?")) return;
    setQuestions(questions.filter((q) => q.msgID !== id));
  };

  const handleEdit = (q) => {
    setNewQuestion(q.message || ""); // ✅ prevent undefined
    setEditingId(q.msgID); // ✅ use msgID
  };

  const cancelEdit = () => {
    setNewQuestion("");
    setEditingId(null);
  };

  // ✅ Filtering logic
  const filteredQuestions =
    filter === "all"
      ? questions
      : filter === "answered"
        ? questions.filter((q) => q.reply)
        : questions.filter((q) => !q.reply);

  // ✅ Move permission check AFTER hooks
  if (!canViewCourses) {
    return (
      <div className="p-6 text-center text-red-500 font-semibold">
        You do not have permission to view this page.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {(isAdmin || isCourseOwner) && (
        <div className="mb-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-3 rounded">
          {isAdmin ? "Admin" : "Course Owner"} Preview Mode — view-only access.
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Questions for Course Owner
      </h1>

      {/* ✅ Ask/edit form */}
      {canSubmitQuestions ? (
        <form
          onSubmit={handleSubmit}
          className="mb-10 bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto"
        >
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {editingId ? "Edit Your Question" : "Ask a Question"}
          </label>
          <textarea
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Type your question here..."
            className="w-full p-4 border border-gray-300 rounded-md mb-2 focus:ring-2 focus:ring-blue-500 resize-none"
            rows="5"
          />
          <div className="flex justify-between items-center mb-3 text-sm text-gray-500">
            <span>
              {(newQuestion || "").length} / {MAX_CHARS} characters
            </span>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="text-red-500 hover:underline"
              >
                Cancel Edit
              </button>
            )}
          </div>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-semibold shadow"
          >
            {editingId ? "Update Question" : "Submit Question"}
          </button>
        </form>
      ) : (
        <div className="bg-gray-100 text-gray-700 p-4 rounded-lg shadow-sm mb-6">
          You can view existing questions but cannot submit new ones.
        </div>
      )}

      {/* ✅ Filter buttons */}
      <div className="mb-6 flex gap-3 text-sm">
        {["all", "answered", "unanswered"].map((type) => (
          <button
            key={type}
            className={`px-3 py-1 rounded ${filter === type
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
              }`}
            onClick={() => setFilter(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* ✅ Questions list */}
      <div>
        {filteredQuestions.length === 0 ? (
          <p className="text-gray-500">No questions found.</p>
        ) : (
          <div className="space-y-4">
            {filteredQuestions.map((q) => (
              <div
                key={q.msgID}
                className="border p-5 rounded-lg bg-gray-50 shadow-sm relative"
              >
                <p className="font-semibold text-gray-800">{q.message}</p>
                <p className="text-xs text-gray-400">
                  {formatDateTime(q.created_at)}
                </p>

                {q.reply ? (
                  <p className="mt-2 text-green-700">
                    <span className="font-semibold">Reply:</span> {q.reply}
                  </p>
                ) : (
                  <p className="mt-2 text-yellow-600">⏳ Awaiting reply</p>
                )}

                {canSubmitQuestions && q.userID === loggedInUser?.id && (
                  <div className="absolute top-3 right-3 flex gap-3 text-xs">
                    <button
                      onClick={() => handleEdit(q)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(q.msgID)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default (CourseQuestionsPage);
