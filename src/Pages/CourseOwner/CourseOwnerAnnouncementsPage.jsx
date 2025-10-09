import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { dummyCourses } from "../dummyData";
import useCourseApi from "../../hooks/useCourseApi";
import useAnnouncement from "../../hooks/useAnnouncement";

const CourseOwnerAnnouncementsPage = () => {
  const { loggedInUser } = useAuth();
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [drafts, setDrafts] = useState([]); // multiple drafts
  const [published, setPublished] = useState([]);
  const [form, setForm] = useState({ title: "", content: "" });
  const [editingDraftId, setEditingDraftId] = useState(null);
  const [ownerCourses, setOwnerCourses] = useState([]);

  const { fetchAllCourses } = useCourseApi();
  const {
    createAnnouncement,
    updateAnnouncement,
    getAllAnnouncementsForCourse,
    deleteAnnouncementById,
  } = useAnnouncement();

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

  const fetchAnnouncements = (courseId) => {
    getAllAnnouncementsForCourse(courseId || selectedCourseId)
      .then((res) => {
        console.log(res);
        const draftList =
          res.announcements?.filter((a) => a.status === "draft") || [];
        const publishedList =
          res.announcements
            ?.filter((a) => a.status === "active")
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) ||
          [];
        setDrafts(draftList);
        setPublished(publishedList);
      })
      .catch((err) => {
        console.error("Failed to fetch announcements", err);
        setDrafts([]);
        setPublished([]);
      });
  };

  const saveDraft = () => {
    if (!form.title || !form.content) {
      alert("Fill title and message before saving.");
      return;
    }
    const draft = {
      ...form,
      status: "draft",
    };
    if (editingDraftId) {
      updateAnnouncement(editingDraftId, draft);
      alert("Draft updated!");
    } else {
      createAnnouncement(selectedCourseId, draft);
      alert("Draft saved!");
    }
    fetchAnnouncements();
    setEditingDraftId(null);
    setForm({ title: "", content: "" });
  };

  const editDraft = (draft) => {
    setForm({ title: draft.title, content: draft.content });
    setEditingDraftId(draft.announcementID);
  };

  const deleteDraft = async (draftId) => {
    if (!window.confirm("Delete this draft?")) return;
    await deleteAnnouncementById(draftId);
    alert("Draft deleted!");
    fetchAnnouncements();
  };

  const publishDraft = async (draft) => {
    await updateAnnouncement(draft.announcementID, {
      ...draft,
      status: "active",
    });
    alert("Announcement published!");
    fetchAnnouncements();
  };

  const handleCourseSelect = (e) => {
    const courseId = e.target.value;
    setSelectedCourseId(courseId);
    fetchAnnouncements(courseId);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Course Announcements</h1>

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
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              className="w-full border p-3 rounded mb-3"
            />
            <textarea
              rows="5"
              placeholder="Announcement Message"
              value={form.content}
              onChange={(e) =>
                setForm((f) => ({ ...f, content: e.target.value }))
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
                    setForm({ title: "", content: "" });
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
                    <p className="text-gray-700 mt-1">{d.content}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      Draft created: {d.createdAt}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => publishDraft(d)}
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
                        onClick={() => deleteDraft(d.announcementID)}
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
            <h2 className="text-xl font-semibold mb-4">
              Published Announcements
            </h2>
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
                    <p className="text-gray-700 mt-1">{a.content}</p>
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
