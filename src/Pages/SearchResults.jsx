import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import beforeAuthLayout from "../components/BeforeAuth";
import webdevremovebg from "../assets/Images/webdevremovebg.png";

import { dummyCourses, dummyPathways } from "../Pages/dummyData";
import usePathwayApi from "../hooks/usePathwayApi";
import useCourseApi from "../hooks/useCourseApi";

function SearchResults() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query") || "";
  const category = queryParams.get("category") || "all";
  const [pathways, setPathway] = useState([]);
  const [courses, setCourses] = useState([]);
  const [searchResults, setSearchResults] = useState({
    courses: [],
    pathways: [],
  });

  const { fetchAllPathways } = usePathwayApi();
  const { fetchAllCourses } = useCourseApi();

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      try {
        const [pathwayData, courseData] = await Promise.all([
          fetchAllPathways(),
          fetchAllCourses(),
        ]);
        if (mounted) {
          setPathway(pathwayData.pathways);
          setCourses(courseData);

          let filteredCourses = courseData.filter((course) =>
            course.title.toLowerCase().includes(query.toLowerCase())
          );

          let filteredPathways = pathwayData.pathways.filter((pathway) =>
            pathway.name.toLowerCase().includes(query.toLowerCase())
          );

          if (category === "courses") {
            filteredPathways = [];
          } else if (category === "pathways") {
            filteredCourses = [];
          }

          setSearchResults({
            courses: filteredCourses,
            pathways: filteredPathways,
          });
        }
      } catch (err) {
        console.error("Failed to load modules", err);
        if (mounted) console.log("Failed to load modules.");
      }
    };
    loadData();
    return () => (mounted = false);
  }, [fetchAllPathways, fetchAllCourses]);

  useEffect(() => {
    let filteredCourses = courses.filter((course) =>
      course.title.toLowerCase().includes(query.toLowerCase())
    );

    let filteredPathways = pathways.filter((pathway) =>
      pathway.name.toLowerCase().includes(query.toLowerCase())
    );

    if (category === "courses") {
      filteredPathways = [];
    } else if (category === "pathways") {
      filteredCourses = [];
    }

    setSearchResults({
      courses: filteredCourses,
      pathways: filteredPathways,
    });
  }, [query, category]);

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

      {/* Courses Section */}
      {category !== "pathways" && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Courses</h2>
          {searchResults.courses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {searchResults.courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
                >
                  <img
                    src={webdevremovebg}
                    alt={course.title}
                    className="w-full h-44 object-cover"
                  />

                  <div className="flex-1 flex flex-col p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-1 line-clamp-1">
                      {course.title}
                    </h3>


                    {course.releasedDate && (
                      <p className="text-gray-500 text-sm mb-1">
                        Created: {formatDateTime(course.releasedDate)}
                      </p>
                    )}

                    <p className="text-gray-600 text-sm flex-1 mb-4 line-clamp-3">
                      {course.outline || "No description available."}
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
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Pathways
          </h2>
          {searchResults.pathways.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {searchResults.pathways.map((pathway) => (
                <div
                  key={pathway.id}
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
                  <p className="text-gray-600 text-sm mb-4">
                    {pathway.description}
                  </p>
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
            <p className="text-gray-500">
              No pathway found {query && `for "${query}"`}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default beforeAuthLayout(SearchResults);
