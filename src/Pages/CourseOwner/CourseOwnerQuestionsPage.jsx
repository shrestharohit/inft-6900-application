// src/Pages/CourseOwner/CourseOwnerQuestionsPage.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { dummyCourses } from "../dummyData";
import useCourseApi from "../../hooks/useCourseApi";

const CourseOwnerQuestionsPage = () => {
  const { loggedInUser } = useAuth();
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [questions, setQuestions] = useState([]);
  const [replyText, setReplyText] = useState({}); // map: q.id -> reply
  const [ownerCourses, setOwnerCourses] = useState([]);
  const { fetchAllCourses } = useCourseApi();

  useEffect(() => {
    let mounted = true;
    fetchAllCourses()
      .then((res) => {
        const filteredList = res.filter((c) => c.userID === loggedInUser?.id);
        if (mounted) setOwnerCourses(filteredList);
      })
      .catch((err) => {
        console.error("Failed to fetch courses", err);
        if (mounted) setCourses([]);
      });

    return () => (mounted = false);
  }, [fetchAllCourses]);

  // Load questions when course changes
  useEffect(() => {
    if (!selectedCourseId) return;
    const saved =
      JSON.parse(localStorage.getItem(`questions_${selectedCourseId}`)) || [];
    setQuestions(saved);
  }, [selectedCourseId]);

  const saveToStorage = (updated) => {
    setQuestions(updated);
    localStorage.setItem(
      `questions_${selectedCourseId}`,
      JSON.stringify(updated)
    );
  };

  const handleReplyChange = (id, text) => {
    setReplyText((prev) => ({ ...prev, [id]: text }));
  };

  const submitReply = (id) => {
    const updated = questions.map((q) =>
      q.id === id ? { ...q, reply: replyText[id] || "" } : q
    );
    saveToStorage(updated);
    setReplyText((prev) => ({ ...prev, [id]: "" }));
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
          onChange={(e) => setSelectedCourseId(e.target.value)}
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
                  key={q.id}
                  className="bg-white p-5 rounded-lg shadow border-l-4 border-blue-500"
                >
                  <p className="font-semibold text-gray-800">{q.text}</p>
                  <p className="text-xs text-gray-400 mb-3">{q.createdAt}</p>

                  {q.reply ? (
                    <p className="mt-2 text-green-700">
                      <span className="font-semibold">Reply:</span> {q.reply}
                    </p>
                  ) : (
                    <div className="mt-3">
                      <textarea
                        value={replyText[q.id] || ""}
                        onChange={(e) =>
                          handleReplyChange(q.id, e.target.value)
                        }
                        placeholder="Type your reply here..."
                        className="w-full p-3 border rounded mb-2 focus:ring-2 focus:ring-green-500"
                        rows="3"
                      />
                      <button
                        onClick={() => submitReply(q.id)}
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
