// src/Pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { dummyCourses } from "../Pages/dummyData";
import { dummyModules } from "../Pages/dummyModule";
import beforeAuthLayout from "../components/BeforeAuth";

const Dashboard = () => {
    const { loggedInUser } = useAuth();
    const [enrolledCourses, setEnrolledCourses] = useState([]);

    useEffect(() => {
        if (loggedInUser?.enrolledCourses) {
            const courseIds = Object.keys(loggedInUser.enrolledCourses);
            const courses = courseIds.map((id) => {
                const course = dummyCourses.find((c) => String(c.id) === String(id));
                const status = loggedInUser.enrolledCourses[id]?.status || "unlocked";

                // Calculate progress
                const modules = dummyModules[id] || [];
                const totalLessons = modules.reduce(
                    (acc, m) => acc + (m.lessons?.length || 0),
                    0
                );
                const completed =
                    JSON.parse(localStorage.getItem(`progress_${id}`)) || [];
                const completedCount = completed.length;
                const progress =
                    totalLessons > 0
                        ? Math.round((completedCount / totalLessons) * 100)
                        : 0;

                return { ...course, status, progress };
            });
            setEnrolledCourses(courses);
        }
    }, [loggedInUser]);

    if (!loggedInUser) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-2xl font-bold text-gray-700">
                    Please log in to view your dashboard.
                </h2>
            </div>
        );
    }

    // Quick stats
    const total = enrolledCourses.length;
    const completed = enrolledCourses.filter((c) => c.progress === 100).length;
    const inProgress = total - completed;

    return (
        <div className="p-6 max-w-7xl mx-auto pt-14">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                Welcome back, {loggedInUser.firstName || "Student"} 👋
            </h1>

            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                <div className="bg-white rounded-lg shadow p-6 text-center">
                    <p className="text-sm text-gray-500">Enrolled</p>
                    <p className="text-2xl font-bold text-blue-600">{total}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6 text-center">
                    <p className="text-sm text-gray-500">In Progress</p>
                    <p className="text-2xl font-bold text-yellow-500">{inProgress}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6 text-center">
                    <p className="text-sm text-gray-500">Completed</p>
                    <p className="text-2xl font-bold text-green-600">{completed}</p>
                </div>
            </div>

            {/* Courses Section */}
            {enrolledCourses.length === 0 ? (
                <p className="text-gray-600">
                    You are not enrolled in any courses yet.{" "}
                    <Link to="/all-courses" className="text-blue-600 underline">
                        Browse courses
                    </Link>
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enrolledCourses.map((course) => (
                        <div
                            key={course.id}
                            className="bg-white rounded-lg shadow-md hover:shadow-xl transition p-6 flex flex-col"
                        >
                            <img
                                src={course.img}
                                alt={course.name}
                                className="w-28 h-28 object-contain mx-auto mb-4"
                            />
                            <h3 className="text-lg font-bold text-gray-800 text-center">
                                {course.name}
                            </h3>
                            <p className="text-sm text-gray-600 text-center mb-3 line-clamp-2">
                                {course.description}
                            </p>

                            {/* Progress */}
                            <div className="mb-3">
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-green-500 h-3 rounded-full"
                                        style={{ width: `${course.progress}%` }}
                                    ></div>
                                </div>
                                <p className="text-sm text-gray-600 mt-1 text-center">
                                    Progress: {course.progress}%
                                </p>
                            </div>

                            {/* CTA */}
                            <div className="mt-auto flex justify-center">
                                <Link
                                    to={`/courses/${course.id}/content`}
                                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-2 rounded-md text-sm font-semibold shadow"
                                >
                                    {course.status === "completed"
                                        ? "Review Course"
                                        : "Continue Learning"}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default beforeAuthLayout(Dashboard);
