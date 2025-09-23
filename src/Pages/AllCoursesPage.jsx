import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import beforeAuthLayout from "../components/BeforeAuth";
import webdevremovebg from "../assets/Images/webdevremovebg.png";
import dataanaremovebg from "../assets/Images/dataanaremovebg.png";
import aiMlImg from "../assets/Images/aimlremovebg.png";





// Dummy data for courses
const dummyCourses = [
    {
        id: "1",
        name: "Web Development",
        description: "Learn to build websites using HTML, CSS, JavaScript.",
        level: "Beginner",
        knowledgeArea: "Tech Skills",
        releasedDate: "2023-05-01",
        rating: 4.5,
        numEnrolled: 1200,
        owner: "Course Owner 1",
        img: webdevremovebg,
    },
    {
        id: "2",
        name: "Data Analytics",
        description: "Master data analysis with Python and SQL.",
        level: "Intermediate",
        knowledgeArea: "Analytical Skills",
        releasedDate: "2023-03-20",
        rating: 4.7,
        numEnrolled: 900,
        owner: "Course Owner 2",
        img: dataanaremovebg,
    },
    {
        id: "3",
        name: "AI & Machine Learning",
        description: "Dive into AI and Machine Learning concepts and applications.",
        level: "Advanced",
        knowledgeArea: "Tech Skills",
        releasedDate: "2023-02-10",
        rating: 4.8,
        numEnrolled: 800,
        owner: "Course Owner 3",
        img: aiMlImg,
    },

];

const AllCoursesPage = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        // Simulate fetching courses (you can replace it with actual API call)
        setCourses(dummyCourses);
    }, []);

    return (
        <div className="search-results-container bg-gray-50 px-6 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">All Courses</h1>
            {courses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {courses.map((course, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-lg shadow-md">
                            <img
                                src={course.img}
                                alt={course.name}
                                className="w-full h-40 object-cover rounded-lg mb-4"
                            />
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">{course.name}</h3>
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
