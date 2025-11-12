import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import beforeAuthLayout from "../components/BeforeAuth";
import usePathwayApi from "../hooks/usePathwayApi";
import webdevremovebg from "../assets/Images/webdevremovebg.png";

const AllPathwaysPage = () => {
  const [pathways, setPathways] = useState([]);
  const [filters, setFilters] = useState({
    sortBy: "created_desc",
  });

  const { fetchAllPathways } = usePathwayApi();

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      try {
        const pathwayList = await fetchAllPathways();

        if (mounted) {
          setPathways(pathwayList.pathways);
        }
      } catch (err) {
        console.error("Failed to load modules", err);
        if (mounted) console.log("Failed to load modules.");
      }
    };
    loadData();
    return () => (mounted = false);
  }, [fetchAllPathways]);

  const resetFilters = () => {
    setFilters({
      sortBy: "created_desc",
    });
  };

  useEffect(() => {
    let filteredPathways = [...pathways];

    // Sorting
    if (filters.sortBy === "created_desc") {
      filteredPathways.sort(
        (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
      );
    } else if (filters.sortBy === "created_asc") {
      filteredPathways.sort(
        (a, b) => new Date(a.createdDate) - new Date(b.createdDate)
      );
    }

    setPathways(filteredPathways);
  }, [filters]);

  return (
    <div className="search-results-container bg-gray-50 px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">All Pathways</h1>

      {/* Filters */}
      <div className="filters mb-8 flex flex-wrap gap-4 justify-start">
        {/* Sort By */}
        <select
          value={filters.sortBy}
          onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
          className="px-3 py-2 border rounded-md shadow-sm"
        >
          <option value="created_desc">Created Date ↓ (Newest)</option>
          <option value="created_asc">Created Date ↑ (Oldest)</option>
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
              key={pathway.pathwayID}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all"
            >
              <img
                src={webdevremovebg}
                alt={pathway.name}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {pathway.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4">{pathway.outline}</p>
              <Link
                to={`/pathway/${pathway.pathwayID}`}
                className="text-green-600 hover:text-green-700 font-semibold"
              >
                View Pathway
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p>
          {/* No pathways found. */}
          Loading Pathways...
        </p>
      )}
    </div>
  );
};

export default beforeAuthLayout(AllPathwaysPage);
