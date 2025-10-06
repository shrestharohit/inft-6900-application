import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import beforeAuthLayout from "../components/BeforeAuth";
import { dummyCourses } from "../Pages/dummyData"; // ✅ central source
import useCourseApi from "../hooks/useCourseApi";
import { useCallback } from "react";

const AllCoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [apiCourses, setApiCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { fetchAllCourses } = useCourseApi();

    const normalizeCourse = useCallback((c) => ({
        id: c.courseID ?? c.id,
        name: c.title ?? c.name ?? c.courseName ?? 'Untitled',
        description: c.description ?? c.outline ?? c.shortDescription ?? '',
        img: c.image ?? c.logo ?? c.img ?? c.coverImage ?? '/logo.png',
        level: c.level ?? c.difficulty ?? 'Beginner',
        knowledgeArea: c.knowledgeArea ?? c.category ?? c.type ?? 'Tech Skills',
        numEnrolled: c.numEnrolled ?? c.enrolments ?? c.enrolledCount ?? 0,
        rating: c.rating ?? c.avgRating ?? 0,
        releasedDate: c.releasedDate ?? c.createdAt ?? c.publishedAt ?? null,
        raw: c,
    }), []);
    const [filters, setFilters] = useState({
        level: "all",
        knowledgeArea: "all",
        sortBy: "popularity",
    });

    const resetFilters = () => {
        setFilters({
            level: "all",
            knowledgeArea: "all",
            sortBy: "popularity",
        });
    };

    // Fetch courses from backend on mount
    useEffect(() => {
        let mounted = true;
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetchAllCourses();
                const list = Array.isArray(res) ? res : res?.courses || [];
                if (!mounted) return;
                setApiCourses(list.map(normalizeCourse));
            } catch (e) {
                console.error('Failed to fetch courses', e);
                if (mounted) setError('Failed to load courses from server');
                // keep apiCourses empty — UI will fall back to dummyCourses
            } finally {
                if (mounted) setLoading(false);
            }
        };
        load();
        return () => (mounted = false);
    }, [fetchAllCourses, normalizeCourse]);

    // Apply filters and sorting to either API courses (if present) or dummy data
    useEffect(() => {
        const source = apiCourses.length > 0 ? apiCourses : dummyCourses.map(normalizeCourse);
        let filtered = [...source];

        if (filters.level !== 'all') filtered = filtered.filter((c) => c.level === filters.level);
        if (filters.knowledgeArea !== 'all') filtered = filtered.filter((c) => c.knowledgeArea === filters.knowledgeArea);

        if (filters.sortBy === 'popularity') filtered.sort((a, b) => (b.numEnrolled || 0) - (a.numEnrolled || 0));
        else if (filters.sortBy === 'rating') filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        else if (filters.sortBy === 'released') filtered.sort((a, b) => new Date(b.releasedDate || 0) - new Date(a.releasedDate || 0));

        setCourses(filtered);
    }, [filters, apiCourses, normalizeCourse]);

    return (
        <div className="search-results-container bg-gray-50 px-6 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">All Courses</h1>

            {/* ✅ Filters */}
            <div className="filters mb-8 flex flex-wrap gap-4 justify-center">
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
                    value={filters.knowledgeArea}
                    onChange={(e) =>
                        setFilters({ ...filters, knowledgeArea: e.target.value })
                    }
                    className="px-3 py-2 border rounded-md shadow-sm"
                >
                    <option value="all">All Knowledge Areas</option>
                    <option value="Tech Skills">Tech Skills</option>
                    <option value="Analytical Skills">Analytical Skills</option>
                    <option value="Business Skills">Business Skills</option>
                </select>

                <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                    className="px-3 py-2 border rounded-md shadow-sm"
                >
                    <option value="popularity">Sort by Popularity</option>
                    <option value="rating">Sort by Rating</option>
                    <option value="released">Sort by Release Date</option>
                </select>

                <button
                    onClick={resetFilters}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md shadow-sm"
                >
                    Reset
                </button>
            </div>

            {/* ✅ Courses */}
            {loading && (
                <div className="text-center py-6">Loading courses...</div>
            )}
            {error && (
                <div className="text-center py-6 text-red-600">{error}</div>
            )}
            {!loading && (
              courses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <div
                            key={course.id}
                            className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all"
                        >
                            <img
                                src={course.img}
                                alt={course.name}
                                className="w-full h-40 object-cover rounded-lg mb-4"
                            />
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                {course.name}
                            </h3>
                            <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                            <Link
                                to={`/courses/${course.id}`}
                                className="text-green-600 hover:text-green-700 font-semibold"
                            >
                                View Course
                            </Link>
                        </div>
                    ))}
                                </div>
                            ) : (
                                <p>No courses found.</p>
                            )
                        )}
        </div>
    );
};

export default beforeAuthLayout(AllCoursesPage);
