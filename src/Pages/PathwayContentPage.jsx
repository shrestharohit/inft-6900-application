import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import beforeAuthLayout from "../components/BeforeAuth";
import { useAuth } from "../contexts/AuthContext";

// Dummy pathways for now
const dummyPathways = [
    {
        id: "101",
        name: "Tech Skills Pathway",
        courses: [
            { id: "1", name: "Web Development (Beginner)" },
            { id: "2", name: "Web Development (Intermediate)" },
            { id: "3", name: "Web Development (Advanced)" },
        ],
    },
    {
        id: "102",
        name: "Analytical Skills Pathway",
        courses: [
            { id: "4", name: "Data Analytics (Beginner)" },
            { id: "5", name: "Data Analytics (Intermediate)" },
            { id: "6", name: "Data Analytics (Advanced)" },
        ],
    },
    {
        id: "103",
        name: "Business Skills Pathway",
        courses: [
            { id: "7", name: "Business Skills (Beginner)" },
            { id: "8", name: "Business Skills (Intermediate)" },
            { id: "9", name: "Business Skills (Advanced)" },
        ],
    },
];

const PathwayContentPage = () => {
    const { pathwayId } = useParams();
    const navigate = useNavigate();
    const { loggedInUser } = useAuth();

    const [pathway, setPathway] = useState(null);
    const [status, setStatus] = useState("loading");
    const [completedCourses, setCompletedCourses] = useState([]);
    const [unlockedCourses, setUnlockedCourses] = useState([]);

    useEffect(() => {
        let mounted = true;
        setStatus("loading");

        const selected = dummyPathways.find((p) => p.id === pathwayId);

        if (!mounted) return;

        if (!selected) {
            setPathway(null);
            setStatus("not_found");
            return;
        }

        setPathway(selected);

        // Load completed courses (dummy simulation)
        const userCompleted = loggedInUser?.completedCourses || [];
        setCompletedCourses(userCompleted);

        // ✅ Unlock logic (auto unlock next after completion)
        const unlocked = [selected.courses[0].id]; // always first course unlocked
        userCompleted.forEach((cid) => {
            const index = selected.courses.findIndex((c) => c.id === cid);
            if (index >= 0 && index < selected.courses.length - 1) {
                unlocked.push(selected.courses[index + 1].id);
            }
        });

        setUnlockedCourses([...new Set(unlocked)]);
        setStatus("success");

        return () => {
            mounted = false;
        };
    }, [pathwayId, loggedInUser]);

    // ---------- UI states ----------
    if (status === "loading") {
        return (
            <div className="max-w-7xl mx-auto p-6 animate-pulse">
                <div className="h-8 w-64 bg-gray-200 rounded mb-4" />
                <div className="h-4 w-96 bg-gray-200 rounded mb-6" />
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white p-4 rounded-lg shadow">
                            <div className="h-5 w-52 bg-gray-200 rounded mb-3" />
                            <div className="h-4 w-80 bg-gray-200 rounded mb-1" />
                            <div className="h-4 w-72 bg-gray-200 rounded" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (status === "not_found") {
        return (
            <div className="flex items-center justify-center min-h-[50vh] text-red-600 font-semibold">
                Pathway not found.
            </div>
        );
    }

    // ---------- Progress calculation ----------
    const totalCourses = pathway?.courses?.length || 0;
    const completedCount = completedCourses.filter((id) =>
        pathway.courses.some((c) => c.id === id)
    ).length;
    const progressPercent =
        totalCourses > 0 ? Math.round((completedCount / totalCourses) * 100) : 0;

    // ---------- Main Content ----------
    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Back Button (same as CoursePage) */}
            <div className="mb-4">
                <button
                    onClick={() => {
                        if (window.history.state && window.history.state.idx > 0) {
                            navigate(-1);
                        } else {
                            navigate("/search");
                        }
                    }}
                    className="text-sm text-gray-600 hover:underline"
                >
                    &larr; Back
                </button>
            </div>

            {/* Header */}
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
                {pathway?.name || "Pathway Content"}
            </h1>
            <p className="text-gray-600 mb-6">
                Complete each course and pass its quiz with <strong>80% or higher</strong> to
                unlock the next one.
            </p>

            {/* ✅ Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between mb-1 text-sm text-gray-700">
                    <span>Progress</span>
                    <span>{completedCount} / {totalCourses} Courses Completed</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                        className="bg-green-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                    ></div>
                </div>
            </div>

            {/* ✅ Course List */}
            <div className="space-y-4">
                {pathway.courses.map((course, index) => {
                    const isCompleted = completedCourses.includes(course.id);
                    const isUnlocked = unlockedCourses.includes(course.id);

                    return (
                        <div
                            key={course.id}
                            className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow flex justify-between items-center"
                        >
                            <div>
                                <h2 className="text-xl font-semibold text-blue-600 mb-1">
                                    {course.name}
                                </h2>
                                <p className="text-gray-600">
                                    {isCompleted
                                        ? "✅ Completed"
                                        : isUnlocked
                                            ? "🔓 Unlocked"
                                            : "🔒 Locked"}
                                </p>
                            </div>

                            {isUnlocked && !isCompleted && (
                                <Link
                                    to={`/courses/${course.id}/content`}
                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                                >
                                    Start Course
                                </Link>
                            )}

                            {isCompleted && (
                                <button
                                    disabled
                                    className="bg-green-700 text-white px-4 py-2 rounded-md cursor-default"
                                >
                                    Completed
                                </button>
                            )}

                            {!isUnlocked && !isCompleted && (
                                <button
                                    disabled
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md cursor-not-allowed"
                                >
                                    Locked
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default beforeAuthLayout(PathwayContentPage);
