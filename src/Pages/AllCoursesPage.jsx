import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import beforeAuthLayout from "../components/BeforeAuth";
import useCourseApi from "../hooks/useCourseApi";
import { useAuth } from "../contexts/AuthContext";
import webdevremovebg from "../assets/Images/webdevremovebg.png";

const AllCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { fetchAllCourses } = useCourseApi();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const normalizeCourse = useCallback(
    (c) => ({
      id: c.courseID ?? c.id,
      name: c.title ?? c.name ?? c.courseName ?? "Untitled",
      description: c.description ?? c.outline ?? c.shortDescription ?? "",
      img: c.image ?? c.logo ?? c.img ?? c.coverImage ?? webdevremovebg,
      level: c.level ?? c.difficulty ?? "Beginner",
      knowledgeArea: c.knowledgeArea ?? c.category ?? c.type ?? "Tech Skills",
      numEnrolled: c.numEnrolled ?? c.enrolments ?? c.enrolledCount ?? 0,
      rating: c.rating ?? c.avgRating ?? 0,
      releasedDate: c.releasedDate ?? c.createdAt ?? c.publishedAt ?? null,
    }),
    []
  );

  const [filters, setFilters] = useState({ level: "all", sortBy: "released" });
  const resetFilters = () => setFilters({ level: "all", sortBy: "released" });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchAllCourses();
        const list = Array.isArray(res) ? res : res?.courses || [];
        if (!mounted) return;
        if (list.length === 0) setError("No courses available at the moment.");
        setCourses(list.map(normalizeCourse));
      } catch (e) {
        console.error("Failed to fetch courses", e);
        if (mounted) setError("Failed to load courses from the server.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => (mounted = false);
  }, [fetchAllCourses, normalizeCourse]);

  const handleScheduleClick = (courseId) => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: `/schedule/${courseId}` } });
      return;
    }
    navigate(`/schedule/${courseId}`);
  };

  return (
    <div className="bg-gray-50 px-6 py-12 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center md:text-left">
          All Courses
        </h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-10 justify-start">
          <select
            value={filters.level}
            onChange={(e) => setFilters({ ...filters, level: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:ring-2 focus:ring-green-500"
          >
            <option value="released">Sort by Release Date</option>
          </select>

          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md shadow-sm font-medium"
          >
            Reset
          </button>
        </div>

        {/* Loading / Error / List */}
        {loading && (
          <div className="text-center py-10 text-gray-600">Loading courses...</div>
        )}

        {!loading && error && (
          <div className="text-center py-10 text-red-600">{error}</div>
        )}

        {!loading && !error && courses.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
              >
                <img
                  src={course.img}
                  alt={course.name}
                  className="w-full h-44 object-cover"
                />

                <div className="flex-1 flex flex-col p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1">
                    {course.name}
                  </h3>

                  <p className="text-gray-600 text-sm flex-1 mb-4 line-clamp-3">
                    {course.description || "No description available."}
                  </p>

                  <div className="flex justify-between items-center mt-auto pt-4 border-t">
                    <Link
                      to={`/courses/${course.id}`}
                      className="text-green-600 hover:text-green-700 font-semibold text-sm"
                    >
                      View Course
                    </Link>

                    <button
                      onClick={() => handleScheduleClick(course.id)}
                      className="bg-green-500 text-white text-sm font-medium px-3 py-1.5 rounded-md hover:bg-green-600 transition"
                    >
                      Schedule
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default beforeAuthLayout(AllCoursesPage);
