import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import beforeAuthLayout from "../components/BeforeAuth";
import { dummyCourses } from "../Pages/dummyData"; // ✅ central source

const AllCoursesPage = () => {
    const [courses, setCourses] = useState([]);
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

    useEffect(() => {
        let filteredCourses = [...dummyCourses];

        // Apply filters
        if (filters.level !== "all") {
            filteredCourses = filteredCourses.filter(
                (course) => course.level === filters.level
            );
        }
        if (filters.knowledgeArea !== "all") {
            filteredCourses = filteredCourses.filter(
                (course) => course.knowledgeArea === filters.knowledgeArea
            );
        }

        // Apply sorting
        if (filters.sortBy === "popularity") {
            filteredCourses.sort((a, b) => b.numEnrolled - a.numEnrolled);
        } else if (filters.sortBy === "rating") {
            filteredCourses.sort((a, b) => b.rating - a.rating);
        } else if (filters.sortBy === "released") {
            filteredCourses.sort(
                (a, b) => new Date(b.releasedDate) - new Date(a.releasedDate)
            );
        }

        setCourses(filteredCourses);
    }, [filters]);

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
            {courses.length > 0 ? (
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
            )}
        </div>
    );
};

export default beforeAuthLayout(AllCoursesPage);
