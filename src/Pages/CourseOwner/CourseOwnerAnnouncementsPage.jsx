import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { dummyCourses } from "../dummyData";

const CourseOwnerAnnouncementsPage = () => {
    const { loggedInUser } = useAuth();
    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [drafts, setDrafts] = useState([]); // multiple drafts
    const [published, setPublished] = useState([]);
    const [form, setForm] = useState({ title: "", message: "" });
    const [editingDraftId, setEditingDraftId] = useState(null);

    // ✅ Only courses created by this owner
    const ownerCourses = dummyCourses.filter(
        (c) => c.ownerEmail === loggedInUser?.email
    );

    useEffect(() => {
        if (!selectedCourseId) return;
        const savedDrafts =
            JSON.parse(localStorage.getItem(`drafts_${selectedCourseId}`)) || [];
        const savedPublished =
            JSON.parse(localStorage.getItem(`published_${selectedCourseId}`)) || [];
        setDrafts(savedDrafts);
        setPublished(savedPublished);
    }, [selectedCourseId]);

    const saveDraftsToStorage = (updated) => {
        setDrafts(updated);
        localStorage.setItem(`drafts_${selectedCourseId}`, JSON.stringify(updated));
    };

    const saveDraft = () => {
        if (!selectedCourseId) {
            alert("Please select a course first.");
            return;
        }
        if (!form.title || !form.message) {
            alert("Fill title and message before saving.");
            return;
        }

        if (editingDraftId) {
            // ✅ update existing draft
            const updated = drafts.map((d) =>
                d.id === editingDraftId
                    ? { ...d, title: form.title, message: form.message }
                    : d
            );
            saveDraftsToStorage(updated);
            setEditingDraftId(null);
            alert("Draft updated!");
        } else {
            // ✅ new draft
            const newDraft = {
                id: Date.now(),
                title: form.title,
                message: form.message,
                createdAt: new Date().toLocaleString(),
            };
            const updated = [newDraft, ...drafts];
            saveDraftsToStorage(updated);
            alert("Draft saved!");
        }

        setForm({ title: "", message: "" });
    };

    const editDraft = (draft) => {
        setForm({ title: draft.title, message: draft.message });
        setEditingDraftId(draft.id);
    };

    const deleteDraft = (draftId) => {
        if (!window.confirm("Delete this draft?")) return;
        const updated = drafts.filter((d) => d.id !== draftId);
        saveDraftsToStorage(updated);
    };

    const publishDraft = (draftId) => {
        const draftToPublish = drafts.find((d) => d.id === draftId);
        if (!draftToPublish) return;

        const updatedPublished = [
            {
                ...draftToPublish,
                publishedAt: new Date().toLocaleString(),
            },
            ...published,
        ];
        setPublished(updatedPublished);
        localStorage.setItem(
            `published_${selectedCourseId}`,
            JSON.stringify(updatedPublished)
        );

        // remove from drafts
        deleteDraft(draftId);
        alert("Announcement published!");
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Course Announcements</h1>

            {/* Select Course */}
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
                    {/* Draft Form */}
                    <div className="bg-white shadow rounded-lg p-6 mb-8">
                        <h2 className="text-xl font-semibold mb-4">
                            {editingDraftId ? "Edit Draft" : "Create New Draft"}
                        </h2>
                        <input
                            type="text"
                            placeholder="Announcement Title"
                            value={form.title}
                            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                            className="w-full border p-3 rounded mb-3"
                        />
                        <textarea
                            rows="5"
                            placeholder="Announcement Message"
                            value={form.message}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, message: e.target.value }))
                            }
                            className="w-full border p-3 rounded mb-3"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={saveDraft}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                            >
                                {editingDraftId ? "Update Draft" : "Save as Draft"}
                            </button>
                            {editingDraftId && (
                                <button
                                    onClick={() => {
                                        setEditingDraftId(null);
                                        setForm({ title: "", message: "" });
                                    }}
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Drafts List */}
                    <div className="bg-gray-50 shadow rounded-lg p-6 mb-8">
                        <h2 className="text-xl font-semibold mb-4">Draft Announcements</h2>
                        {drafts.length === 0 ? (
                            <p className="text-gray-500">No drafts yet.</p>
                        ) : (
                            <ul className="space-y-4">
                                {drafts.map((d) => (
                                    <li
                                        key={d.id}
                                        className="border p-4 bg-white rounded shadow-sm"
                                    >
                                        <h3 className="font-bold text-lg">{d.title}</h3>
                                        <p className="text-gray-700 mt-1">{d.message}</p>
                                        <p className="text-xs text-gray-400 mt-2">
                                            Draft created: {d.createdAt}
                                        </p>
                                        <div className="flex gap-2 mt-3">
                                            <button
                                                onClick={() => publishDraft(d.id)}
                                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                                            >
                                                Publish
                                            </button>
                                            <button
                                                onClick={() => editDraft(d)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => deleteDraft(d.id)}
                                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Published List */}
                    <div className="bg-gray-50 shadow rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Published Announcements</h2>
                        {published.length === 0 ? (
                            <p className="text-gray-500">No announcements yet.</p>
                        ) : (
                            <ul className="space-y-4">
                                {published.map((a) => (
                                    <li
                                        key={a.id}
                                        className="border p-4 bg-white rounded shadow-sm"
                                    >
                                        <h3 className="font-bold text-lg">{a.title}</h3>
                                        <p className="text-gray-700 mt-1">{a.message}</p>
                                        <p className="text-xs text-gray-400 mt-2">
                                            Published at: {a.publishedAt}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default CourseOwnerAnnouncementsPage;
