import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import beforeAuthLayout from "../components/BeforeAuth";
import { useAuth } from "../contexts/AuthContext";
import usePathwayApi from "../hooks/usePathwayApi";
import useCourseApi from "../hooks/useCourseApi";
import useEnrollment from "../hooks/useEnrollment";

const PathwayContentPage = () => {
  const { pathwayId } = useParams();
  const navigate = useNavigate();
  const { loggedInUser } = useAuth();

  const [pathway, setPathway] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [enrolledCoursesForThisPathway, setEnrolledCoursesForThisPathway] =
    useState([]);
  const [coursesInPathway, setCoursesInPathway] = useState([]);

  const { getAllCoursesInAPathway } = useCourseApi();
  const { getPathwayDetails } = usePathwayApi();
  const { getEnrolledCoursesForUser } = useEnrollment();

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      try {
        const [pathwayData, coursesInPathway, enrolledCourses] =
          await Promise.all([
            getPathwayDetails(pathwayId),
            getAllCoursesInAPathway(pathwayId),
            getEnrolledCoursesForUser(loggedInUser?.id),
          ]);
        if (mounted) {
          setPathway(pathwayData.pathway);
          setCoursesInPathway(coursesInPathway.courses);
          setEnrolledCoursesForThisPathway(
            enrolledCourses?.enrolments.filter(
              (x) => x.pathwayID == pathwayId
            ) || []
          );
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to load modules", err);
        if (mounted) console.log("Failed to load modules.");
      }
    };
    loadData();
    return () => (mounted = false);
  }, [getPathwayDetails, getAllCoursesInAPathway, getEnrolledCoursesForUser]);

  console.log({ enrolledCoursesForThisPathway });
  // ---------- Progress calculation ----------
  const totalCourses = coursesInPathway?.length || 0;
  const completedCount = enrolledCoursesForThisPathway.filter(
    (x) => !!x.completionDate
  )?.length;
  const progressPercent =
    totalCourses > 0 ? Math.round((completedCount / totalCourses) * 100) : 0;

  if (isLoading) {
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
        Complete each course and pass its quiz with{" "}
        <strong>80% or higher</strong> to unlock the next one.
      </p>

      {/* ✅ Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-1 text-sm text-gray-700">
          <span>Progress</span>
          <span>
            {completedCount} / {totalCourses} Courses Completed
          </span>
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
        {coursesInPathway.map((course, index) => {
          const isCompleted = enrolledCoursesForThisPathway.some(
            (x) => x.courseID === course.courseID && !!x.completionDate
          );
          const isUnlocked = enrolledCoursesForThisPathway.some(
            (x) => x.courseID === course.courseID && !x.completionDate
          );

          return (
            <div
              key={course.courseID}
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-semibold text-blue-600 mb-1">
                  {course.title}
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
                  to={`/courses/${course.courseID}/content`}
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
