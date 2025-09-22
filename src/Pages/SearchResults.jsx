import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import beforeAuthLayout from "../components/BeforeAuth";
import webdevremovebg from "../assets/Images/webdevremovebg.png";
import dataanaremovebg from "../assets/Images/dataanaremovebg.png";
import aiMlImg from "../assets/Images/aimlremovebg.png";
import techSkillsImg from "../assets/Images/techskills.png";
import analyticalSkillsImg from "../assets/Images/analyticalskills.png";
import businessSkillsImg from "../assets/Images/businessskills.png";

// Dummy data for demonstration purposes
const dummyCourses = [
    {
        name: "Web Development",
        description: "Learn to build websites using HTML, CSS, JavaScript.",
        level: "Beginner",
        knowledgeArea: "Tech Skills",
        releasedDate: "2023-05-01",
        rating: 4.5,
        numEnrolled: 1200,
        owner: "Course Owner 1",
        img: webdevremovebg, // Use imported image
        link: "/courses/web-development",
    },
    {
        name: "Data Analytics",
        description: "Master data analysis with Python and SQL.",
        level: "Intermediate",
        knowledgeArea: "Analytical Skills",
        releasedDate: "2023-03-20",
        rating: 4.7,
        numEnrolled: 900,
        owner: "Course Owner 2",
        img: dataanaremovebg, // Use imported image
        link: "/courses/data-analytics",
    },
];

const dummyPathways = [
    {
        name: "Tech Skills",
        description: "Master coding and DevOps skills.",
        img: techSkillsImg,
        link: "/pathway/tech-skills",
        courses: [
            { name: "Coding", link: "/courses/coding" },
            { name: "DevOps", link: "/courses/devops" },
        ],
    },
    {
        name: "Analytical Skills",
        description: "Learn Big Data and Power BI.",
        img: analyticalSkillsImg,
        link: "/pathway/analytical-skills",
        courses: [
            { name: "Big Data", link: "/courses/bigdata" },
            { name: "Power BI", link: "/courses/powerbi" },
        ],
    },
    {
        name: "Business Skills",
        description: "Build Accounting and Finance expertise.",
        img: businessSkillsImg,
        link: "/pathway/business-skills",
        courses: [
            { name: "Accounting", link: "/courses/accounting" },
            { name: "Finance", link: "/courses/finance" },
        ],
    },
];

function SearchResults() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get("query");
    const category = queryParams.get("category");

    const [searchResults, setSearchResults] = useState({
        courses: [],   // Initialize as empty array
        pathways: [],   // Initialize as empty array
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

        setSearchResults({
            courses: filteredCourses,
            pathways: dummyPathways, // You can use the same filter for pathways here if necessary
        });
    }, [query, filters]);

    return (
        <div className="search-results-container bg-gray-50 px-6 py-12">
            {/* Searched term heading */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                    Search Results for: <span className="text-green-600">"{query}"</span>
                </h1>
            </div>

            {/* Filters Section with overflow handling */}
            <div className="filters mb-8 flex flex-wrap gap-4 justify-center max-h-[300px] overflow-auto">
                <select
                    value={filters.level}
                    onChange={(e) => setFilters({ ...filters, level: e.target.value })}
                    className="px-4 py-2 border rounded-lg focus:outline-none text-gray-700"
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
                    className="px-4 py-2 border rounded-lg focus:outline-none text-gray-700"
                >
                    <option value="all">All Knowledge Areas</option>
                    <option value="Tech Skills">Tech Skills</option>
                    <option value="Analytical Skills">Analytical Skills</option>
                    <option value="Business Skills">Business Skills</option>
                </select>
                <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                    className="px-4 py-2 border rounded-lg focus:outline-none text-gray-700"
                >
                    <option value="popularity">Sort by Popularity</option>
                    <option value="rating">Sort by Rating</option>
                    <option value="released">Sort by Release Date</option>
                </select>
            </div>

            {/* Display Results with padding */}
            <div className="results pt-32"> {/* Add padding to avoid overlap */}
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Courses</h2>
                {searchResults.courses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {searchResults.courses.map((course, idx) => (
                            <div
                                key={idx}
                                className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all"
                            >
                                <img
                                    src={course.img}
                                    alt={course.name}
                                    className="w-full h-40 object-cover rounded-lg mb-4"
                                />
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">{course.name}</h3>
                                <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                                <div className="text-gray-500 text-sm mb-2">
                                    <span className="font-semibold">Level: </span>{course.level}
                                </div>
                                <div className="text-gray-500 text-sm mb-4">
                                    <span className="font-semibold">Rating: </span>{course.rating} ⭐
                                </div>
                                <Link
                                    to={course.link}
                                    className="text-green-600 hover:text-green-700 font-semibold"
                                >
                                    View Course
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No courses found</p>
                )}
            </div>
        </div>
    );
}

export default beforeAuthLayout(SearchResults); // Wrap the component with the layout
