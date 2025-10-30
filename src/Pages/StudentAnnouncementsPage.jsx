import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import beforeAuthLayout from "../components/BeforeAuth";
import useAnnouncement from "../hooks/useAnnouncement";
import useRoleAccess from "../hooks/useRoleAccess";
import { dummyCourses } from "../Pages/dummyData";

const StudentAnnouncementsPageContent = () => {
  const { courseId } = useParams();
  const [published, setPublished] = useState([]);
  const { getAllAnnouncementsForCourse } = useAnnouncement();
  const { canViewAnnouncements, canCreateAnnouncement, isAdmin } = useRoleAccess();

  const course = dummyCourses.find((c) => String(c.id) === String(courseId));

  // 🚫 Role restriction
  if (!canViewAnnouncements) {
    return (
      <div className="p-6 text-center text-red-500 font-semibold">
        You do not have permission to view this page.
      </div>
    );
  }

  const fetchAnnouncements = () => {
    getAllAnnouncementsForCourse(courseId)
      .then((res) => {
        const publishedList =
          res.announcements
            ?.filter((a) => a.status === "active")
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) ||
          [];
        setPublished(publishedList);
      })
      .catch((err) => {
        console.error("Failed to fetch announcements", err);
        setPublished([]);
      });
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [getAllAnnouncementsForCourse, courseId]);

  // ✅ Helper to check if announcement is NEW (within last 7 days)
  const isNew = (publishedAt) => {
    const publishedDate = new Date(publishedAt);
    const now = new Date();
    const diffInDays = (now - publishedDate) / (1000 * 60 * 60 * 24);
    return diffInDays <= 7;
  };

  if (!course) {
    return (
      <div className="p-6 text-red-500">
        Course not found. Please go back to courses.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* 🔹 Optional admin/owner banner */}
      {isAdmin && (
        <div className="mb-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-3 rounded">
          Admin Preview Mode — view-only access.
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          📢 Announcements
        </h1>

        {/* ✅ Only admins & course owners can post */}
        {canCreateAnnouncement && (
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow"
            onClick={() => alert("Coming soon: Create Announcement Modal")}
          >
            + New Announcement
          </button>
        )}
      </div>

      {published.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-600">
            No announcements have been published yet. Check back later!
          </p>
        </div>
      ) : (
        <ul className="space-y-6">
          {published.map((a) => (
            <li
              key={a.id}
              className="bg-white border-l-4 border-green-500 p-5 rounded-lg shadow hover:shadow-md transition relative"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-[#1f2a60]">
                  {a.title}
                </h3>
                {isNew(a.created_at) && (
                  <span className="ml-2 px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse">
                    NEW
                  </span>
                )}
              </div>
              <p className="text-gray-700 mt-2 whitespace-pre-line">
                {a.message}
              </p>
              <p className="text-xs text-gray-500 mt-3">
                Published on: {a.created_at}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default beforeAuthLayout(StudentAnnouncementsPageContent);
