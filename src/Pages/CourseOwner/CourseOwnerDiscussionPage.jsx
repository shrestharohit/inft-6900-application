// src/Pages/CourseOwner/CourseOwnerDiscussionPage.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import useCourseApi from "../../hooks/useCourseApi";
import useDiscussionApi from "../../hooks/useDiscussionApi";

const CourseOwnerDiscussionPage = () => {
  const { loggedInUser } = useAuth();
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [threads, setThreads] = useState([]);
  const [newThread, setNewThread] = useState({ title: "", message: "" });
  const [replyText, setReplyText] = useState({});
  const [editingThreadId, setEditingThreadId] = useState(null);
  const [editingReply, setEditingReply] = useState(null); // { threadId, replyId }
  const [ownerCourses, setOwnerCourses] = useState([]);

  const { fetchAllCourses } = useCourseApi();
  const { fetchCoursePosts, createPost, updatePost, deletePost, replyToPost } =
    useDiscussionApi();

  // ✅ Normalize DB timestamps (no manual offset)
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
      // ⚠️ Do NOT append 'Z' — treat as local Sydney time
      const d = new Date(s);
      return isNaN(d) ? null : d;
    }

    const d = new Date(ts);
    return isNaN(d) ? null : d;
  };

  // ✅ Format time properly in Australia/Sydney
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

  // ✅ Fetch all courses for course owner
  useEffect(() => {
    let mounted = true;
    fetchAllCourses()
      .then((res) => {
        const filtered = res.filter((c) => c.userID === loggedInUser?.id);
        if (mounted) setOwnerCourses(filtered);
      })
      .catch((err) => {
        console.error("Failed to fetch courses", err);
        if (mounted) setOwnerCourses([]);
      });

    return () => {
      mounted = false;
    };
  }, [fetchAllCourses, loggedInUser?.id]);

  // ✅ Fetch discussions for selected course
  const fetchDiscussions = async (courseId) => {
    try {
      const res = await fetchCoursePosts(courseId || selectedCourseId);
      const posts = res?.posts || [];

      const normalizeThreads = (threads) =>
        threads
          .map((t) => ({
            ...t,
            created_at: normalizeToDate(t.created_at),
            replies: (t.replies || [])
              .map((r) => ({
                ...r,
                created_at: normalizeToDate(r.created_at),
              }))
              .sort((a, b) => b.created_at - a.created_at),
          }))
          .sort((a, b) => b.created_at - a.created_at);

      setThreads(normalizeThreads(posts));
    } catch (err) {
      console.error("Failed to fetch discussions", err);
      setThreads([]);
    }
  };

  // ✅ Create or update a thread
  const handleNewThread = async (e) => {
    e.preventDefault();
    if (!newThread.title.trim() || !newThread.message.trim()) return;

    try {
      if (editingThreadId) {
        await updatePost(editingThreadId, {
          title: newThread.title,
          postText: newThread.message,
        });
      } else {
        await createPost(selectedCourseId, {
          userID: loggedInUser?.id,
          title: newThread.title,
          postText: newThread.message,
        });
      }

      fetchDiscussions(selectedCourseId);
      setEditingThreadId(null);
      setNewThread({ title: "", message: "" });
    } catch (err) {
      console.error("Failed to save thread", err);
      alert("Failed to save thread");
    }
  };

  // ✅ Reply to a thread or update reply
  const handleReply = async (thread) => {
    const text = replyText[thread.postID];
    if (!text?.trim()) return;

    try {
      if (editingReply && editingReply.threadId === thread.postID) {
        await updatePost(editingReply.replyId, { postText: text });
      } else {
        await replyToPost(thread.postID, {
          userID: loggedInUser?.id,
          postText: text,
        });
      }

      fetchDiscussions(selectedCourseId);
      setReplyText({ ...replyText, [thread.postID]: "" });
      setEditingReply(null);
    } catch (err) {
      console.error("Failed to save reply", err);
      alert("Failed to save reply");
    }
  };

  const handleDeleteThread = async (threadId) => {
    if (!window.confirm("Delete this thread?")) return;
    try {
      await deletePost(threadId);
      fetchDiscussions(selectedCourseId);
    } catch (err) {
      console.error("Failed to delete thread", err);
      alert("Failed to delete thread");
    }
  };

  const handleEditThread = (thread) => {
    setNewThread({ title: thread.title, message: thread.postText });
    setEditingThreadId(thread.postID);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteReply = async (threadId, replyId) => {
    if (!window.confirm("Delete this reply?")) return;
    try {
      await deletePost(replyId);
      fetchDiscussions(selectedCourseId);
    } catch (err) {
      console.error("Failed to delete reply", err);
      alert("Failed to delete reply");
    }
  };

  const handleEditReply = (threadId, reply) => {
    setReplyText({ ...replyText, [threadId]: reply.postText });
    setEditingReply({ threadId, replyId: reply.postID });
  };

  const handleCourseSelect = (e) => {
    const courseId = e.target.value;
    setSelectedCourseId(courseId);
    fetchDiscussions(courseId);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        👨‍🏫 Manage Discussions
      </h1>

      {/* Course Selector */}
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
        <>
          {/* New Thread */}
          <form
            onSubmit={handleNewThread}
            className="bg-white shadow-md rounded-lg p-6 mb-8"
          >
            <h2 className="text-lg font-semibold mb-4">
              {editingThreadId ? "Edit Thread" : "Start New Discussion"}
            </h2>
            <input
              type="text"
              placeholder="Thread Title"
              value={newThread.title}
              onChange={(e) =>
                setNewThread((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full border p-3 rounded mb-3"
            />
            <textarea
              placeholder="What's on your mind?"
              rows="4"
              value={newThread.message}
              onChange={(e) =>
                setNewThread((prev) => ({ ...prev, message: e.target.value }))
              }
              className="w-full border p-3 rounded mb-3"
            />
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
              >
                {editingThreadId ? "Update" : "Post"}
              </button>
              {editingThreadId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingThreadId(null);
                    setNewThread({ title: "", message: "" });
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* Threads */}
          {threads.length === 0 ? (
            <p className="text-gray-500">No discussions yet.</p>
          ) : (
            <div className="space-y-6">
              {threads.map((thread) => (
                <div
                  key={thread.postID}
                  className="bg-white p-5 rounded-lg shadow hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{thread.title}</h3>
                      <p className="mt-2">{thread.postText}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {thread.user.firstName} {thread.user.lastName} -{" "}
                        {formatDateTime(thread.created_at)}
                      </p>
                    </div>
                    <div className="flex gap-2 text-sm">
                      <button
                        onClick={() => handleEditThread(thread)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteThread(thread.postID)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Replies */}
                  <div className="mt-4 ml-4 border-l pl-4 space-y-2">
                    {thread.replies.map((r) => (
                      <div
                        key={r.postID}
                        className="bg-gray-50 p-2 rounded flex justify-between items-start"
                      >
                        <div>
                          <p>{r.postText}</p>
                          <p className="text-xs text-gray-500">
                            {r.user.firstName} {r.user.lastName} -{" "}
                            {formatDateTime(r.created_at)}
                          </p>
                        </div>
                        <div className="flex gap-2 text-xs">
                          {/* <button
                            onClick={() => handleEditReply(thread.postID, r)}
                            className="text-blue-600 hover:underline"
                          >
                            Edit
                          </button> */}
                          {/* <button
                            onClick={() =>
                              handleDeleteReply(thread.postID, r.postID)
                            }
                            className="text-red-500 hover:underline"
                          >
                            Delete
                          </button> */}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Reply box */}
                  <div className="mt-3">
                    <textarea
                      rows="2"
                      placeholder="Reply..."
                      value={replyText[thread.postID] || ""}
                      onChange={(e) =>
                        setReplyText({
                          ...replyText,
                          [thread.postID]: e.target.value,
                        })
                      }
                      className="w-full border p-2 rounded mb-2"
                    />
                    <button
                      onClick={() => handleReply(thread)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded text-sm"
                    >
                      {editingReply?.threadId === thread.postID
                        ? "Update Reply"
                        : "Reply"}
                    </button>
                    {editingReply?.threadId === thread.postID && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingReply(null);
                          setReplyText({
                            ...replyText,
                            [thread.postID]: "",
                          });
                        }}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 rounded text-sm ml-4"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CourseOwnerDiscussionPage;
