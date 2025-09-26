import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import beforeAuthLayout from "../components/BeforeAuth";
import { useAuth } from "../contexts/AuthContext";

// Same dummy pathways used in PathwayPage
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
    const { loggedInUser } = useAuth();
    const [pathway, setPathway] = useState(null);
    const [completedCourses, setCompletedCourses] = useState([]);

    useEffect(() => {
        const selected = dummyPathways.find((p) => p.id === pathwayId);
        setPathway(selected);

        if (loggedInUser?.completedCourses) {
            setCompletedCourses(loggedInUser.completedCourses);
        }
    }, [pathwayId, loggedInUser]);

    if (!pathway) {
        return <div>Pathway not found!</div>;
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Back to Pathway Overview */}
            <div className="mb-4">
                <Link
                    to={`/pathway/${pathwayId}`}
                    className="text-sm text-gray-600 hover:underline"
                >
                    &larr; Back to Pathway Overview
                </Link>
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                {pathway.name} - Content
            </h1>

            <p className="text-gray-600 mb-6">
                Welcome to your pathway! Complete the courses in order to unlock the
                next ones.
            </p>

            <div className="space-y-4">
                {pathway.courses.map((course, index) => {
                    const isCompleted = completedCourses.includes(course.id);
                    const isUnlocked =
                        index === 0 || completedCourses.includes(pathway.courses[index - 1].id);

                    return (
                        <div
                            key={course.id}
                            className="bg-white p-4 rounded-lg shadow flex items-center justify-between"
                        >
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">
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
                                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                                >
                                    Start Course
                                </Link>
                            )}

                            {isCompleted && (
                                <button
                                    disabled
                                    className="px-4 py-2 bg-green-500 text-white rounded-md cursor-default"
                                >
                                    Completed
                                </button>
                            )}

                            {!isUnlocked && (
                                <button
                                    disabled
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md cursor-not-allowed"
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
