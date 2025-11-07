import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import beforeAuthLayout from "../components/BeforeAuth";
import { useAuth } from "../contexts/AuthContext";
import useDiscussionApi from "../hooks/useDiscussionApi";
import useRoleAccess from "../hooks/useRoleAccess";

const StudentDiscussionPage = () => {
  const { courseId } = useParams();
  const { loggedInUser } = useAuth();
  const { canViewCourses, canPostDiscussion, isAdmin, isCourseOwner } =
    useRoleAccess();

  const [threads, setThreads] = useState([]);
  const [newThread, setNewThread] = useState({ title: "", message: "" });
  const [replyText, setReplyText] = useState({});
  const [editThread, setEditThread] = useState(null);
  const [editReply, setEditReply] = useState({});

  const { fetchCoursePosts, createPost, replyToPost } = useDiscussionApi();

  // Normalize timestamp to Date object
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

  // Format date in Sydney timezone
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

  if (!canViewCourses) {
    return (
      <div className="p-6 text-center text-red-500 font-semibold">
        You do not have permission to view this page.
      </div>
    );
  }

  // Fetch all threads for the course
  const fetchDiscussions = async (cid) => {
    try {
      const res = await fetchCoursePosts(cid || courseId);
      const posts = res?.posts || [];

      const mapped = posts.map((p) => ({
        id: p.postID,
        title: p.title,
        message: p.postText,
        author: p.userID || "User",
        authorId: p.userID || null,
        createdAt: normalizeToDate(p.created_at || p.createdAt),
        replies: (p.replies || [])
          .map((r) => ({
            id: r.postID,
            text: r.postText,
            author: r.userID || "User",
            authorId: r.userID || null,
            createdAt: normalizeToDate(r.created_at || r.createdAt),
          }))
          .sort((a, b) => a.createdAt - b.createdAt),
      }));

      const sortedThreads = mapped.sort((a, b) => b.createdAt - a.createdAt);
      setThreads(sortedThreads);
    } catch (err) {
      console.error("Failed to fetch discussions", err);
      setThreads([]);
    }
  };

  useEffect(() => {
    if (courseId) fetchDiscussions(courseId);
  }, [courseId]);

  // Create a new discussion thread
  const handleNewThread = async (e) => {
    e.preventDefault();
    if (!newThread.title.trim() || !newThread.message.trim()) return;

    try {
      const res = await createPost(courseId, {
        userID: loggedInUser?.id,
        title: newThread.title,
        postText: newThread.message,
      });

      const realId = res?.postID || res?.data?.postID;

      const newThreadData = {
        id: realId || Math.random().toString(36),
        title: newThread.title,
        message: newThread.message,
        author: loggedInUser?.id || "User",
        authorId: loggedInUser?.id,
        createdAt: new Date(),
        replies: [],
      };

      setThreads((prev) => [newThreadData, ...prev]);
      setNewThread({ title: "", message: "" });
    } catch (err) {
      console.error("Failed to save thread", err);
      alert("Failed to save thread");
    }
  };

  // Edit thread message
  const handleEditThread = (thread) => {
    setEditThread(thread);
  };

  const handleUpdateThread = () => {
    if (!editThread.message.trim()) return;
    setThreads((prev) =>
      prev.map((t) =>
        t.id === editThread.id ? { ...t, message: editThread.message } : t
      )
    );
    setEditThread(null);
  };

  const handleDeleteThread = (threadId) => {
    if (window.confirm("Are you sure you want to delete this discussion?")) {
      setThreads((prev) => prev.filter((t) => t.id !== threadId));
    }
  };

  // Reply to a thread
  const handleReply = async (threadId) => {
    const text = replyText[threadId];
    if (!text?.trim()) return;

    try {
      const res = await replyToPost(threadId, {
        userID: loggedInUser?.id,
        postText: text,
      });

      const newReply = {
        id: res?.data?.postID || Math.random().toString(36),
        text,
        author: loggedInUser?.id || "User",
        authorId: loggedInUser?.id,
        createdAt: new Date(),
      };

      setThreads((prev) =>
        prev.map((t) =>
          t.id === threadId ? { ...t, replies: [...t.replies, newReply] } : t
        )
      );

      setReplyText({ ...replyText, [threadId]: "" });
    } catch (err) {
      console.error("Failed to save reply", err);
      alert("Failed to save reply");
    }
  };

  const handleEditReply = (threadId, reply) => {
    setEditReply({ threadId, ...reply });
  };

  const handleUpdateReply = () => {
    if (!editReply.text.trim()) return;
    setThreads((prev) =>
      prev.map((t) =>
        t.id === editReply.threadId
          ? {
              ...t,
              replies: t.replies.map((r) =>
                r.id === editReply.id ? { ...r, text: editReply.text } : r
              ),
            }
          : t
      )
    );
    setEditReply({});
  };

  const handleDeleteReply = (threadId, replyId) => {
    if (window.confirm("Are you sure you want to delete this reply?")) {
      setThreads((prev) =>
        prev.map((t) =>
          t.id === threadId
            ? { ...t, replies: t.replies.filter((r) => r.id !== replyId) }
            : t
        )
      );
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {(isAdmin || isCourseOwner) && (
        <div className="mb-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-3 rounded">
          {isAdmin ? "Admin" : "Course Owner"} Preview Mode — view-only access.
        </div>
      )}

      <h1 className="text-3xl font-bold text-gray-800 mb-6">💬 Discussions</h1>

      {canPostDiscussion ? (
        <form
          onSubmit={handleNewThread}
          className="bg-white shadow-md rounded-lg p-6 mb-8"
        >
          <h2 className="text-lg font-semibold mb-4">Start New Discussion</h2>
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
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            Post
          </button>
        </form>
      ) : (
        <div className="bg-gray-100 text-gray-700 p-4 rounded-lg shadow-sm mb-6">
          You can view existing discussions but cannot post new threads or replies.
        </div>
      )}

      {threads.length === 0 ? (
        <p className="text-gray-500">No discussions yet.</p>
      ) : (
        <div className="space-y-6">
          {threads.map((thread) => (
            <div key={thread.id} className="bg-white p-5 rounded-lg shadow">
              {editThread?.id === thread.id ? (
                <>
                  <textarea
                    rows="3"
                    value={editThread.message}
                    onChange={(e) =>
                      setEditThread((prev) => ({
                        ...prev,
                        message: e.target.value,
                      }))
                    }
                    className="w-full border p-2 rounded mb-2"
                  />
                  <button
                    onClick={handleUpdateThread}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm mr-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditThread(null)}
                    className="bg-gray-400 text-white px-3 py-1 rounded text-sm"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <h3 className="font-bold text-lg">{thread.title}</h3>
                  <p className="mt-2">{thread.message}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {thread.author} – {formatDateTime(thread.createdAt)}
                  </p>

                  {thread.authorId === loggedInUser?.id && (
                    <div className="flex gap-3 text-sm mt-2">
                      <button
                        onClick={() => handleEditThread(thread)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteThread(thread.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* Replies */}
              <div className="mt-4 ml-4 border-l pl-4 space-y-2">
                {thread.replies.map((r) => (
                  <div key={r.id} className="bg-gray-50 p-2 rounded">
                    {editReply?.id === r.id ? (
                      <>
                        <textarea
                          rows="2"
                          value={editReply.text}
                          onChange={(e) =>
                            setEditReply((prev) => ({
                              ...prev,
                              text: e.target.value,
                            }))
                          }
                          className="w-full border p-2 rounded mb-2"
                        />
                        <button
                          onClick={handleUpdateReply}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm mr-2"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditReply({})}
                          className="bg-gray-400 text-white px-3 py-1 rounded text-sm"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <p>{r.text}</p>
                        <p className="text-xs text-gray-500">
                          {r.author} – {formatDateTime(r.createdAt)}
                        </p>

                        {r.authorId === loggedInUser?.id && (
                          <div className="flex gap-3 text-xs mt-1">
                            <button
                              onClick={() => handleEditReply(thread.id, r)}
                              className="text-blue-600 hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteReply(thread.id, r.id)
                              }
                              className="text-red-600 hover:underline"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* Reply box */}
              {canPostDiscussion && (
                <div className="mt-3">
                  <textarea
                    rows="2"
                    placeholder="Reply..."
                    value={replyText[thread.id] || ""}
                    onChange={(e) =>
                      setReplyText({ ...replyText, [thread.id]: e.target.value })
                    }
                    className="w-full border p-2 rounded mb-2"
                  />
                  <button
                    onClick={() => handleReply(thread.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded text-sm"
                  >
                    Reply
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDiscussionPage;
