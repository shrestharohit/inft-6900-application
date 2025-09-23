import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import beforeAuthLayout from "../components/BeforeAuth";
import { dummyCourses } from "../Pages/dummyData"; // ✅ central source

const AllCoursesPage = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        // Simulate fetching courses (replace with API later)
        setCourses(dummyCourses);
    }, []);

    return (
        <div className="search-results-container bg-gray-50 px-6 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">All Courses</h1>
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
