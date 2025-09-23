import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import beforeAuthLayout from "../components/BeforeAuth";

// ✅ import shared dummy data
import { dummyCourses, dummyPathways } from "../Pages/dummyData";

function SearchResults() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get("query") || "";
    const category = queryParams.get("category") || "all";

    const [searchResults, setSearchResults] = useState({
        courses: [],
        pathways: [],
    });

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
        let filteredCourses = dummyCourses.filter((course) =>
            course.name.toLowerCase().includes(query.toLowerCase())
        );

        let filteredPathways = dummyPathways.filter((pathway) =>
            pathway.name.toLowerCase().includes(query.toLowerCase())
        );

        if (category === "courses") {
            filteredPathways = [];
        } else if (category === "pathways") {
            filteredCourses = [];
        }

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

        // Sorting
        if (filters.sortBy === "popularity") {
            filteredCourses.sort((a, b) => b.numEnrolled - a.numEnrolled);
        } else if (filters.sortBy === "rating") {
            filteredCourses.sort((a, b) => b.rating - a.rating);
        } else if (filters.sortBy === "released") {
            filteredCourses.sort(
                (a, b) => new Date(b.releasedDate) - new Date(a.releasedDate)
            );
        }

        setSearchResults({
            courses: filteredCourses,
            pathways: filteredPathways,
        });
    }, [query, filters, category]);

    return (
        <div className="search-results-container bg-gray-50 px-6 py-12">
            {/* Search term heading */}
            <div className="mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                    Search Results for:{" "}
                    <span className="text-black-600">
                        "
                        {query ||
                            (category === "all"
                                ? "All Courses & Pathways"
                                : category === "courses"
                                    ? "All Courses"
                                    : "All Pathways")}
                        "
                    </span>
                </h1>
            </div>

            {/* Filters */}
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

            {/* Courses Section */}
            {category !== "pathways" && (
                <div className="mb-12">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Courses</h2>
                    {searchResults.courses.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {searchResults.courses.map((course) => (
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
                                    <p className="text-gray-600 text-sm mb-4">
                                        {course.description}
                                    </p>
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
                        <p className="text-gray-500">
                            No courses found {query && `for "${query}"`}
                        </p>
                    )}
                </div>
            )}

            {/* Pathways Section */}
            {category !== "courses" && (
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Pathways</h2>
                    {searchResults.pathways.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {searchResults.pathways.map((pathway) => (
                                <div
                                    key={pathway.id}
                                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all"
                                >
                                    <img
                                        src={pathway.img}
                                        alt={pathway.name}
                                        className="w-full h-40 object-cover rounded-lg mb-4"
                                    />
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                        {pathway.name}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4">
                                        {pathway.description}
                                    </p>
                                    <Link
                                        to={`/pathway/${pathway.id}`}
                                        className="text-green-600 hover:text-green-700 font-semibold"
                                    >
                                        View Pathway
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">
                            No pathways found {query && `for "${query}"`}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

export default beforeAuthLayout(SearchResults);
