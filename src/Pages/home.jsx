import React, { useState } from "react";
import { Link } from "react-router-dom";

// Images
import webDevImg from "../assets/Images/webdevremovebg.png";
import dataAnalyticsImg from "../assets/Images/dataanaremovebg.png";
import aiMlImg from "../assets/Images/aimlremovebg.png";
import techSkillsImg from "../assets/Images/techskills.png";       // ✅ new
import analyticalSkillsImg from "../assets/Images/analyticalskills.png"; // ✅ new
import businessSkillsImg from "../assets/Images/businessskills.png";     // ✅ new
import beforeAuthLayout from "../components/BeforeAuth";

function Home() {
    const [hoveredCourse, setHoveredCourse] = useState(null);
    const [hoveredPathway, setHoveredPathway] = useState(null);

    const popularCourses = [
        { name: "Web Development", img: webDevImg, link: "/courses/web-development" },
        { name: "Data Analytics", img: dataAnalyticsImg, link: "/courses/data-analytics" },
        { name: "AI & Machine Learning", img: aiMlImg, link: "/courses/ai-ml" },
    ];

    const trendingPathways = [
        {
            name: "Tech Skills",
            img: techSkillsImg,
            link: "/pathway/tech-skills",
            description: "Master coding and DevOps skills.",
            courses: [
                { name: "Coding", link: "/courses/coding" },
                { name: "DevOps", link: "/courses/devops" },
            ],
        },
        {
            name: "Analytical Skills",
            img: analyticalSkillsImg,
            link: "/pathway/analytical-skills",
            description: "Learn Big Data and Power BI.",
            courses: [
                { name: "Big Data", link: "/courses/bigdata" },
                { name: "Power BI", link: "/courses/powerbi" },
            ],
        },
        {
            name: "Business Skills",
            img: businessSkillsImg,
            link: "/pathway/business-skills",
            description: "Build Accounting and Finance expertise.",
            courses: [
                { name: "Accounting", link: "/courses/accounting" },
                { name: "Finance", link: "/courses/finance" },
            ],
        },
    ];

    return (
        <div className="bg-gray-50 font-inter pb-12">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-[#1f2a60] to-[#4856a6] text-white rounded-xl my-8 max-w-[1150px] mx-auto shadow-lg">
                <div className="text-center py-20 px-6 max-w-3xl mx-auto">
                    <h1 className="font-extrabold text-4xl mb-3">
                        Learn Today. Lead Tomorrow.
                    </h1>
                    <p className="text-lg opacity-90 mb-6">
                        Build real skills with hands-on courses and guided pathways.
                    </p>
                    <Link to="/login">
                        <button className="bg-green-500 text-[#0b142b] px-8 py-3 rounded-lg font-bold text-lg shadow-lg hover:bg-green-600">
                            Get Started
                        </button>
                    </Link>
                </div>
            </section>

            {/* Popular Courses */}
            <section className="max-w-[1150px] mx-auto bg-white rounded-xl shadow p-8 my-10">
                <h2 className="text-3xl font-extrabold text-[#1f2a60] text-center mb-8">
                    Most Popular Courses
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {popularCourses.map((course, idx) => {
                        const isHover = hoveredCourse === idx;
                        return (
                            <Link
                                key={idx}
                                to={course.link}
                                className={`bg-white rounded-xl shadow-md text-center p-6 transition transform ${isHover ? "-translate-y-2 shadow-xl" : ""
                                    }`}
                                onMouseEnter={() => setHoveredCourse(idx)}
                                onMouseLeave={() => setHoveredCourse(null)}
                            >
                                <img
                                    src={course.img}
                                    alt={course.name}
                                    className="w-24 h-24 object-contain mx-auto mb-4"
                                />
                                <h3 className="font-bold text-lg mb-2">{course.name}</h3>
                                <p className="text-gray-600 text-sm">
                                    Explore {course.name} with projects and expert mentors.
                                </p>
                            </Link>
                        );
                    })}
                </div>
                <div className="text-center mt-6">
                    <Link
                        to="/all-courses"
                        className="inline-block bg-gradient-to-r from-[#1f2a60] to-[#4856a6] text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-[#174bcc] my-8 max-w-[1150px] mx-auto"
                    >
                        View All Courses
                    </Link>
                </div>
            </section>

            {/* Trending Pathways */}
            <section className="max-w-[1150px] mx-auto bg-white rounded-xl shadow p-8 my-10">
                <h2 className="text-3xl font-extrabold text-[#1f2a60] text-center mb-8">
                    Trending Pathways
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {trendingPathways.map((pathway, idx) => {
                        const isHover = hoveredPathway === idx;
                        return (
                            <Link
                                key={idx}
                                to={pathway.link}
                                className={`bg-white rounded-xl shadow-md text-center p-6 transition transform ${isHover ? "-translate-y-2 shadow-xl" : ""
                                    }`}
                                onMouseEnter={() => setHoveredPathway(idx)}
                                onMouseLeave={() => setHoveredPathway(null)}
                            >
                                <img
                                    src={pathway.img}
                                    alt={pathway.name}
                                    className="w-24 h-24 object-contain mx-auto mb-4"
                                />
                                <h3 className="font-bold text-lg mb-2">{pathway.name}</h3>
                                <p className="text-gray-600 text-sm mb-3">{pathway.description}</p>
                                <div className="flex justify-center flex-wrap gap-2">
                                    {pathway.courses.map((course, cIdx) => (
                                        <Link
                                            key={cIdx}
                                            to={course.link}
                                            className="px-4 py-1 rounded-full bg-green-500 text-[#0b142b] text-sm font-bold shadow hover:bg-green-600"
                                        >
                                            {course.name}
                                        </Link>
                                    ))}
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* ✅ Centered button */}
                <div className="text-center mt-6">
                    <Link
                        to="/all-pathways"
                        className="inline-block bg-gradient-to-r from-[#1f2a60] to-[#4856a6] text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-[#174bcc] my-8 max-w-[1150px] mx-auto"
                    >
                        View All Pathways
                    </Link>
                </div>
            </section>

            {/* Reviews */}
            <section className="max-w-[1150px] mx-auto bg-white rounded-xl shadow p-8 my-10">
                <h2 className="text-3xl font-extrabold text-[#1f2a60] text-center mb-8">
                    What Learners Say
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {[
                        { name: "Alex", text: "This platform really helped me grow my career." },
                        { name: "Sarah", text: "Amazing courses with practical projects." },
                        { name: "John", text: "The user experience is smooth and motivating." },
                    ].map((review, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-xl p-6 flex flex-col justify-between items-center text-center shadow h-56"
                        >
                            <p className="italic text-gray-700">"{review.text}"</p>
                            <div>
                                <span className="block font-bold text-[#1f2a60]">– {review.name}</span>
                                <div className="mt-2 text-yellow-500">⭐⭐⭐⭐⭐</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default beforeAuthLayout(Home);
