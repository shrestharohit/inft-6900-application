import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import beforeAuthLayout from "../components/BeforeAuth";
import webdevremovebg from "../assets/Images/webdevremovebg.png";
import dataanaremovebg from "../assets/Images/dataanaremovebg.png";
import aiMlImg from "../assets/Images/aimlremovebg.png";
import techSkillsImg from "../assets/Images/techskills.png";
import analyticalSkillsImg from "../assets/Images/analyticalskills.png";
import businessSkillsImg from "../assets/Images/businessskills.png";

// Dummy data for demonstration purposes
const dummyCourses = [
    { id: "1", name: "Web Development", description: "Learn to build websites using HTML, CSS, JavaScript.", level: "Beginner", knowledgeArea: "Tech Skills", releasedDate: "2023-05-01", rating: 4.5, numEnrolled: 1200, owner: "Course Owner 1", img: webdevremovebg, link: "/courses/web-development" },
    { id: "2", name: "Data Analytics", description: "Master data analysis with Python and SQL.", level: "Intermediate", knowledgeArea: "Analytical Skills", releasedDate: "2023-03-20", rating: 4.7, numEnrolled: 900, owner: "Course Owner 2", img: dataanaremovebg, link: "/courses/data-analytics" },
    { id: "3", name: "AI & Machine Learning", description: "Dive into AI and Machine Learning concepts and applications.", level: "Advanced", knowledgeArea: "Tech Skills", releasedDate: "2023-02-10", rating: 4.8, numEnrolled: 800, owner: "Course Owner 3", img: aiMlImg, link: "/courses/ai-ml" },
];

const dummyPathways = [
    { id: "1", name: "Tech Skills", description: "Master coding and DevOps skills.", img: techSkillsImg, courses: [{ name: "Coding", link: "/courses/coding" }, { name: "DevOps", link: "/courses/devops" }] },
    { id: "2", name: "Analytical Skills", description: "Learn Big Data and Power BI.", img: analyticalSkillsImg, courses: [{ name: "Big Data", link: "/courses/bigdata" }, { name: "Power BI", link: "/courses/powerbi" }] },
    { id: "3", name: "Business Skills", description: "Build Accounting and Finance expertise.", img: businessSkillsImg, courses: [{ name: "Accounting", link: "/courses/accounting" }, { name: "Finance", link: "/courses/finance" }] },
];


function SearchResults() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get("query") || ""; // Default to empty query
    const category = queryParams.get("category");

    const [searchResults, setSearchResults] = useState({
        courses: [],
        pathways: [],
    });

    const [filters, setFilters] = useState({
        level: "all",
        knowledgeArea: "all",
        sortBy: "popularity",
    });

    useEffect(() => {
        let filteredCourses = dummyCourses.filter((course) =>
            course.name.toLowerCase().includes(query.toLowerCase())
        );

        let filteredPathways = dummyPathways.filter((pathway) =>
            pathway.name.toLowerCase().includes(query.toLowerCase())
        );

        // Handle the category logic:
        if (category === "courses") {
            filteredPathways = []; // Only show courses if category is 'courses'
        } else if (category === "pathways") {
            filteredCourses = []; // Only show pathways if category is 'pathways'
        } else if (category === "all") {
            // Show both courses and pathways when category is 'all'
        }

        // Apply level and knowledge area filters to both courses and pathways
        if (filters.level !== "all") {
            filteredCourses = filteredCourses.filter(
                (course) => course.level === filters.level
            );
            filteredPathways = filteredPathways.filter(
                (pathway) => pathway.courses.some((course) => course.level === filters.level)
            );
        }

        if (filters.knowledgeArea !== "all") {
            filteredCourses = filteredCourses.filter(
                (course) => course.knowledgeArea === filters.knowledgeArea
            );
            filteredPathways = filteredPathways.filter(
                (pathway) => pathway.courses.some((course) => course.knowledgeArea === filters.knowledgeArea)
            );
        }

        // Apply sorting based on "popularity", "rating", or "released"
        if (filters.sortBy === "popularity") {
            filteredCourses.sort((a, b) => b.numEnrolled - a.numEnrolled);
        } else if (filters.sortBy === "rating") {
            filteredCourses.sort((a, b) => b.rating - a.rating);
        } else if (filters.sortBy === "released") {
            filteredCourses.sort(
                (a, b) =>
                    new Date(b.releasedDate) - new Date(a.releasedDate)
            );
        }

        setSearchResults({
            courses: filteredCourses,
            pathways: filteredPathways,
        });
    }, [query, filters, category]);

    return (
        <div className="search-results-container bg-gray-50 px-6 py-12">
            {/* Searched term heading */}
            <div className="mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                    Search Results for:{" "}
                    <span className="text-black-600">
                        "{query || (category === "all" ? "All Courses & Pathways" : category === "courses" ? "All Courses" : "All Pathways")}"
                    </span>
                </h1>
            </div>

            {/* Display Results */}
            <div className="results pt-8">
                {/* Heading for courses and pathways */}
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    {category === "all" ?
                        (searchResults.courses.length > 0 && searchResults.pathways.length > 0 ? "Courses & Pathways" :
                            searchResults.courses.length > 0 ? "Courses" : "Pathways")
                        : category === "courses" ? "Courses" : "Pathways"}
                </h2>

                {/* Show Courses */}
                {category !== "pathways" && searchResults.courses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {searchResults.courses.map((item, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all">
                                <img src={item.img} alt={item.name} className="w-full h-40 object-cover rounded-lg mb-4" />
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.name}</h3>
                                <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                                <Link to={`/courses/${item.id}`} className="text-green-600 hover:text-green-700 font-semibold">
                                    View Course
                                </Link>

                            </div>
                        ))}
                    </div>
                ) : category === "courses" ? (
                    <p>No courses found</p>
                ) : null}

                {/* Show Pathways */}
                {category !== "courses" && searchResults.pathways.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {searchResults.pathways.map((item, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all">
                                <img src={item.img} alt={item.name} className="w-full h-40 object-cover rounded-lg mb-4" />
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.name}</h3>
                                <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                                <Link to={`/pathway/${item.id}`} className="text-green-600 hover:text-green-700 font-semibold">
                                    View Pathway
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : category === "pathways" ? (
                    <p>No pathways found</p>
                ) : null}

                {/* Show No Results Found for "All" */}
                {category === "all" && !searchResults.courses.length && !searchResults.pathways.length && (
                    <p>No results found for all categories</p>
                )}
            </div>
        </div>
    );
}

export default beforeAuthLayout(SearchResults);
