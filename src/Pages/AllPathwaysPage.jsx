import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import beforeAuthLayout from "../components/BeforeAuth";
import { dummyPathways } from "../Pages/dummyData"; // ✅ central source

const AllPathwaysPage = () => {
    const [pathways, setPathways] = useState([]);
    const [filters, setFilters] = useState({
        knowledgeArea: "all",
        sortBy: "popularity", // popularity, rating, coursesCount
    });

    const resetFilters = () => {
        setFilters({
            knowledgeArea: "all",
            sortBy: "popularity",
        });
    };

    useEffect(() => {
        let filteredPathways = [...dummyPathways];

        // ✅ Knowledge Area filter
        if (filters.knowledgeArea !== "all") {
            filteredPathways = filteredPathways.filter(
                (p) => p.knowledgeArea === filters.knowledgeArea
            );
        }

        // ✅ Sorting
        if (filters.sortBy === "popularity") {
            filteredPathways.sort(
                (a, b) => (b.numEnrolled || 0) - (a.numEnrolled || 0)
            );
        } else if (filters.sortBy === "rating") {
            filteredPathways.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        } else if (filters.sortBy === "coursesCount") {
            filteredPathways.sort(
                (a, b) => (b.courses.length || 0) - (a.courses.length || 0)
            );
        }

        setPathways(filteredPathways);
    }, [filters]);

    return (
        <div className="search-results-container bg-gray-50 px-6 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">All Pathways</h1>

            {/* ✅ Filters */}
            <div className="filters mb-8 flex flex-wrap gap-4 justify-center">
                {/* Knowledge Area */}
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

                {/* Sort By */}
                <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                    className="px-3 py-2 border rounded-md shadow-sm"
                >
                    <option value="popularity">Sort by Popularity</option>
                    <option value="rating">Sort by Rating</option>
                    <option value="coursesCount">Sort by Number of Courses</option>
                </select>

                <button
                    onClick={resetFilters}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md shadow-sm"
                >
                    Reset
                </button>
            </div>

            {pathways.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {pathways.map((pathway) => (
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
                <p>No pathways found.</p>
            )}
        </div>
    );
};

export default beforeAuthLayout(AllPathwaysPage);
