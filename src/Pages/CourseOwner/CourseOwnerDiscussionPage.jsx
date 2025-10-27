// src/Pages/CourseOwner/CourseOwnerDiscussionPage.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { dummyCourses } from "../../Pages/dummyData";
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

  const fetchDiscussions = (courseId) => {
    fetchCoursePosts(courseId || selectedCourseId)
      .then((res) => {
        console.log(res);
        setThreads(res.posts);
      })
      .catch((err) => {
        console.error("Failed to fetch announcements", err);
        setThreads([]);
      });
  };

  const saveToStorage = (updated) => {
    setThreads(updated);
  };

  // ✅ Add or update thread
  const handleNewThread = (e) => {
    e.preventDefault();
    if (!newThread.title.trim() || !newThread.message.trim()) return;

    if (editingThreadId) {
      updatePost(editingThreadId, {
        title: newThread.title,
        postText: newThread.message,
      });
      alert("Thread updated!");
    } else {
      createPost(selectedCourseId, {
        userID: loggedInUser?.id,
        title: newThread.title,
        postText: newThread.message,
      });
      alert("Thread created!");
    }
    fetchDiscussions();
    setEditingThreadId(null);
    setNewThread({ title: "", message: "" });
  };

  // ✅ Add or update reply
  const handleReply = async (thread) => {
    const text = replyText[thread.postID];
    if (!text?.trim()) return;

    if (editingReply && editingReply.threadId === thread.postID) {
      await updatePost(editingReply.replyId, {
        userID: loggedInUser?.id,
        title: thread.title,
        postText: text,
      });
      fetchDiscussions();
    } else {
      await replyToPost(thread.postID, {
        userID: loggedInUser?.id,
        postText: text,
      });
      fetchDiscussions();
    }

    setReplyText({ ...replyText, [thread.postID]: "" });
  };

  const handleDeleteThread = async (threadId) => {
    if (!window.confirm("Delete this thread?")) return;
    await deletePost(threadId);
    setNewThread({ title: "", message: "" });
    setEditingThreadId(null);
    fetchDiscussions();
  };

  const handleEditThread = (thread) => {
    setNewThread({ title: thread.title, message: thread.postText });
    setEditingThreadId(thread.postID);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ Delete reply
  const handleDeleteReply = async (threadId, replyId) => {
    if (!window.confirm("Delete this reply?")) return;
    await deletePost(replyId);
    setReplyText({
      ...replyText,
      [threadId]: "",
    });
    setEditingReply(null);
    fetchDiscussions();
  };

  // ✅ Edit reply
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
              {threads.map((thread, idx) => (
                <div
                  key={idx}
                  className="bg-white p-5 rounded-lg shadow hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{thread.title}</h3>
                      <p className="mt-2">{thread.postText}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {thread.created_at}
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
                            {r.created_at}
                          </p>
                        </div>
                        <div className="flex gap-2 text-xs">
                          <button
                            onClick={() => handleEditReply(thread.postID, r)}
                            className="text-blue-600 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteReply(thread.postID, r.postID)
                            }
                            className="text-red-500 hover:underline"
                          >
                            Delete
                          </button>
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
                    {editingReply ? (
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
                    ) : null}
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
