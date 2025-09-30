// src/Pages/CourseOwner/CourseOwnerDiscussionPage.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { dummyCourses } from "../../Pages/dummyData";

const CourseOwnerDiscussionPage = () => {
    const { loggedInUser } = useAuth();
    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [threads, setThreads] = useState([]);
    const [newThread, setNewThread] = useState({ title: "", message: "" });
    const [replyText, setReplyText] = useState({});
    const [editingThreadId, setEditingThreadId] = useState(null);
    const [editingReply, setEditingReply] = useState(null); // { threadId, replyId }

    // ✅ Only courses owned by this course owner
    const ownerCourses = dummyCourses.filter(
        (c) => c.ownerEmail === loggedInUser?.email
    );

    useEffect(() => {
        if (!selectedCourseId) return;
        const saved =
            JSON.parse(localStorage.getItem(`discussions_${selectedCourseId}`)) || [];
        setThreads(saved);
    }, [selectedCourseId]);

    const saveToStorage = (updated) => {
        setThreads(updated);
        localStorage.setItem(
            `discussions_${selectedCourseId}`,
            JSON.stringify(updated)
        );
    };

    // ✅ Add or update thread
    const handleNewThread = (e) => {
        e.preventDefault();
        if (!newThread.title.trim() || !newThread.message.trim()) return;

        if (editingThreadId) {
            const updated = threads.map((t) =>
                t.id === editingThreadId
                    ? { ...t, title: newThread.title, message: newThread.message }
                    : t
            );
            saveToStorage(updated);
            setEditingThreadId(null);
        } else {
            const thread = {
                id: Date.now(),
                title: newThread.title,
                message: newThread.message,
                author: `${loggedInUser?.firstName || "Course Owner"} (Course Owner)`,
                authorId: loggedInUser?.email,
                createdAt: new Date().toLocaleString(),
                replies: [],
            };
            saveToStorage([thread, ...threads]);
        }

        setNewThread({ title: "", message: "" });
    };

    // ✅ Add or update reply
    const handleReply = (threadId) => {
        const text = replyText[threadId];
        if (!text?.trim()) return;

        if (editingReply && editingReply.threadId === threadId) {
            const updated = threads.map((t) =>
                t.id === threadId
                    ? {
                        ...t,
                        replies: t.replies.map((r) =>
                            r.id === editingReply.replyId ? { ...r, text } : r
                        ),
                    }
                    : t
            );
            saveToStorage(updated);
            setEditingReply(null);
        } else {
            const updated = threads.map((t) =>
                t.id === threadId
                    ? {
                        ...t,
                        replies: [
                            ...t.replies,
                            {
                                id: Date.now(),
                                text,
                                author: `${loggedInUser?.firstName || "Course Owner"} (Course Owner)`,
                                authorId: loggedInUser?.email,
                                createdAt: new Date().toLocaleString(),
                            },
                        ],
                    }
                    : t
            );
            saveToStorage(updated);
        }

        setReplyText({ ...replyText, [threadId]: "" });
    };

    // ✅ Delete thread
    const handleDeleteThread = (threadId) => {
        if (!window.confirm("Delete this thread?")) return;
        const updated = threads.filter((t) => t.id !== threadId);
        saveToStorage(updated);
    };

    // ✅ Edit thread
    const handleEditThread = (thread) => {
        setNewThread({ title: thread.title, message: thread.message });
        setEditingThreadId(thread.id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // ✅ Delete reply
    const handleDeleteReply = (threadId, replyId) => {
        if (!window.confirm("Delete this reply?")) return;
        const updated = threads.map((t) =>
            t.id === threadId
                ? { ...t, replies: t.replies.filter((r) => r.id !== replyId) }
                : t
        );
        saveToStorage(updated);
    };

    // ✅ Edit reply
    const handleEditReply = (threadId, reply) => {
        setReplyText({ ...replyText, [threadId]: reply.text });
        setEditingReply({ threadId, replyId: reply.id });
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                👨‍🏫 Manage Discussions
            </h1>

            {/* Course Selector */}
            <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Select Course</label>
                <select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="w-full border p-3 rounded"
                >
                    <option value="">-- Choose one of your courses --</option>
                    {ownerCourses.length > 0 ? (
                        ownerCourses.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
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
                                    key={thread.id}
                                    className="bg-white p-5 rounded-lg shadow hover:shadow-md transition"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-lg">{thread.title}</h3>
                                            <p className="mt-2">{thread.message}</p>
                                            <p className="text-xs text-gray-500 mt-2">
                                                {thread.author} – {thread.createdAt}
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
                                                onClick={() => handleDeleteThread(thread.id)}
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
                                                key={r.id}
                                                className="bg-gray-50 p-2 rounded flex justify-between items-start"
                                            >
                                                <div>
                                                    <p>{r.text}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {r.author} – {r.createdAt}
                                                    </p>
                                                </div>
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
                                                setReplyText({
                                                    ...replyText,
                                                    [thread.id]: e.target.value,
                                                })
                                            }
                                            className="w-full border p-2 rounded mb-2"
                                        />
                                        <button
                                            onClick={() => handleReply(thread.id)}
                                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded text-sm"
                                        >
                                            {editingReply?.threadId === thread.id
                                                ? "Update Reply"
                                                : "Reply"}
                                        </button>
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
