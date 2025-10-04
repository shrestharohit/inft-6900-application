// src/Pages/StudentAnnouncementsPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { dummyCourses } from "../Pages/dummyData";
import beforeAuthLayout from "../components/BeforeAuth";

const StudentAnnouncementsPageContent = () => {
    const { courseId } = useParams();
    const [published, setPublished] = useState([]);

    const course = dummyCourses.find((c) => String(c.id) === String(courseId));

    useEffect(() => {
        if (!courseId) return;
        const savedPublished =
            JSON.parse(localStorage.getItem(`published_${courseId}`)) || [];
        setPublished(savedPublished);
    }, [courseId]);

    if (!course) {
        return (
            <div className="p-6 text-red-500">
                Course not found. Please go back to courses.
            </div>
        );
    }

    // ✅ Helper to check if announcement is NEW (within last 7 days)
    const isNew = (publishedAt) => {
        const publishedDate = new Date(publishedAt);
        const now = new Date();
        const diffInDays = (now - publishedDate) / (1000 * 60 * 60 * 24);
        return diffInDays <= 7;
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                📢 Announcements for {course.name}
            </h1>

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
                                {isNew(a.publishedAt) && (
                                    <span className="ml-2 px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse">
                                        NEW
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-700 mt-2 whitespace-pre-line">{a.message}</p>
                            <p className="text-xs text-gray-500 mt-3">
                                Published on: {a.publishedAt}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

// ✅ wrap with Header + Footer layout
export default beforeAuthLayout(StudentAnnouncementsPageContent);
