import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import useCourseApi from "../hooks/useCourseApi";
import beforeAuthLayout from "../components/BeforeAuth";

const Dashboard = () => {
  const { loggedInUser } = useAuth();
  const { fetchAllCourses } = useCourseApi();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);

  // ✅ Fetch all courses (handle both array or { courses: [] } responses)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetchAllCourses();
        const list = Array.isArray(res) ? res : res?.courses || [];
        if (mounted) setAllCourses(list);
      } catch (err) {
        console.error("Failed to fetch courses", err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [fetchAllCourses]);

  // ✅ Build enrolled course list with progress
  useEffect(() => {
    if (!loggedInUser || !allCourses.length) return;

    const enrolledData =
      loggedInUser.enrolledCourses || loggedInUser.enrollments || {};
    const enrolledIds = Object.keys(enrolledData);

    const courses = enrolledIds
      .map((id) => {
        // Match courseID or id
        const course = allCourses.find(
          (c) => String(c.courseID ?? c.id) === String(id)
        );
        if (!course) return null;

        const status = enrolledData[id]?.status || "unlocked";

        // Calculate progress from localStorage
        const completed =
          JSON.parse(localStorage.getItem(`progress_${id}`)) || [];
        const totalLessons =
          course.modules?.reduce(
            (acc, m) => acc + (m.lessons?.length || 0),
            0
          ) || 0;
        const progress =
          totalLessons > 0
            ? Math.round((completed.length / totalLessons) * 100)
            : 0;

        return { ...course, status, progress };
      })
      .filter(Boolean);

    setEnrolledCourses(courses);
  }, [loggedInUser, allCourses]);

  // ✅ If not logged in
  if (!loggedInUser) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-700">
          Please log in to view your dashboard.
        </h2>
      </div>
    );
  }

  const total = enrolledCourses.length;
  const completed = enrolledCourses.filter((c) => c.progress === 100).length;
  const inProgress = total - completed;

  return (
    <div className="p-6 max-w-7xl mx-auto pt-14">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Welcome back, {loggedInUser.firstName || "Student"} 👋
      </h1>

      {/* ✅ Stats Section */}
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

      {/* ✅ Courses Section */}
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
              key={course.courseID ?? course.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition p-6 flex flex-col"
            >
              <h3 className="text-lg font-bold text-gray-800 text-center mb-3">
                {course.title || course.name || "Untitled Course"}
              </h3>

              {/* ✅ Progress bar */}
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

              {/* ✅ CTA button */}
              <div className="mt-auto flex justify-center">
                <Link
                  to={`/courses/${course.courseID ?? course.id}/content`}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-2 rounded-md text-sm font-semibold shadow"
                >
                  {course.progress === 100
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
