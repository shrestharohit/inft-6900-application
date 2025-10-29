// src/Pages/StudentDiscussionPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import beforeAuthLayout from "../components/BeforeAuth";
import { useAuth } from "../contexts/AuthContext";
import { dummyCourses } from "../Pages/dummyData";
import useDiscussionApi from "../hooks/useDiscussionApi";

const StudentDiscussionPage = () => {
  const { courseId } = useParams();
  const { loggedInUser } = useAuth();

  const [threads, setThreads] = useState([]);
  const [newThread, setNewThread] = useState({ title: "", message: "" });
  const [replyText, setReplyText] = useState({});
  const [editingThreadId, setEditingThreadId] = useState(null);
  const [editingReply, setEditingReply] = useState(null); // {threadId, replyId}

  const { fetchCoursePosts, createPost, updatePost, deletePost, replyToPost } = useDiscussionApi();

  // fetch discussions for the given courseId and normalize shape to local model
  const fetchDiscussions = async (cid) => {
    try {
      const res = await fetchCoursePosts(cid || courseId);
      const posts = res?.posts || [];
      const mapped = (posts || []).map((p) => ({
        id: p.postID,
        title: p.title,
        message: p.postText,
        author: p.userID || p.author || "User",
        authorId: p.userID || p.authorId || null,
        createdAt: p.created_at || p.createdAt || null,
        replies: (p.replies || []).map((r) => ({
          id: r.postID,
          text: r.postText,
          author: r.userID || r.author || "User",
          authorId: r.userID || r.authorId || null,
          createdAt: r.created_at || r.createdAt || null,
        })),
      }));
      setThreads(mapped);
    } catch (err) {
      console.error("Failed to fetch discussions", err);
      setThreads([]);
    }
  };

  useEffect(() => {
    let mounted = true;
    if (courseId) {
      // initial load for the given course
      fetchDiscussions(courseId);
    }
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const saveToStorage = (updated) => {
    // keep API-backed state in memory only
    setThreads(updated);
  };

  // ✅ Create or update thread
  const handleNewThread = async (e) => {
    e.preventDefault();
    if (!newThread.title.trim() || !newThread.message.trim()) return;

    try {
      if (editingThreadId) {
        await updatePost(editingThreadId, {
          title: newThread.title,
          postText: newThread.message,
        });
        alert("Thread updated!");
      } else {
        await createPost(courseId, {
          userID: loggedInUser?.id,
          title: newThread.title,
          postText: newThread.message,
        });
        alert("Thread created!");
      }
      setEditingThreadId(null);
      setNewThread({ title: "", message: "" });
      await fetchDiscussions(courseId);
    } catch (err) {
      console.error("Failed to save thread", err);
      alert("Failed to save thread");
    }
  };

  // ✅ Reply or edit reply
  const handleReply = async (threadId) => {
    const text = replyText[threadId];
    if (!text?.trim()) return;

    try {
      if (editingReply && editingReply.threadId === threadId) {
        await updatePost(editingReply.replyId, {
          postText: text,
          title: threads.find((t) => t.id === threadId)?.title,
        });
      } else {
        await replyToPost(threadId, {
          userID: loggedInUser?.id,
          postText: text,
        });
      }
      await fetchDiscussions(courseId);
      setReplyText({ ...replyText, [threadId]: "" });
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
      setNewThread({ title: "", message: "" });
      setEditingThreadId(null);
      await fetchDiscussions(courseId);
    } catch (err) {
      console.error("Failed to delete thread", err);
      alert("Failed to delete thread");
    }
  };

  const handleEditThread = (thread) => {
    setNewThread({ title: thread.title, message: thread.message });
    setEditingThreadId(thread.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteReply = async (threadId, replyId) => {
    if (!window.confirm("Delete this reply?")) return;
    try {
      await deletePost(replyId);
      setReplyText({ ...replyText, [threadId]: "" });
      setEditingReply(null);
      await fetchDiscussions(courseId);
    } catch (err) {
      console.error("Failed to delete reply", err);
      alert("Failed to delete reply");
    }
  };

  const handleEditReply = (threadId, reply) => {
    setReplyText({ ...replyText, [threadId]: reply.text });
    setEditingReply({ threadId, replyId: reply.id });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">💬 Discussions</h1>

      {/* New Thread / Edit Thread */}
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
            <div key={thread.id} className="bg-white p-5 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{thread.title}</h3>
                  <p className="mt-2">{thread.message}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {thread.createdAt}
                  </p>
                </div>

                {/* Thread controls for author */}
                {thread.authorId === (loggedInUser?.email || "anonymous") && (
                  <div className="flex gap-2 text-sm">
                    <button
                      onClick={() => handleEditThread(thread)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteThread(thread.id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              {/* Replies */}
              <div className="mt-4 ml-4 border-l pl-4 space-y-2">
                {thread.replies.map((r) => (
                  <div
                    key={r.id}
                    className="bg-gray-50 p-2 rounded flex justify-between"
                  >
                    <div>
                      <p>{r.text}</p>
                      <p className="text-xs text-gray-500">
                        {r.author} – {r.createdAt}
                      </p>
                    </div>
                    {r.authorId === (loggedInUser?.email || "anonymous") && (
                      <div className="flex gap-2 text-xs">
                        <button
                          onClick={() => handleEditReply(thread.id, r)}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteReply(thread.id, r.id)}
                          className="text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Reply box */}
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
                <div className="flex gap-3">
                  <button
                    onClick={() => handleReply(thread.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded text-sm"
                  >
                    {editingReply?.threadId === thread.id
                      ? "Update Reply"
                      : "Reply"}
                  </button>
                  {editingReply?.threadId === thread.id && (
                    <button
                      onClick={() => {
                        setEditingReply(null);
                        setReplyText({ ...replyText, [thread.id]: "" });
                      }}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 rounded text-sm"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDiscussionPage;
