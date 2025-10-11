import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import beforeAuthLayout from "../components/BeforeAuth";
import useDms from "../hooks/useDMs";
import { useAuth } from "../contexts/AuthContext";

const MAX_CHARS = 300;

const CourseQuestionsPage = () => {
  const { courseId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [filter, setFilter] = useState("all"); // all | answered | unanswered
  const [editingId, setEditingId] = useState(null);

  const { getAllDmsForUser, createDms } = useDms();
  const { loggedInUser } = useAuth();

  const fetchDms = () => {
    getAllDmsForUser(loggedInUser?.id)
      .then((res) => {
        console.log(res);
        setQuestions(res.dms)
      })
      .catch((err) => {
        console.error("Failed to fetch announcements", err);
      });
  };

  useEffect(() => {
    let mounted = true;
    fetchDms();
    return () => (mounted = false);
  }, [getAllDmsForUser, loggedInUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    if (newQuestion.length > MAX_CHARS) {
      alert(`Question must be under ${MAX_CHARS} characters.`);
      return;
    }

    if (editingId) {
      // Update existing question
      const updated = questions.map((q) =>
        q.id === editingId ? { ...q, text: newQuestion } : q
      );
      saveToStorage(updated);
      setEditingId(null);
    } else {
      const question = {
        userID: loggedInUser?.id,
        courseID: courseId,
        message: newQuestion,
      };
      createDms(question);
    }
    setNewQuestion("");
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this question?")) {
      const updated = questions.filter((q) => q.id !== id);
      saveToStorage(updated);
    }
  };

  const handleEdit = (q) => {
    setNewQuestion(q.text);
    setEditingId(q.id);
  };

  const cancelEdit = () => {
    setNewQuestion("");
    setEditingId(null);
  };

  const filteredQuestions =
    filter === "all"
      ? questions
      : filter === "answered"
      ? questions.filter((q) => q.reply)
      : questions.filter((q) => !q.reply);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Questions for Course Owner
      </h1>

      {/* Form */}
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
            {newQuestion.length} / {MAX_CHARS} characters
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

      {/* Filter */}
      <div className="mb-6 flex gap-3 text-sm">
        <button
          className={`px-3 py-1 rounded ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`px-3 py-1 rounded ${
            filter === "answered"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={() => setFilter("answered")}
        >
          Answered
        </button>
        <button
          className={`px-3 py-1 rounded ${
            filter === "unanswered"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={() => setFilter("unanswered")}
        >
          Unanswered
        </button>
      </div>

      {/* List */}
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
                <p className="text-xs text-gray-400">{q.created_at}</p>
                {q.reply ? (
                  <p className="mt-2 text-green-700">
                    <span className="font-semibold">Reply:</span> {q.reply}
                  </p>
                ) : (
                  <p className="mt-2 text-yellow-600">⏳ Awaiting reply</p>
                )}

                {/* Controls */}
                <div className="absolute top-3 right-3 flex gap-3 text-xs">
                  {/* <button
                    onClick={() => handleEdit(q)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button> */}
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseQuestionsPage;
