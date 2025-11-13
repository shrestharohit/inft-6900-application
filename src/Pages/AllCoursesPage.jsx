import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import beforeAuthLayout from "../components/BeforeAuth";
import useCourseApi from "../hooks/useCourseApi";
import useReview from "../hooks/useReviews";
import { useAuth } from "../contexts/AuthContext";
import webdevremovebg from "../assets/Images/webdevremovebg.png";
 
const AllCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { fetchAllCourses, fetchCourse } = useCourseApi();
  const { getAllReviewsForCourse } = useReview();
  const { isLoggedIn } = useAuth();
 
  //Capitalize helper
  const capitalizeFirst = (str) => {
    if (!str) return "";
    return str
      .toString()
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  };
 
  // Sydney-local time format 
  const normalizeToDate = (ts) => {
    if (!ts) return null;
    if (ts instanceof Date) return ts;
 
    if (typeof ts === "number") {
      const ms = ts > 1e12 ? ts : ts * 1000;
      return new Date(ms);
    }
 
    if (typeof ts === "string") {
      let s = ts.trim();
      if (s.includes(" ") && !s.includes("T")) s = s.replace(" ", "T");
      const d = new Date(s);
      return isNaN(d) ? null : d;
    }
 
    const d = new Date(ts);
    return isNaN(d) ? null : d;
  };
 
  const formatDateTime = (ts) => {
  const date = normalizeToDate(ts);
  if (!date) return "";
  return new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Sydney",
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
};
 
 
  const normalizeCourse = useCallback((c) => {
    const user = c.userDetail || {};
    const ownerFullName =
      user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user.firstName || user.lastName || c.courseOwner || c.owner || "Unknown";
 
    return {
      id: c.courseID ?? c.id,
      name: c.title ?? c.name ?? c.courseName ?? "Untitled",
      description: c.description ?? c.outline ?? c.shortDescription ?? "",
      img: c.image ?? c.logo ?? c.img ?? c.coverImage ?? webdevremovebg,
      level: capitalizeFirst(c.level ?? c.difficulty ?? "Beginner"),
      knowledgeArea: capitalizeFirst(
        c.knowledgeArea ?? c.category ?? c.type ?? "General"
      ),
      numEnrolled: c.numEnrolled ?? c.enrolments ?? c.enrolledCount ?? 0,
      rating:
        c.reviews?.avgRating ??
        c.avgRating ??
        c.rating ??
        c.reviewAverage ??
        0,
      releasedDate:
        c.created_at ??
        c.createdAt ??
        c.releasedDate ??
        c.publishedAt ??
        c.updated_at ??
        null,
      owner: capitalizeFirst(ownerFullName.trim() || "Unknown"),
    };
  }, []);
 
  // Fetch courses 
  useEffect(() => {
    let mounted = true;
 
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchAllCourses();
        const list = Array.isArray(res) ? res : res?.courses || [];
        if (!mounted) return;
 
        if (list.length === 0) {
          setError("No courses available at the moment.");
          setCourses([]);
          return;
        }
 
        let normalized = list.map(normalizeCourse);
 
       
        const enriched = await Promise.all(
          normalized.map(async (course) => {
            let enrichedData = { ...course };
 
            // Rating fix 
            if (!course.rating || course.rating === 0) {
              try {
                const reviewRes = await getAllReviewsForCourse(course.id);
                enrichedData.rating = reviewRes?.avgRating ?? 0;
              } catch (err) {
                console.warn("Rating fetch failed for", course.id);
              }
            }
 
            // Owner fallback if Unknown
            if (course.owner === "Unknown") {
              try {
                const details = await fetchCourse(course.id);
                const user = details.userDetail || {};
                enrichedData.owner = capitalizeFirst(
                  user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user.firstName || user.lastName || "Unknown"
                );
              } catch (err) {
                console.warn("Owner fetch failed for", course.id);
              }
            }
 
            return enrichedData;
          })
        );
 
        if (mounted) setCourses(enriched);
      } catch (e) {
        console.error("Failed to fetch courses", e);
        if (mounted) setError("Failed to load courses from the server.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
 
    load();
    return () => (mounted = false);
  }, [fetchAllCourses, fetchCourse, getAllReviewsForCourse, normalizeCourse]);
 
  const [filters, setFilters] = useState({
    level: "all",
    category: "all",
    rating: "all",
    sortBy: "released_desc",
  });
 
  const resetFilters = () =>
    setFilters({
      level: "all",
      category: "all",
      rating: "all",
      sortBy: "released_desc",
    });
 
 
  const uniqueLevels = useMemo(() => {
    const levels = Array.from(
      new Set(courses.map((c) => capitalizeFirst(c.level)))
    );
    return levels.length ? levels : ["Beginner", "Intermediate", "Advanced"];
  }, [courses]);
 
  const uniqueCategories = useMemo(() => {
    const cats = Array.from(
      new Set(courses.map((c) => capitalizeFirst(c.knowledgeArea || "General")))
    );
    return cats.length ? cats : ["General"];
  }, [courses]);
 
  // Apply filters + sorting
  const filteredCourses = useMemo(() => {
    let result = [...courses];
 
    if (filters.level !== "all") {
      result = result.filter(
        (c) => capitalizeFirst(c.level) === capitalizeFirst(filters.level)
      );
    }
 
    if (filters.category !== "all") {
      result = result.filter(
        (c) =>
          capitalizeFirst(c.knowledgeArea) ===
          capitalizeFirst(filters.category)
      );
    }
 
    if (filters.rating !== "all") {
      result = result.filter((c) => c.rating >= parseFloat(filters.rating));
    }
 
    result.sort((a, b) => {
      if (filters.sortBy === "released_desc")
        return new Date(b.releasedDate) - new Date(a.releasedDate);
      if (filters.sortBy === "released_asc")
        return new Date(a.releasedDate) - new Date(b.releasedDate);
      if (filters.sortBy === "rating_desc") return b.rating - a.rating;
      if (filters.sortBy === "rating_asc") return a.rating - b.rating;
      return 0;
    });
 
    return result;
  }, [courses, filters]);
 
  // Render
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
            className="px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Levels</option>
            {uniqueLevels.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
 
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
            className="px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Categories</option>
            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
 
          <select
            value={filters.rating}
            onChange={(e) =>
              setFilters({ ...filters, rating: e.target.value })
            }
            className="px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Ratings</option>
            <option value="4.5">⭐ 4.5 and above</option>
            <option value="4">⭐ 4.0 and above</option>
            <option value="3.5">⭐ 3.5 and above</option>
          </select>
 
          <select
            value={filters.sortBy}
            onChange={(e) =>
              setFilters({ ...filters, sortBy: e.target.value })
            }
            className="px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-green-500"
          >
            <option value="released_desc">Release Date ↓ (Newest)</option>
            <option value="released_asc">Release Date ↑ (Oldest)</option>
            <option value="rating_desc">Rating ↓ (High to Low)</option>
            <option value="rating_asc">Rating ↑ (Low to High)</option>
          </select>
 
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md font-medium"
          >
            Reset
          </button>
        </div>
 
        {/* Loading / Error / Empty */}
        {loading && (
          <div className="text-center py-10 text-gray-600">
            Loading courses...
          </div>
        )}
        {!loading && error && (
          <div className="text-center py-10 text-red-600">{error}</div>
        )}
        {!loading && !error && filteredCourses.length === 0 && (
          <div className="text-center py-10 text-gray-500 italic">
            No courses found for the selected filters.
          </div>
        )}
 
        {/* Course Grid */}
        {!loading && !error && filteredCourses.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
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
                  <h3 className="text-xl font-semibold text-gray-800 mb-1 line-clamp-1">
                    {course.name}
                  </h3>
 
                  <p className="text-gray-500 text-sm mb-1">
                    Level: {course.level} | ⭐{" "}
                    {Number(course.rating) > 0
                      ? Number(course.rating).toFixed(1)
                      : "No ratings"}
                  </p>
 
 
                  {course.releasedDate && (
                    <p className="text-gray-500 text-sm mb-1">
                      Created: {formatDateTime(course.releasedDate)}
                    </p>
                  )}
 
                  <p className="text-gray-500 text-sm mb-2">
                    Course Owner: {course.owner || "Unknown"}
                  </p>
 
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