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
      img: c.image ?? c.logo ?? c.img ?? c.coverImage ?? "/logo.png",
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

  // Filter and sort
  useEffect(() => {
    if (!courses.length) return;

    let filtered = [...courses];
    if (filters.level !== "all")
      filtered = filtered.filter(
        (c) => c.level.toLowerCase() === filters.level.toLowerCase()
      );
    if (filters.sortBy === "released")
      filtered.sort(
        (a, b) =>
          new Date(b.releasedDate || 0) - new Date(a.releasedDate || 0)
      );

    setCourses(filtered);
  }, [filters]);

  // Handle Schedule Timing
  const handleScheduleClick = (courseId) => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: `/schedule/${courseId}` } });
      return;
    }
    navigate(`/schedule/${courseId}`);
  };

  return (
    <div className="search-results-container bg-gray-50 px-6 py-12 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">All Courses</h1>

      {/* Filters */}
      <div className="filters mb-8 flex flex-wrap gap-4 justify-start">
        <select
          value={filters.level}
          onChange={(e) => setFilters({ ...filters, level: e.target.value })}
          className="px-3 py-2 border rounded-md shadow-sm"
        >
          <option value="all">All Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        <select
          value={filters.sortBy}
          onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
          className="px-3 py-2 border rounded-md shadow-sm"
        >
          <option value="released">Sort by Release Date</option>
        </select>

        <button
          onClick={resetFilters}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md shadow-sm"
        >
          Reset
        </button>
      </div>

      {/* Course list */}
      {loading && <div className="text-center py-6">Loading courses...</div>}
      {!loading && error && (
        <div className="text-center py-6 text-red-600">{error}</div>
      )}

      {!loading && !error && courses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all h-96 flex flex-col justify-between"
            >
              <div>
                <img
                  src={webdevremovebg}
                  alt={course.name}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {course.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 h-20 overflow-hidden">
                  {course.description || "No description available."}
                </p>
              </div>

              <div className="flex justify-between mt-2">
                <Link
                  to={`/courses/${course.id}`}
                  className="text-green-600 hover:text-green-700 font-semibold"
                >
                  View Course
                </Link>

                <button
                  onClick={() => handleScheduleClick(course.id)}
                  className="text-green-600 hover:text-green-700 font-semibold"
                >
                  Schedule Timing
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default beforeAuthLayout(AllCoursesPage);
